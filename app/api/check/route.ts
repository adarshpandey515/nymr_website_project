import { NextRequest } from "next/server";
import pdfParse from "pdf-parse";
import Groq from "groq-sdk";
import { error } from "console";
import { json } from "stream/consumers";

export const runtime = "nodejs";

function chunkText(text: string, max = 7500) {
  const parts: string[] = [];
  for (let i = 0; i < text.length; i += max) {
    parts.push(text.slice(i, i + max));
  }
  return parts;
}
function extractJSON(str: string) {
  if (!str) return "{}";
  str = str.trim();

  // remove ```json or ``` fences
  str = str.replace(/```json/gi, "").replace(/```/g, "").trim();

  // find first `{` and last `}`
  const start = str.indexOf("{");
  const end = str.lastIndexOf("}");
  if (start !== -1 && end !== -1) {
    return str.slice(start, end + 1);
  }
  return str; // fallback
}


export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const rulesJson = form.get("rules") as string;
  const apiKey = form.get("apikey") as string;

  if (!apiKey) return Response.json({ error: "Missing API Key" }, { status: 400 });

  let rules: string[] = [];
  try { rules = JSON.parse(rulesJson); } catch { rules = []; }

  let text = "";
  if (file) {
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const data = await pdfParse(buffer);
      text = data.text || "";
    } catch { text = ""; }
  }

  if (!text) return Response.json({ error: "Could not read PDF text" }, { status: 400 });

  const groq = new Groq({ apiKey });

  // Chunk text if too large
  const chunks = chunkText(text);
  let analysis = "";

  // Combine chunk analysis
  for (const c of chunks) {
    const res = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct", // your used LLM (adjust if needed)
      messages: [
        { role: "system", content: "You are a legal document analyzer. Summarize precisely with NO external assumptions." },
        { role: "user", content: c }
      ],
      temperature: 0
    });
    analysis += "\n" + res.choices[0].message.content;
  }

  // Apply rules
  const ruleChecks = [];
  for (const r of rules) {
    const res = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        { role: "system", content: "Only return JSON. No explanation. Validate rule against text strictly." },
        { role: "user", content: `Text:\n${analysis}\n\nRule: "${r}"\n\nReturn JSON {passed:boolean, evidence:string , confidence:number}` }
      ],
      temperature: 0
    });

    let out;
    try {
      const rt = res.choices[0].message.content;
      const cleaned = extractJSON(rt || ""); ;

      out = JSON.parse(cleaned);
    } catch (error) {
      out = { passed: false, evidence: "Could not parse LLM response" };
      console.log("JSON parse error:", error ,res.choices[0].message.content);
    }

    ruleChecks.push({ rule: r, ...out });
  }

  return Response.json({
    ok: true,
    results: ruleChecks,
    meta: { chars: text.length, chunks: chunks.length }
  });
}
