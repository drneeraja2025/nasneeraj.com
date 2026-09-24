const STOP = new Set(
  "the and for with that this from your you are was how what who can our not but has have its about into they them will just than then also more some any all".split(
    " "
  )
);

function tokens(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP.has(word));
}

function scoreChunk(query, queryTokens, chunk) {
  const hay = tokens(`${chunk.title} ${chunk.text}`);
  const titleTokens = new Set(tokens(chunk.title));
  const path = String(chunk.path || "").toLowerCase();
  let score = 0;
  for (const word of queryTokens) {
    if (hay.includes(word)) score += 1;
    if (titleTokens.has(word)) score += 3;
    if (path.includes(word)) score += 3;
  }
  const phrase = query.toLowerCase().replace(/\s+/g, " ").trim();
  if (phrase.length > 4 && String(chunk.text).toLowerCase().includes(phrase)) score += 4;
  return score;
}

function retrieve(chunks, query, limit = 5) {
  const queryTokens = [...new Set(tokens(query))];
  if (!queryTokens.length || !Array.isArray(chunks)) return [];
  return chunks
    .map((chunk) => ({ chunk, score: scoreChunk(query, queryTokens, chunk) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((row) => ({
      path: row.chunk.path,
      title: row.chunk.title,
      text: row.chunk.text,
      score: row.score,
    }));
}

module.exports = { retrieve, tokens };
