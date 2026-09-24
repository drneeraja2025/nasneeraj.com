const { hasEmail, saveLearned, learningEnabled } = require("./lib/learned");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = req.body || {};
  const question = String(body.question || "").trim().slice(0, 500);
  const answer = String(body.answer || "").trim().slice(0, 1500);
  const path = String(body.path || "/").trim().slice(0, 200);

  if (question.length < 4 || answer.length < 4) {
    res.status(400).json({ error: "question and answer are required" });
    return;
  }
  if (hasEmail(`${question}\n${answer}`)) {
    res.status(400).json({ error: "Personal contact details are not stored" });
    return;
  }
  if (!path.startsWith("/")) {
    res.status(400).json({ error: "path must be relative" });
    return;
  }
  if (!learningEnabled()) {
    res.status(200).json({ stored: false });
    return;
  }

  try {
    const result = await saveLearned({ question, answer, path });
    res.status(200).json(result);
  } catch {
    res.status(200).json({ stored: false });
  }
};
