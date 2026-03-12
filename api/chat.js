import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { question } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an Islamic assistant for CHAIR ISLAMIC TV." },
        { role: "user", content: question }
      ],
    });

    res.status(200).json({ answer: completion.choices[0].message.content });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI failed to respond" });
  }
}
