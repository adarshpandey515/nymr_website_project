"use client";
import React from "react";

export interface RuleResult {
  rule: string;
  passed: boolean;
  confidence: number;
  evidence?: string;
}

interface Props { results: RuleResult[]; raw?: any; }

const Results: React.FC<Props> = ({ results, raw }) => {
  if (!results || results.length === 0) return null;
  return (
    <div style={{marginTop:"1.5rem"}}>
      <h3 style={{marginTop:0}}>Evaluation</h3>
      <table style={{width:"100%", borderCollapse:"collapse"}}>
        <thead>
          <tr>
            <th style={th}>Rule</th>
            <th style={th}>Pass?</th>
            <th style={th}>Confidence</th>
            <th style={th}>Evidence</th>
          </tr>
        </thead>
        <tbody className="w-full">
          {results.map((r,i) => (
            <tr key={i} style={{borderTop:"1px solid #eee"}}>
              <td style={td}>{r.rule}</td>
              <td style={td}>{r.passed ? "Yes" : "No"}</td>
              <td style={td}>{r.confidence}</td>
              <td style={td}>{r.evidence}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <details style={{marginTop:"1rem"}}>
        <summary>Raw JSON</summary>
        <pre style={{whiteSpace:"pre-wrap", fontSize:"0.75rem", background:"#fafafa", padding:"0.75rem", border:"1px solid #eee"}}>{JSON.stringify(raw, null, 2)}</pre>
      </details>
    </div>
  );
};

const th: React.CSSProperties = {textAlign:"left", padding:"0.5rem", background:"#f5f5f5", fontSize:"0.8rem"};
const td: React.CSSProperties = {verticalAlign:"top", padding:"0.45rem", fontSize:"0.75rem"};

export default Results;
