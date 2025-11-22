"use client";
import React, { useState } from "react";
import RuleEditor, { Rule } from "./components/RuleEditor";
import Results, { RuleResult } from "./components/Results";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RuleResult[]>([]);
  const [raw, setRaw] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);
    if (!file) { setError("Upload a PDF first."); return; }
    if (rules.length === 0) { setError("Add at least one rule."); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("rules", JSON.stringify(rules.map(r => r.text)));
      const res = await fetch("/api/check", { method: "POST", body: fd });
      const json = await res.json();
      setRaw(json);
      setResults(json.results || []);
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{maxWidth:800, margin:"0 auto", padding:"2rem", fontFamily:"system-ui, sans-serif"}}>
      <h1 style={{marginTop:0}}>PDF Rule Checker</h1>
      <p style={{color:"#444"}}>Upload a PDF, add rules, get quick pass/fail + JSON. This is demo stub logic, not production grade.</p>

      <section style={{display:"grid", gap:"1rem"}}>
        <div style={{border:"1px solid #ccc", padding:"1rem", borderRadius:8}}>
          <h3 style={{marginTop:0}}>PDF</h3>
          <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} />
          {file && <p style={{fontSize:"0.75rem"}}>Selected: {file.name}</p>}
        </div>
        <RuleEditor onChange={setRules} />
      </section>

      <div style={{marginTop:"1rem", display:"flex", gap:"0.75rem"}}>
        <button disabled={loading} onClick={submit}>{loading ? "Checking..." : "Check Rules"}</button>
        <button type="button" onClick={() => {setFile(null); setRules([]); setResults([]); setRaw(null);}}>Reset</button>
      </div>
      {error && <p style={{color:"#b00", fontSize:"0.8rem"}}>{error}</p>}

      <Results results={results} raw={raw} />
      <footer style={{marginTop:"3rem", fontSize:"0.65rem", color:"#666"}}>
        <p>Demo only. Random scoring. Basic text search snippet. Expand with real validation later.</p>
      </footer>
    </main>
  );
}
