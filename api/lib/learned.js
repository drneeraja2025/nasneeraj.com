const PREFIX = "saaniya-learn/";

function learningEnabled() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function hasEmail(value) {
  return /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(value);
}

async function loadLearnedChunks() {
  if (!learningEnabled()) return [];
  try {
    const { list, get } = await import("@vercel/blob");
    const found = await list({ prefix: PREFIX, limit: 40 });
    const blobs = found.blobs || [];
    const chunks = [];
    for (const blob of blobs) {
      try {
        const result = await get(blob.pathname || blob.url, { access: "private" });
        if (!result || !result.stream) continue;
        const raw = await new Response(result.stream).text();
        if (!raw) continue;
        const data = JSON.parse(raw);
        if (!data.question || !data.answer) continue;
        chunks.push({
          id: blob.pathname,
          path: data.path || "/",
          title: "Reviewed answer",
          text: `Question: ${String(data.question).slice(0, 500)} Answer: ${String(data.answer).slice(0, 1500)}`,
        });
      } catch {
        /* skip one bad blob */
      }
    }
    return chunks;
  } catch {
    return [];
  }
}

async function saveLearned({ question, answer, path }) {
  if (!learningEnabled()) return { stored: false };
  const { put } = await import("@vercel/blob");
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  await put(
    `${PREFIX}${id}.json`,
    JSON.stringify({
      question: question.slice(0, 500),
      answer: answer.slice(0, 1500),
      path: path || "/",
      at: new Date().toISOString(),
    }),
    {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
    }
  );
  return { stored: true };
}

module.exports = { learningEnabled, hasEmail, loadLearnedChunks, saveLearned };
