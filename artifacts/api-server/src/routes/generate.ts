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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

router.get("/generate", async (req, res): Promise<void> => {
  const prompt = req.query["prompt"];

  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({ error: "prompt query parameter is required" });
    return;
  }

  const txt2videoUrl = "https://text2video.aritek.app/txt2videov3";
  const payload = {
    ai_sound: 1,
    aspect_ratio: "auto",
    ctry_target: "others",
    deviceID: DEVICE_ID,
    isPremium: 0,
    prompt,
    used: [],
    versionCode: 72,
  };

  let videoKey: string;
  try {
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
      req.log.warn({ code: keyData.code, msg: keyData.msg }, "Video key generation failed");
      res.status(400).json({ error: "Video generation failed — upstream error" });
      return;
    }

    videoKey = keyData.key;
  } catch (err) {
    req.log.error({ err }, "Error requesting video key");
    res.status(500).json({ error: "Failed to start video generation" });
    return;
  }

  const videoUrlApi = "https://text2video.aritek.app/video";
  const videoPayload = { keys: [videoKey] };

  for (let attempt = 0; attempt < 12; attempt++) {
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
        if (url) {
          const parts = url.split("/");
          const filename = parts[parts.length - 1] ?? "video.mp4";
          res.json({
            status: "success",
            url,
            filename,
            safe: videoInfo?.safe ?? "unknown",
          });
          return;
        }
      }
    } catch (err) {
      req.log.error({ err, attempt }, "Error polling video status");
      res.status(500).json({ error: "Error fetching video status" });
      return;
    }

    await sleep(3000);
  }

  res.status(504).json({ error: "Timeout — video generation took too long" });
});

export default router;
