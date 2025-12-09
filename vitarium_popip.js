(function () {
    const config = {
        logo: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
        name: "WhatsApp Chat",
        primaryColor: "#25D366",
        secondaryColor: "#128C7E",
        backgroundColor: "#ffffff",
        fontColor: "#111111",
        welcomeMessage: "Hallo! Hoe kunnen we u vandaag helpen?",
        phone: "359988899109",
        defaultMessage: "Hallo, ik ben geïnteresseerd in uw producten." // Dutch pre-filled text
    };

    // Inject styles
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

    // Main widget
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
        <input 
            type="text" 
            id="vitarium-input-text" 
            placeholder="Type a message..." 
            value="${config.defaultMessage}" 
        />
        <button>Send</button>
    </div>

    <div id="vitarium-footer">
        <a href="https://aibyteconsult.com" target="_blank" style="color: inherit; text-decoration: none;">
            by NICS AI Ecosystem
        </a>
    </div>
</div>

    `;
    document.body.appendChild(widget);

    // Floating WhatsApp button
    const toggle = document.createElement("div");
    toggle.id = "vitarium-toggle";
    toggle.innerHTML = `<img src="${config.logo}" alt="WhatsApp" />`;
    document.body.appendChild(toggle);

    toggle.onclick = () => widget.classList.toggle("open");

    // Input & button
    const input = widget.querySelector("#vitarium-input-text");
    const btn = widget.querySelector("button");
    const chat = widget.querySelector("#vitarium-messages");

    // Send to WhatsApp
    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        const userMsg = document.createElement("div");
        userMsg.className = "msg user";
        userMsg.innerText = text;
        chat.appendChild(userMsg);
        chat.scrollTop = chat.scrollHeight;

        input.value = config.defaultMessage;

        const encoded = encodeURIComponent(text);
        const url = `https://wa.me/${config.phone}?text=${encoded}`;
        window.open(url, "_blank");
    }

    btn.onclick = sendMessage;
    input.addEventListener("keypress", e => {
        if (e.key === "Enter") sendMessage();
    });
})();
