(function () {
  var AVATAR = "/assets/mascot/girl/saaniya-chat-avatar.png";
  var LANG_KEY = "saaniya-chat-lang";
  var VOICE_KEY = "saaniya-chat-voice";
  var TYPE_KEY = "saaniya-chat-voice-type";
  var COPY = {
    "en-US": {
      greet: "Hi, I'm Saaniya. Ask me about Saaniya Software products, services, or how to reach the team.",
      placeholder: "Ask about our products",
      send: "Send",
      helpful: "Helpful",
      thanks: "Thanks.",
      saved: "Saved for the next index.",
      missing: "I could not find that on the site. Please use /contact.",
      voiceOn: "Voice on",
      voiceOff: "Voice off",
      female: "Female",
      male: "Male",
    },
    "es-ES": {
      greet: "Hola, soy Saaniya. Pregúntame por los productos, los servicios o cómo contactar al equipo de Saaniya Software.",
      placeholder: "Pregunta por nuestros productos",
      send: "Enviar",
      helpful: "Útil",
      thanks: "Gracias.",
      saved: "Guardado para el próximo índice.",
      missing: "No encontré eso en el sitio. Usa /contact.",
      voiceOn: "Voz activa",
      voiceOff: "Voz apagada",
      female: "Mujer",
      male: "Hombre",
    },
    "hi-IN": {
      greet: "नमस्ते, मैं सानिया हूँ। Saaniya Software के उत्पादों, सेवाओं या संपर्क के बारे में पूछें।",
      placeholder: "उत्पादों के बारे में पूछें",
      send: "भेजें",
      helpful: "उपयोगी",
      thanks: "धन्यवाद।",
      saved: "अगली सूची के लिए सहेजा गया।",
      missing: "यह जानकारी साइट पर नहीं मिली। कृपया /contact देखें।",
      voiceOn: "आवाज़ चालू",
      voiceOff: "आवाज़ बंद",
      female: "महिला",
      male: "पुरुष",
    },
    "mr-IN": {
      greet: "नमस्ते, मी सानिया आहे. Saaniya Software ची उत्पादने, सेवा किंवा संपर्क याबद्दल विचारा.",
      placeholder: "उत्पादनांबद्दल विचारा",
      send: "पाठवा",
      helpful: "उपयुक्त",
      thanks: "धन्यवाद.",
      saved: "पुढच्या सूचीसाठी जतन केले.",
      missing: "ही माहिती साइटवर सापडली नाही. कृपया /contact पहा.",
      voiceOn: "आवाज सुरू",
      voiceOff: "आवाज बंद",
      female: "स्त्री",
      male: "पुरुष",
    },
  };

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function stored(key, fallback) {
    try {
      return sessionStorage.getItem(key) || fallback;
    } catch (error) {
      return fallback;
    }
  }

  var voiceLanguage = stored(LANG_KEY, "en-US");
  if (!COPY[voiceLanguage]) voiceLanguage = "en-US";
  var voiceEnabled = stored(VOICE_KEY, "1") !== "0";
  var voiceType = stored(TYPE_KEY, "female") === "male" ? "male" : "female";
  var thread = [];
  var busy = false;
  var listening = false;
  var recognition = null;
  var spoken = null;

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

  var tools = el("div", "saaniya-chat-tools");
  var lang = document.createElement("select");
  lang.className = "saaniya-chat-lang";
  lang.setAttribute("aria-label", "Language");
  [
    ["en-US", "EN"],
    ["hi-IN", "HI"],
    ["es-ES", "ES"],
    ["mr-IN", "MR"],
  ].forEach(function (option) {
    var item = document.createElement("option");
    item.value = option[0];
    item.textContent = option[1];
    lang.appendChild(item);
  });
  lang.value = voiceLanguage;
  var gender = el("button", "saaniya-chat-tool");
  gender.type = "button";
  var speaker = el("button", "saaniya-chat-tool");
  speaker.type = "button";
  tools.appendChild(lang);
  tools.appendChild(gender);
  tools.appendChild(speaker);

  var log = el("div", "saaniya-chat-log");
  var form = el("form", "saaniya-chat-form");
  var mic = el("button", "saaniya-chat-mic");
  mic.type = "button";
  mic.setAttribute("aria-label", "Speak");
  mic.textContent = "Mic";
  var input = document.createElement("input");
  input.type = "text";
  input.name = "message";
  input.setAttribute("aria-label", "Message to Saaniya");
  input.maxLength = 500;
  var send = el("button", "saaniya-chat-send");
  send.type = "submit";
  form.appendChild(mic);
  form.appendChild(input);
  form.appendChild(send);

  panel.appendChild(head);
  panel.appendChild(tools);
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

  var greetBubble = addMessage("assistant", COPY[voiceLanguage].greet);
  applyCopy();

  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = function (event) {
      var transcript = event.results[0][0].transcript;
      listening = false;
      mic.classList.remove("is-listening");
      input.value = transcript;
      sendCurrent();
    };
    recognition.onerror = function () {
      listening = false;
      mic.classList.remove("is-listening");
    };
    recognition.onend = function () {
      listening = false;
      mic.classList.remove("is-listening");
    };
  } else {
    mic.disabled = true;
    mic.title = "Voice input is not available in this browser";
  }

  if (window.speechSynthesis) {
    window.speechSynthesis.addEventListener("voiceschanged", function () {
      window.speechSynthesis.getVoices();
    });
  }

  function applyCopy() {
    var copy = COPY[voiceLanguage];
    input.placeholder = copy.placeholder;
    send.textContent = copy.send;
    gender.textContent = voiceType === "female" ? copy.female : copy.male;
    speaker.textContent = voiceEnabled ? copy.voiceOn : copy.voiceOff;
    speaker.setAttribute("aria-pressed", voiceEnabled ? "true" : "false");
    if (thread.length === 0 && greetBubble) greetBubble.textContent = copy.greet;
    if (recognition) recognition.lang = voiceLanguage;
  }

  function remember() {
    try {
      sessionStorage.setItem(LANG_KEY, voiceLanguage);
      sessionStorage.setItem(VOICE_KEY, voiceEnabled ? "1" : "0");
      sessionStorage.setItem(TYPE_KEY, voiceType);
    } catch (error) {
      /* private mode */
    }
  }

  function addMessage(role, text) {
    var bubble = el("div", "saaniya-chat-msg " + role);
    bubble.textContent = text;
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
    return bubble;
  }

  function stopSpeaking() {
    if (spoken) {
      spoken.pause();
      if (spoken.src) URL.revokeObjectURL(spoken.src);
      spoken = null;
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }

  function browserSpeak(text) {
    if (!window.speechSynthesis) return;
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceLanguage;
    utterance.rate = 0.96;
    var voices = window.speechSynthesis.getVoices();
    var prefix = voiceLanguage.split("-")[0];
    var preferred = voices.find(function (voice) {
      var name = voice.name.toLowerCase();
      var matchesLang = voice.lang && voice.lang.toLowerCase().indexOf(prefix) === 0;
      if (!matchesLang) return false;
      var natural = name.indexOf("natural") !== -1 || name.indexOf("neural") !== -1 || name.indexOf("google") !== -1;
      var genderOk = voiceType === "female"
        ? name.indexOf("male") === -1
        : name.indexOf("male") !== -1 || name.indexOf("david") !== -1;
      return natural && genderOk;
    });
    if (preferred) utterance.voice = preferred;
    window.speechSynthesis.speak(utterance);
  }

  function speak(text) {
    if (!voiceEnabled || !text) return;
    stopSpeaking();
    fetch("/api/chat-speech", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: text,
        language: voiceLanguage.slice(0, 2),
        voiceType: voiceType,
      }),
    })
      .then(function (response) {
        if (!response.ok) throw new Error("speech");
        return response.blob();
      })
      .then(function (blob) {
        if (!voiceEnabled) return;
        spoken = new Audio(URL.createObjectURL(blob));
        spoken.play().catch(function () {
          browserSpeak(text);
        });
      })
      .catch(function () {
        browserSpeak(text);
      });
  }

  function setOpen(open) {
    root.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", open ? "true" : "false");
    if (!open) {
      stopSpeaking();
      if (recognition && listening) recognition.stop();
    } else {
      input.focus();
    }
  }

  button.addEventListener("click", function () {
    setOpen(!root.classList.contains("is-open"));
  });
  close.addEventListener("click", function () {
    setOpen(false);
  });
  lang.addEventListener("change", function () {
    voiceLanguage = COPY[lang.value] ? lang.value : "en-US";
    remember();
    applyCopy();
  });
  gender.addEventListener("click", function () {
    voiceType = voiceType === "female" ? "male" : "female";
    remember();
    applyCopy();
  });
  speaker.addEventListener("click", function () {
    voiceEnabled = !voiceEnabled;
    if (!voiceEnabled) stopSpeaking();
    remember();
    applyCopy();
  });
  mic.addEventListener("click", function () {
    if (!recognition || busy) return;
    if (listening) {
      recognition.stop();
      return;
    }
    stopSpeaking();
    input.value = "";
    listening = true;
    mic.classList.add("is-listening");
    recognition.lang = voiceLanguage;
    recognition.start();
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
    var up = el("button", "", COPY[voiceLanguage].helpful);
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
          row.textContent = data && data.stored ? COPY[voiceLanguage].saved : COPY[voiceLanguage].thanks;
        })
        .catch(function () {
          row.textContent = COPY[voiceLanguage].thanks;
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

  function sendCurrent() {
    var text = input.value.trim();
    if (!text || busy) return;
    busy = true;
    send.disabled = true;
    input.value = "";
    addMessage("user", text);
    thread.push({ role: "user", content: text });
    var bubble = addMessage("assistant", "…");
    var apiLanguage = voiceLanguage.slice(0, 2);

    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: thread, language: apiLanguage }),
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
          bubble.textContent = COPY[voiceLanguage].missing;
          answer = bubble.textContent;
        }
        thread.push({ role: "assistant", content: answer });
        linkify(bubble, result.sources);
        var path = result.sources && result.sources[0] ? result.sources[0].path : "/";
        addFeedback(bubble, text, answer, path);
        speak(answer);
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
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    sendCurrent();
  });
})();
