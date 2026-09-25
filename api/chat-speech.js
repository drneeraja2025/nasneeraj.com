const MODEL = "openai/tts-1";

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = req.body || {};
  const text = String(body.text || "").replace(/\s+/g, " ").trim().slice(0, 700);
  if (text.length < 2) {
    res.status(400).json({ error: "text is required" });
    return;
  }

  const male = String(body.voiceType || "female") === "male";
  let generateSpeech;
  try {
    ({ generateSpeech } = await import("ai"));
  } catch {
    res.status(503).json({ error: "Speech runtime is not installed" });
    return;
  }

  try {
    const result = await generateSpeech({
      model: MODEL,
      text,
      voice: male ? "onyx" : "nova",
      outputFormat: "mp3",
      instructions: "Calm conversational pace, warm, not an announcer.",
    });
    res.writeHead(200, {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
    });
    res.end(Buffer.from(result.audio.uint8Array));
  } catch (error) {
    console.error("chat-speech", error && error.message ? error.message : error);
    res.status(502).json({ error: "Speech failed" });
  }
};
