const MODEL = "google/gemini-3.8-flash-tts";

function languageCode(value) {
  const code = String(value || "en").toLowerCase();
  if (code === "hi" || code === "hi-in") return "hi";
  if (code === "es" || code === "es-es" || code === "es-us") return "es";
  if (code === "mr" || code === "mr-in") return "mr";
  return "en";
}

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

  const language = languageCode(body.language);
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
      language,
      outputFormat: "mp3",
      instructions: male
        ? "Speak as a calm man in a quiet conversation. Natural pace, warm, not an announcer."
        : "Speak as a calm woman in a quiet conversation. Natural pace, warm, not an announcer.",
    });
    const bytes = result.audio.uint8Array;
    res.writeHead(200, {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
    });
    res.end(Buffer.from(bytes));
  } catch {
    res.status(502).json({ error: "Speech failed" });
  }
};
