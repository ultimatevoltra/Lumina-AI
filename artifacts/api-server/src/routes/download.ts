import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/download", async (req, res): Promise<void> => {
  const url = req.query["url"];
  const filename = typeof req.query["filename"] === "string"
    ? req.query["filename"]
    : "lumina-download";

  if (!url || typeof url !== "string") {
    res.status(400).json({ error: "url query parameter is required" });
    return;
  }

  try {
    const upstream = await fetch(url, {
      headers: { "User-Agent": "LuminaAI/1.0" },
    });

    if (!upstream.ok) {
      res.status(502).json({ error: `Upstream responded with ${upstream.status}` });
      return;
    }

    const contentType = upstream.headers.get("content-type") ?? "application/octet-stream";
    const buffer = await upstream.arrayBuffer();

    res.set("Content-Disposition", `attachment; filename="${filename}"`);
    res.set("Content-Type", contentType);
    res.set("Cache-Control", "no-cache");
    res.send(Buffer.from(buffer));
  } catch (err) {
    req.log.error({ err, url }, "Download proxy failed");
    res.status(500).json({ error: "Failed to proxy download" });
  }
});

export default router;
