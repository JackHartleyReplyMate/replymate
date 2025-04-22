import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(req) {
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
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: "OpenAI request failed" }, { status: 500 });
  }
}
