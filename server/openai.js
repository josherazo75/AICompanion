const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function generateChatResponse(messages) {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
    });

    return completion.data.choices[0].message.content;
  } catch (error) {
    console.error("❌ OpenAI Error:", error.response?.data || error.message);
    throw new Error("Failed to get AI response");
  }
}

module.exports = { generateChatResponse };
