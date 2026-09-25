const MODEL = "fish-audio/s2.1-pro-free";
const VOICE = {
  female: "933563129e564b19a115bedd57b7406a",
  male: "536d3a5e000945adb7038665781a4aca",
};

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
      voice: male ? VOICE.male : VOICE.female,
      language,
      outputFormat: "mp3",
      instructions: "Calm conversational pace, warm, not an announcer.",
    });
    const bytes = result.audio.uint8Array;
    res.writeHead(200, {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
    });
    res.end(Buffer.from(bytes));
  } catch (error) {
    console.error("chat-speech", error && error.message ? error.message : error);
    res.status(502).json({ error: "Speech failed" });
  }
};
