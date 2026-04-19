import { Router, type IRouter } from "express";

const router: IRouter = Router();

const HEADERS: Record<string, string> = {
  "User-Agent": "okhttp/5.1.0",
  "Accept-Encoding": "gzip",
  authorization:
    "eyJzdWIiwsdeOiIyMzQyZmczNHJ0MzR0weMzQiLCJuYW1lIjorwiSm9objJif4md3kbnG",
  sign: "68d6165b72a7f2d8d17b0dc6fe9691abdf77c583",
  pt: "",
  v: "72",
  deviceid: "1b5336ed0297604a",
  "content-type": "application/json; charset=utf-8",
};

const DEVICE_ID = "1b5336ed0297604a";

// Model-specific style prefixes — these influence what the AI generates
// so each model selection produces visually distinct results
const MODEL_STYLE: Record<string, { prefix: string; suffix: string }> = {
  "lumina-2.5": {
    prefix: "cinematic, ultra high quality, professional film, ",
    suffix: ", smooth motion, dramatic lighting, 4K",
  },
  "runway-gen2": {
    prefix: "runway gen-2 cinematic style, realistic motion, film grain, ",
    suffix: ", photorealistic, wide angle, natural light",
  },
  "pika-labs": {
    prefix: "pika labs dynamic style, vibrant colors, fluid animation, ",
    suffix: ", expressive motion, vivid, high contrast",
  },
  "stable-video": {
    prefix: "stable video diffusion, detailed photorealistic, ",
    suffix: ", naturalistic movement, high detail, sharp focus",
  },
  "haiper": {
    prefix: "haiper ai creative style, artistic motion, ",
    suffix: ", flowing animation, stylized, beautiful composition",
  },
  "ltx-studio": {
    prefix: "ltx studio storytelling style, narrative cinematic, ",
    suffix: ", story-driven, emotional, atmospheric lighting",
  },
  "sora": {
    prefix: "sora openai style, hyper-realistic physics, ultra HD, ",
    suffix: ", lifelike motion, world simulation, photorealistic 8K",
  },
};

const DEFAULT_STYLE = {
  prefix: "cinematic, high quality, ",
  suffix: ", smooth motion, 4K",
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateViaAritek(styledPrompt: string, log: any): Promise<string> {
  const txt2videoUrl = "https://text2video.aritek.app/txt2videov3";
  const payload = {
    ai_sound: 0,
    aspect_ratio: "auto",
    ctry_target: "others",
    deviceID: DEVICE_ID,
    isPremium: 0,
    prompt: styledPrompt,
    used: [],
    versionCode: 72,
  };

  const keyRes = await fetch(txt2videoUrl, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(payload),
  });
  const keyData = (await keyRes.json()) as {
    code: number;
    key?: string;
    msg?: string;
  };

  if (keyData.code !== 0 || !keyData.key) {
    log.warn({ code: keyData.code, msg: keyData.msg }, "Video key generation failed");
    throw new Error("Video key generation failed");
  }

  const videoKey = keyData.key;
  const videoUrlApi = "https://text2video.aritek.app/video";
  const videoPayload = { keys: [videoKey] };

  // Poll for up to 90 seconds (30 attempts × 3s)
  for (let attempt = 0; attempt < 30; attempt++) {
    await sleep(3000);
    try {
      const pollRes = await fetch(videoUrlApi, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify(videoPayload),
      });
      const pollData = (await pollRes.json()) as {
        code: number;
        datas?: Array<{ url?: string; safe?: string }>;
      };

      if (pollData.code === 0 && pollData.datas && pollData.datas.length > 0) {
        const videoInfo = pollData.datas[0];
        const url = videoInfo?.url;
        if (url) return url;
      }
    } catch (err) {
      log.error({ err, attempt }, "Error polling video status");
      // Continue polling on transient errors
    }
  }

  throw new Error("Timeout — video generation took too long");
}

router.get("/generate", async (req, res): Promise<void> => {
  const prompt = req.query["prompt"];
  const modelId = typeof req.query["model"] === "string" ? req.query["model"] : "lumina-2.5";

  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({ error: "prompt query parameter is required" });
    return;
  }

  const style = MODEL_STYLE[modelId] ?? DEFAULT_STYLE;
  const styledPrompt = `${style.prefix}${prompt}${style.suffix}`;

  req.log.info({ modelId, prompt: styledPrompt }, "Starting video generation");

  try {
    const url = await generateViaAritek(styledPrompt, req.log);
    const parts = url.split("/");
    const filename = parts[parts.length - 1] ?? "video.mp4";
    res.json({ status: "success", url, filename, model: modelId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    req.log.error({ err, modelId }, "Video generation failed");

    if (message.includes("Timeout")) {
      res.status(504).json({ error: "Video generation timed out. Try a shorter, simpler prompt." });
    } else {
      res.status(500).json({ error: "Video generation failed. Please try again." });
    }
  }
});

export default router;
