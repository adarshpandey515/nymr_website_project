import { NextRequest } from "next/server";
import pdfParse from "pdf-parse";

export const runtime = "nodejs"; // need Buffer

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const rulesJson = form.get("rules") as string | null;
  let rules: string[] = [];
  if (rulesJson) {
    try { rules = JSON.parse(rulesJson); } catch { rules = []; }
  }

  let text = "";
  if (file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const data = await pdfParse(buffer).catch(() => ({ text: "" }));
      text = data.text || "";
    } catch (e) {
      text = "";
    }
  }

  // Fake evaluation logic now: random pass/fail + snippet search
  const results = rules.map(r => {
    const passed = Math.random() > 0.5;
    const score = Math.round(Math.random() * 100);
    let snippet = undefined as string | undefined;
    if (text) {
      const idx = text.toLowerCase().indexOf(r.toLowerCase().split(" ")[0]);
      if (idx !== -1) snippet = text.slice(idx, idx + 140);
    }
    return { rule: r, passed, score, snippet };
  });

  return new Response(JSON.stringify({ ok: true, count: results.length, results, meta: { chars: text.length } }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
