import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed" });
  }

  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: "No question provided." });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: question }],
      temperature: 0.5
    });

    const aiAnswer = response.choices[0].message.content;
    res.status(200).json({ answer: aiAnswer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OpenAI request failed." });
  }
}
