// NICS Chat Widget v4 — Shopify Optimized Edition
(function () {

  if (!window.ChatWidgetConfig) return;
  const cfg = window.ChatWidgetConfig;

  // Inject Styles
  const style = document.createElement("style");
  style.textContent = `
    .nics-chat {
      --color-primary: ${cfg.style.primaryColor};
      --color-secondary: ${cfg.style.secondaryColor};
      --color-bg: ${cfg.style.backgroundColor};
      --color-font: ${cfg.style.fontColor};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .nics-chat .box {
      position: fixed;
      bottom: 20px;
      ${cfg.style.position === "left" ? "left: 20px" : "right: 20px"};
      width: 380px;
      height: 600px;
      background: var(--color-bg);
      border-radius: 14px;
      border: 1px solid rgba(133, 79, 255, .18);
      box-shadow: 0 8px 32px rgba(133, 79, 255, .2);
      overflow: hidden;
      z-index: 999999;
      display: none;
      flex-direction: column;
    }

    .nics-chat .box.open {
      display: flex;
    }

    .nics-chat .toggle {
      position: fixed;
      bottom: 20px;
      ${cfg.style.position === "left" ? "left: 20px" : "right: 20px"};
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, var(--color-secondary), var(--color-primary));
      color: #fff;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(133, 79, 255, .6);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform .25s, box-shadow .25s;
    }

    .nics-chat .toggle:hover {
      transform: scale(1.06);
      box-shadow: 0 6px 18px rgba(133, 79, 255, .7);
    }

    .nics-chat .header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border-bottom: 1px solid rgba(133,79,255,.12);
      position: relative;
    }

    .nics-chat .header img {
      width: 32px;
      height: 32px;
      border-radius: 6px;
    }

    .nics-chat .header span {
      font-weight: 600;
      font-size: 18px;
      color: var(--color-font);
    }

    .nics-chat .close {
      position: absolute;
      right: 16px;
      cursor: pointer;
      opacity: .6;
      font-size: 22px;
    }

    .nics-chat .close:hover {
      opacity: 1;
    }

    .nics-chat .welcome {
      text-align: center;
      padding: 28px 20px;
    }

    .nics-chat .welcome h2 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 20px;
      color: var(--color-font);
    }

    .nics-chat .welcome button {
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      border: none;
      padding: 14px 24px;
      border-radius: 10px;
      color: #fff;
      font-size: 16px;
      cursor: pointer;
      width: 100%;
      max-width: 260px;
      transition: transform .2s;
    }

    .nics-chat .welcome button:hover {
      transform: scale(1.03);
    }

    .nics-chat .messages {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      display: none;
      flex-direction: column;
      gap: 12px;
    }

    .nics-chat .messages.active {
      display: flex;
    }

    .nics-chat .msg {
      padding: 12px 16px;
      border-radius: 12px;
      max-width: 80%;
      line-height: 1.45;
      font-size: 14px;
      word-break: break-word;
    }

    .nics-chat .msg.user {
      align-self: flex-end;
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      color: #fff;
    }

    .nics-chat .msg.bot {
      align-self: flex-start;
      background: var(--color-bg);
      border: 1px solid rgba(133,79,255,.15);
      color: var(--color-font);
    }

    .nics-chat .input {
      display: none;
      padding: 16px;
      border-top: 1px solid rgba(133,79,255,.12);
      gap: 8px;
    }

    .nics-chat .input.active {
      display: flex;
    }

    .nics-chat textarea {
      flex: 1;
      resize: none;
      padding: 10px;
      border-radius: 8px;
      border: 1px solid rgba(133,79,255,.2);
      background: var(--color-bg);
      color: var(--color-font);
      font-size: 14px;
    }

    .nics-chat .send {
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      border: none;
      border-radius: 8px;
      padding: 0 20px;
      color: #fff;
      cursor: pointer;
      font-weight: 500;
    }
  `;
  document.head.appendChild(style);

  // Build Widget
  const widget = document.createElement("div");
  widget.className = "nics-chat";
  widget.innerHTML = `
      <button class="toggle">💬</button>

      <div class="box">
          <div class="header">
              <img src="${cfg.branding.logo}" alt="">
              <span>${cfg.branding.name}</span>
              <div class="close">×</div>
          </div>

          <div class="welcome">
              <h2>${cfg.branding.welcomeText}</h2>
              <button class="start">Send us a message</button>
              <p style="opacity:.7;margin-top:10px;">${cfg.branding.responseTimeText}</p>
          </div>

          <div class="messages"></div>

          <div class="input">
              <textarea placeholder="Type your message..." rows="1"></textarea>
              <button class="send">Send</button>
          </div>
      </div>
  `;
  document.body.appendChild(widget);

  const box = widget.querySelector(".box");
  const toggle = widget.querySelector(".toggle");
  const close = widget.querySelector(".close");
  const start = widget.querySelector(".start");
  const messages = widget.querySelector(".messages");
  const input = widget.querySelector(".input");
  const textarea = widget.querySelector("textarea");
  const sendBtn = widget.querySelector(".send");

  let sessionId = "";

  toggle.onclick = () => box.classList.add("open");
  close.onclick = () => box.classList.remove("open");

  start.onclick = async () => {
      sessionId = crypto.randomUUID();

      widget.querySelector(".welcome").style.display = "none";
      messages.classList.add("active");
      input.classList.add("active");

      appendBot("Hello. How can we help you?");
  };

  function appendUser(text) {
      const d = document.createElement("div");
      d.className = "msg user";
      d.textContent = text;
      messages.appendChild(d);
      messages.scrollTop = messages.scrollHeight;
  }

  function appendBot(text) {
      const d = document.createElement("div");
      d.className = "msg bot";
      d.textContent = text;
      messages.appendChild(d);
      messages.scrollTop = messages.scrollHeight;
  }

  async function sendMessage() {
      const text = textarea.value.trim();
      if (!text) return;

      appendUser(text);
      textarea.value = "";

      try {
          const res = await fetch(cfg.webhook.url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify([
                  {
                      action: "sendMessage",
                      route: cfg.webhook.route,
                      sessionId,
                      chatInput: text
                  }
              ])
          });
          const data = await res.json();

          appendBot(Array.isArray(data) ? data[0].output : data.output);
      } catch (err) {
          appendBot("Error connecting to server.");
      }
  }

  sendBtn.onclick = sendMessage;
  textarea.onkeypress = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
      }
  };

})();
