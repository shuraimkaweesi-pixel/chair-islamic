import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  // Check that the API key is set
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is missing!");
    return res.status(500).json({ error: "OPENAI_API_KEY is missing. Check your Vercel env variables." });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed" });
  }

  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "No question provided." });

  try {
    // Log for debugging
    console.log("Received question:", question);

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: question }],
      temperature: 0.5
    });

    console.log("OpenAI response received");
    res.status(200).json({ answer: response.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI request failed:", error);
    res.status(500).json({ error: "OpenAI request failed. Check your key and model access." });
  }
}
