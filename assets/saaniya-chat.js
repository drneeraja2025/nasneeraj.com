(function () {
  var AVATAR = "/assets/mascot/girl/saaniya-chat-avatar.png";

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  var root = el("div", "saaniya-chat");
  var panel = el("section", "saaniya-chat-panel");
  panel.setAttribute("aria-label", "Chat with Saaniya");

  var head = el("div", "saaniya-chat-head");
  var headImg = el("img");
  headImg.src = AVATAR;
  headImg.alt = "Saaniya";
  var titles = el("div");
  titles.appendChild(el("strong", "", "Saaniya"));
  titles.appendChild(el("span", "", "Saaniya Software"));
  var close = el("button", "saaniya-chat-close", "×");
  close.type = "button";
  close.setAttribute("aria-label", "Close chat");
  head.appendChild(headImg);
  head.appendChild(titles);
  head.appendChild(close);

  var log = el("div", "saaniya-chat-log");
  var form = el("form", "saaniya-chat-form");
  var input = document.createElement("input");
  input.type = "text";
  input.name = "message";
  input.placeholder = "Ask about our products";
  input.setAttribute("aria-label", "Message to Saaniya");
  input.maxLength = 500;
  var send = el("button", "", "Send");
  send.type = "submit";
  form.appendChild(input);
  form.appendChild(send);

  panel.appendChild(head);
  panel.appendChild(log);
  panel.appendChild(form);

  var button = el("button", "saaniya-chat-button");
  button.type = "button";
  button.setAttribute("aria-label", "Chat with Saaniya");
  var buttonImg = el("img");
  buttonImg.src = AVATAR;
  buttonImg.alt = "";
  button.appendChild(buttonImg);

  root.appendChild(panel);
  root.appendChild(button);
  document.body.appendChild(root);

  var thread = [];
  var busy = false;

  function addMessage(role, text) {
    var bubble = el("div", "saaniya-chat-msg " + role);
    bubble.textContent = text;
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
    return bubble;
  }

  addMessage(
    "assistant",
    "Hi, I'm Saaniya. Ask me about Saaniya Software products, services, or how to reach the team."
  );

  function setOpen(open) {
    root.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) input.focus();
  }

  button.addEventListener("click", function () {
    setOpen(!root.classList.contains("is-open"));
  });
  close.addEventListener("click", function () {
    setOpen(false);
  });

  function linkify(bubble, sources) {
    if (!sources || !sources.length) return;
    var row = el("div", "saaniya-chat-sources");
    sources.forEach(function (source) {
      var link = document.createElement("a");
      link.href = source.path;
      link.textContent = source.path;
      row.appendChild(link);
    });
    bubble.appendChild(row);
  }

  function addFeedback(bubble, question, answer, path) {
    var row = el("div", "saaniya-chat-feedback");
    var up = el("button", "", "Helpful");
    up.type = "button";
    up.addEventListener("click", function () {
      up.disabled = true;
      fetch("/api/chat-learn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question, answer: answer, path: path || "/" }),
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          row.textContent = data && data.stored ? "Saved for the next index." : "Thanks.";
        })
        .catch(function () {
          row.textContent = "Thanks.";
        });
    });
    row.appendChild(up);
    bubble.appendChild(row);
  }

  function readStream(response, bubble) {
    var reader = response.body.getReader();
    var decoder = new TextDecoder();
    var buffer = "";
    var sources = [];
    var answer = "";

    function consume(line) {
      if (!line.startsWith("data: ")) return;
      var payload = JSON.parse(line.slice(6));
      if (payload.type === "sources") sources = payload.sources || [];
      if (payload.type === "delta") {
        answer += payload.text || "";
        bubble.textContent = answer;
        log.scrollTop = log.scrollHeight;
      }
      if (payload.type === "error") throw new Error(payload.error || "Chat failed");
    }

    function pump() {
      return reader.read().then(function (result) {
        if (result.done) return { answer: answer, sources: sources };
        buffer += decoder.decode(result.value, { stream: true });
        var lines = buffer.split("\n");
        buffer = lines.pop();
        lines.forEach(function (line) {
          if (line.trim()) consume(line.trim());
        });
        return pump();
      });
    }

    return pump();
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var text = input.value.trim();
    if (!text || busy) return;
    busy = true;
    send.disabled = true;
    input.value = "";
    addMessage("user", text);
    thread.push({ role: "user", content: text });
    var bubble = addMessage("assistant", "…");

    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: thread }),
    })
      .then(function (response) {
        if (!response.ok || !response.body) {
          return response.json().then(function (data) {
            throw new Error((data && data.error) || "Chat is unavailable");
          });
        }
        return readStream(response, bubble);
      })
      .then(function (result) {
        var answer = (result.answer || "").trim();
        if (!answer) {
          bubble.textContent = "I could not find that on the site. Please use /contact.";
          answer = bubble.textContent;
        }
        thread.push({ role: "assistant", content: answer });
        linkify(bubble, result.sources);
        var path = result.sources && result.sources[0] ? result.sources[0].path : "/";
        addFeedback(bubble, text, answer, path);
      })
      .catch(function (error) {
        bubble.textContent = error.message || "Saaniya is not connected yet.";
        thread.pop();
      })
      .then(function () {
        busy = false;
        send.disabled = false;
        log.scrollTop = log.scrollHeight;
      });
  });
})();
