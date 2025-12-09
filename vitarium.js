(function () {
    const config = {
        logo: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
        name: "WhatsApp Chat",
        primaryColor: "#25D366",
        secondaryColor: "#128C7E",
        backgroundColor: "#ffffff",
        fontColor: "#111111",
        welcomeMessage: "Hello! How can we help you today?",
        webhook: "https://n8n.nics.space/webhook/ab09ca3e-53b2-4079-9ddc-bccb2f69551b/webhook"
    };

    function getUTM() {
        const params = new URLSearchParams(window.location.search);
        const utm = {};
        for (const key of params.keys()) {
            if (key.startsWith("utm_")) {
                utm[key] = params.get(key);
            }
        }
        return utm;
    }

    const style = document.createElement("style");
    style.innerHTML = `
        #vitarium-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 360px;
            max-width: 90vw;
            height: 500px;
            max-height: 80vh;
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            border-radius: 12px;
            box-shadow: 0 4px 25px rgba(0,0,0,0.25);
            overflow: hidden;
            background: ${config.backgroundColor};
            transform: scale(0);
            transform-origin: bottom right;
            transition: 0.25s ease;
            z-index: 999999999;
        }

        #vitarium-widget.open {
            transform: scale(1);
        }

        #vitarium-header {
            background: ${config.primaryColor};
            padding: 12px 16px;
            display: flex;
            align-items: center;
            gap: 10px;
            color: white;
            font-weight: bold;
        }

        #vitarium-header img {
            width: 28px;
            height: 28px;
        }

        #vitarium-messages {
            flex: 1;
            padding: 12px;
            overflow-y: auto;
            background: #ece5dd;
            display: flex;
            flex-direction: column;
        }

        .msg {
            max-width: 80%;
            margin-bottom: 10px;
            padding: 8px 12px;
            border-radius: 8px;
            line-height: 1.4;
            font-size: 14px;
            color: #111;
            display: inline-block;
        }

        .msg.bot {
            background: white;
            align-self: flex-start;
            border-radius: 0 8px 8px 8px;
        }

        .msg.user {
            background: #dcf8c6;
            align-self: flex-end;
            border-radius: 8px 0 8px 8px;
        }

        .typing {
            font-size: 12px;
            color: #555;
            margin-bottom: 10px;
            padding-left: 5px;
            font-style: italic;
        }

        #vitarium-input {
            display: flex;
            flex-direction: column;
            padding: 10px;
            background: white;
            border-top: 1px solid #ddd;
        }

        #vitarium-input-inner {
            display: flex;
            gap: 10px;
        }

        #vitarium-input-inner input {
            flex: 1;
            border: none;
            outline: none;
            font-size: 14px;
            padding: 8px;
            border-radius: 6px;
            background: #f6f6f6;
        }

        #vitarium-input-inner button {
            background: ${config.primaryColor};
            border: none;
            padding: 8px 14px;
            color: white;
            border-radius: 6px;
            cursor: pointer;
        }

        #vitarium-footer {
            text-align: center;
            font-size: 11px;
            color: #666;
            margin-top: 6px;
        }

        #vitarium-toggle {
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 62px;
            height: 62px;
            cursor: pointer;
            z-index: 9999999999;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #vitarium-toggle img {
            width: 62px;
            height: 62px;
            object-fit: contain;
        }
    `;
    document.head.appendChild(style);

    const widget = document.createElement("div");
    widget.id = "vitarium-widget";
    widget.innerHTML = `
        <div id="vitarium-header">
            <img src="${config.logo}" alt="logo" />
            <div>${config.name}</div>
        </div>

        <div id="vitarium-messages">
            <div class="msg bot">${config.welcomeMessage}</div>
        </div>

        <div id="vitarium-input">
            <div id="vitarium-input-inner">
                <input type="text" placeholder="Type a message..." />
                <button>Send</button>
            </div>
            <div id="vitarium-footer">by NICS AI</div>
        </div>
    `;
    document.body.appendChild(widget);

    const toggle = document.createElement("div");
    toggle.id = "vitarium-toggle";
    toggle.innerHTML = `<img src="${config.logo}" alt="WhatsApp" />`;
    document.body.appendChild(toggle);

    toggle.onclick = () => widget.classList.toggle("open");

    const input = widget.querySelector("input");
    const btn = widget.querySelector("button");
    const chat = widget.querySelector("#vitarium-messages");

    function addTyping() {
        const typing = document.createElement("div");
        typing.className = "typing";
        typing.id = "bot-typing";
        typing.innerText = "Bot is typing...";
        chat.appendChild(typing);
        chat.scrollTop = chat.scrollHeight;
    }

    function removeTyping() {
        const t = document.getElementById("bot-typing");
        if (t) t.remove();
    }

    function addBotReply(text) {
        const botMsg = document.createElement("div");
        botMsg.className = "msg bot";
        botMsg.innerText = text;
        chat.appendChild(botMsg);
        chat.scrollTop = chat.scrollHeight;
    }

    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        const userMsg = document.createElement("div");
        userMsg.className = "msg user";
        userMsg.innerText = text;
        chat.appendChild(userMsg);

        input.value = "";
        chat.scrollTop = chat.scrollHeight;

        addTyping();

        const payload = {
            message: text,
            timestamp: Date.now(),
            page: window.location.href,
            locale: navigator.language,
            userAgent: navigator.userAgent,
            utm: getUTM()
        };

        fetch(config.webhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(r => r.json())
        .then(data => {
            removeTyping();
            if (data.reply) addBotReply(data.reply);
            else addBotReply("✓ Message sent");
        })
        .catch(e => {
            removeTyping();
            addBotReply("Error: bot is unavailable");
            console.error("n8n error:", e);
        });
    }

    btn.onclick = sendMessage;
    input.addEventListener("keypress", e => {
        if (e.key === "Enter") sendMessage();
    });
})();
