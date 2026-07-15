import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

export const replyGenerationSchema = z.object({
  language: z.enum(["English","Hindi","Hinglish"]),
  sentiment: z.enum(["positive","mixed","negative"]),
  category: z.string().min(1),
  severity: z.enum(["low","medium","high"]),
  requiresManagerApproval: z.boolean(),
  factsToVerify: z.array(z.string()),
  draft: z.string().min(20).max(900),
});

export async function generateReviewReply(input: { review:string; rating:number; category?:string|null; tone:string; prohibitedClaims:string[]; escalationCategories:string[] }) {
  if (!process.env.OPENAI_API_KEY) throw new Error("OpenAI is not configured. Add OPENAI_API_KEY, then retry; no fallback has been presented as live AI.");
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const started = Date.now();
  const result = await client.responses.parse({
    model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
    input: [
      { role:"system", content:`You draft safe, concise public Google review replies for a local business. Match the review's English, Hindi, or natural Hinglish. Tone: ${input.tone}. Never promise refunds/compensation, admit liability, claim an investigation occurred, invent facts, or imply automatic publishing. Escalation categories: ${input.escalationCategories.join(", ")}. Prohibited claims: ${input.prohibitedClaims.join(", ")}.` },
      { role:"user", content:`Rating: ${input.rating}/5\nExisting category: ${input.category ?? "unknown"}\nReview: ${input.review}` },
    ],
    text: { format: zodTextFormat(replyGenerationSchema,"locally_review_reply") },
  });
  if (!result.output_parsed) throw new Error("OpenAI returned no validated draft. Nothing was saved; retry is safe.");
  return { ...result.output_parsed, generationMs: Date.now()-started, model: process.env.OPENAI_MODEL ?? "gpt-5-mini" };
}
