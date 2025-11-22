"use client";
import React, { useState } from "react";

export interface Rule {
  id: string;
  text: string;
}

interface Props {
  onChange: (rules: Rule[]) => void;
}

const RuleEditor: React.FC<Props> = ({ onChange }) => {
  const [input, setInput] = useState("");
  const [rules, setRules] = useState<Rule[]>([]);

  function addRule() {
    const trimmed = input.trim();
    if (!trimmed) return;
    const next = [...rules, { id: crypto.randomUUID(), text: trimmed }];
    setRules(next);
    onChange(next);
    setInput("");
  }

  function remove(id: string) {
    const next = rules.filter(r => r.id !== id);
    setRules(next);
    onChange(next);
  }

  return (
    <div style={{border:"1px solid #ccc", padding:"1rem", borderRadius:8}}>
      <h3 style={{marginTop:0}}>Rules</h3>
      <div style={{display:"flex", gap:"0.5rem"}}>
        <input
          placeholder="Write a rule"
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{flex:1, padding:"0.5rem"}}
        />
        <button type="button" onClick={addRule}>Add</button>
      </div>
      {rules.length === 0 && <p style={{fontSize:"0.9rem", color:"#666"}}>No rules yet.</p>}
      <ul style={{listStyle:"none", padding:0, margin:"0.75rem 0 0"}}>
        {rules.map(r => (
          <li key={r.id} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0.35rem 0", borderBottom:"1px dotted #ddd"}}>
            <span>{r.text}</span>
            <button type="button" onClick={() => remove(r.id)} style={{fontSize:"0.7rem"}}>x</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RuleEditor;
