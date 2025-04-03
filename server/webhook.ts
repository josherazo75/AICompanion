import { Router } from "express";

const router = Router();

const VERIFY_TOKEN = "je_verify_123";

router.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Messenger webhook verified");
    res.status(200).send(challenge);
  } else {
    console.warn("❌ Messenger webhook verification failed");
    res.sendStatus(403);
  }
});

export default router;
