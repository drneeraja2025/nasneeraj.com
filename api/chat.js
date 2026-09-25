const { retrieve, tokens } = require("./lib/retrieve");
const { loadLearnedChunks } = require("./lib/learned");
const siteIndex = require("../data/site-index.json");

const MODEL = "openai/gpt-4.1-mini";

function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  return {};
}

function cleanMessages(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .slice(-8)
    .map((message) => ({
      role: message && message.role === "assistant" ? "assistant" : "user",
      content: String((message && message.content) || "").trim().slice(0, 2000),
    }))
    .filter((message) => message.content);
}

function queryFrom(messages) {
  const users = messages.filter((message) => message.role === "user").map((message) => message.content);
  return users.slice(-2).join(" ");
}

function excerpts(hits) {
  if (!hits.length) return "(no matching page excerpts)";
  return hits
    .map((hit, index) => `Source ${index + 1}: ${hit.path}\nTitle: ${hit.title}\n${hit.text}`)
    .join("\n\n");
}

function replyLanguage(value) {
  const code = String(value || "en").toLowerCase();
  if (code === "hi" || code === "hi-in") return "hi";
  if (code === "es" || code === "es-es" || code === "es-us") return "es";
  if (code === "mr" || code === "mr-in") return "mr";
  return "en";
}

function languageLine(code) {
  if (code === "hi") {
    return "Reply in Hindi using Devanagari. Keep paths such as /sislms and the name Saaniya Software LLC in Latin script.";
  }
  if (code === "es") {
    return "Reply in Spanish. Keep paths such as /sislms and the name Saaniya Software LLC in Latin script.";
  }
  if (code === "mr") {
    return "Reply in Marathi using Devanagari. Keep paths such as /sislms and the name Saaniya Software LLC in Latin script.";
  }
  return "Reply in English.";
}

function uniqueSources(hits) {
  const seen = new Set();
  const sources = [];
  for (const hit of hits) {
    if (!hit.path || seen.has(hit.path)) continue;
    seen.add(hit.path);
    sources.push({ path: hit.path, title: hit.title });
  }
  return sources.slice(0, 3);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = readBody(req);
  const messages = cleanMessages(body.messages);
  const language = replyLanguage(body.language);
  const last = messages[messages.length - 1];
  if (!last || last.role !== "user") {
    res.status(400).json({ error: "A user message is required" });
    return;
  }

  const learned = await loadLearnedChunks();
  let query = queryFrom(messages);
  if (!tokens(query).length) query = "Saaniya Software products services contact";
  const hits = retrieve([...(siteIndex.chunks || []), ...learned], query, 5);
  const sources = uniqueSources(hits);

  let streamText;
  try {
    ({ streamText } = await import("ai"));
  } catch (error) {
    res.status(503).json({ error: "Chat runtime is not installed" });
    return;
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  });
  res.write(`data: ${JSON.stringify({ type: "sources", sources })}\n\n`);

  try {
    const result = streamText({
      model: MODEL,
      system: [
        "You are Saaniya, the guide on the Saaniya Software LLC public website.",
        "Answer only from the page excerpts below. Keep replies short and warm.",
        "When you use an excerpt, mention its path as a relative link such as /sislms or /contact.",
        "If the excerpts do not contain the answer, say you do not have that on the site and point to /contact.",
        "Do not invent prices, medical advice, or legal advice.",
        "Do not ask for names, emails, or other personal data.",
        "Call the company Saaniya Software LLC. Do not use NAS or a personal founder name.",
        languageLine(language),
        "",
        excerpts(hits),
      ].join("\n"),
      messages,
    });

    let wrote = false;
    for await (const part of result.stream) {
      if (part.type === "text-delta" && part.text) {
        wrote = true;
        res.write(`data: ${JSON.stringify({ type: "delta", text: part.text })}\n\n`);
      } else if (part.type === "error") {
        const message = part.error && part.error.message ? part.error.message : String(part.error || "Chat failed");
        res.write(`data: ${JSON.stringify({ type: "error", error: message.slice(0, 300) })}\n\n`);
      }
    }
    if (!wrote) {
      const reason = await result.finishReason;
      res.write(
        `data: ${JSON.stringify({ type: "error", error: `No reply from the model (${reason || "empty"})` })}\n\n`
      );
    } else {
      res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    }
  } catch (error) {
    const message = error && error.message ? String(error.message) : "Chat failed";
    res.write(`data: ${JSON.stringify({ type: "error", error: message.slice(0, 300) })}\n\n`);
  }
  res.end();
};
