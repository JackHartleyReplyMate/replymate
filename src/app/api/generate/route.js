import { Configuration, OpenAIApi } from "openai";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  const { reviewText, tone = "friendly", businessName = "Your Business" } = await req.json();

  const prompt = `You are a customer-care assistant for ${businessName}, responding to UK reviews in plain British English.
Reply in a ${tone} tone:

"${reviewText}"`;

  try {
    const completion = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      prompt,
      max_tokens: 150,
      temperature: 0.7,
    });
    const reply = completion.data.choices[0].text.trim();
    res.status(200).json({ reply });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "OpenAI request failed" });
  }
}
