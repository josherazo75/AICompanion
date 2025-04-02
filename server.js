const fetch = require("node-fetch");
const express = require("express");
const { generateChatResponse } = require("./server/openai");
const app = express();
const PORT = process.env.PORT || 3000;

const VERIFY_TOKEN = "aicompanion7508";

app.use(express.json());

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

app.post("/webhook", (req, res) => {
  const body = req.body;

  if (body.object === "page") {
    body.entry.forEach(async (entry) => {
      const event = entry.messaging[0];
      const senderId = event.sender.id;
      const messageText = event.message?.text;

      if (messageText) {
        try {
          const aiResponse = await generateChatResponse([
            { role: "user", content: messageText },
          ]);

          const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

          await fetch(
            `https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                recipient: { id: senderId },
                message: { text: aiResponse },
              }),
            }
          );
        } catch (err) {
          console.error("Error generating or sending message:", err.message);
        }
      }
    });

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Webhook server running on port ${PORT}`);
});
