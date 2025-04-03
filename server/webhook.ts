app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log("🔍 Webhook verify attempt:", {
    mode,
    token,
    challenge,
    expectedToken: VERIFY_TOKEN
  });

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified");
    return res.status(200).send(challenge);
  } else {
    console.warn("❌ Verification failed");
    return res.sendStatus(403);
  }
});
