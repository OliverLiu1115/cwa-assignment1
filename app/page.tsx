// Tell Next.js this file runs in the browser
"use client";
import { useEffect, useState } from "react";


// Define what a tab item looks like
type Item = { id: string; title: string; content: string };
// Key name for saving tabs into localStorage
const STORAGE_KEY = "home_tabs_items";

export default function HomePage() {
   // State: list of tab items (each has id, title, content)
  const [items, setItems] = useState<Item[]>([
    { id: crypto.randomUUID(), title: "Step 1", content: "Install VSCode" },
    { id: crypto.randomUUID(), title: "Step 2", content: "Install Chrome" },
    { id: crypto.randomUUID(), title: "Step 3", content: "Install Node" },
  ]);
    // State: which tab is currently active
  const [active, setActive] = useState(1);
  // State: generated HTML output
  const [output, setOutput] = useState("");
// Load saved tabs from localStorage when page first loads
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved) && saved.length) setItems(saved);
      }
    } catch {}
  }, []);
  // Save tabs to localStorage whenever items change
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  function addTab() {
    setItems(v => [...v, { id: crypto.randomUUID(), title: `Step ${v.length+1}`, content: "" }]);
  }
   // Escape HTML special characters (for safe output)
  function esc(s: string) {
    return String(s).replace(/[&<>"']/g, c => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!
    ));
  }

  // Generate HTML output based on current tabs
  function generate() {
    const html = `<!doctype html>
<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Tabs Output</title>
<style>
body{font-family:system-ui,Arial;margin:16px}
.tablist{display:flex;gap:8px;border-bottom:1px solid #ccc;padding-bottom:6px}
.tab{border:1px solid #ccc;padding:6px 10px;border-radius:8px;background:#f7f7f7}
.tab[aria-selected="true"]{outline:2px solid #333;background:#fff}
.panel{padding:12px 0}
</style>
<h1>Tabs</h1>
<div role="tablist" class="tablist" aria-label="Tabs">
${items.map((t,i)=>`<button role="tab" id="t${i}" class="tab" aria-selected="${i===0}" aria-controls="p${i}" tabindex="${i===0?0:-1}">${esc(t.title)}</button>`).join('')}
</div>
${items.map((t,i)=>`<div role="tabpanel" class="panel" id="p${i}" aria-labelledby="t${i}" ${i?`hidden`:''}>${esc(t.content)}</div>`).join('')}
<script>(function(){var ts=[...document.querySelectorAll('[role=tab]')],ps=ts.map((_,i)=>document.getElementById('p'+i));
function act(i){ts.forEach((b,j)=>{var on=j===i;b.setAttribute('aria-selected',on);b.setAttribute('tabindex',on?0:-1);ps[j].hidden=!on;if(on)b.focus();});}
document.querySelector('[role=tablist]').addEventListener('click',e=>{var i=ts.indexOf(e.target.closest('[role=tab]'));if(i>-1)act(i);});
document.querySelector('[role=tablist]').addEventListener('keydown',e=>{var c=ts.findIndex(t=>t.getAttribute('aria-selected')==='true'),n=c;if(e.key==='ArrowRight')n=c===ts.length-1?0:c+1;if(e.key==='ArrowLeft')n=c===0?ts.length-1:c-1;if(n!==c){e.preventDefault();act(n);}});
})();</script>
<script>function esc(s){return String(s).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}</script></html>`;
    setOutput(html);
  }
// Copy generated HTML to clipboard
  async function copyOut(){ await navigator.clipboard.writeText(output); alert("Copied!"); }
  // Download generated HTML as a file
  function downloadOut(){
    const blob=new Blob([output],{type:"text/html"});
    const url=URL.createObjectURL(blob);
    const a=Object.assign(document.createElement('a'),{href:url,download:'hello.html'});
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }
// Main UI layout
  return (
    <section className="home-grid">
    
      <aside className="card">
        <h2>Tabs</h2>
        <div className="row space-between">
          <div>Tabs Headers:</div>
          <button className="btn" onClick={addTab} aria-label="Add tab">[+]</button>
        </div>
        <ul className="tabs-list">
          {items.map((t,i)=>(
            <li key={t.id}>
              <button
                className={`tab-pill ${i===active?'is-active':''}`}
                onClick={()=>setActive(i)}
                aria-current={i===active}
              >{t.title}</button>
            </li>
          ))}
        </ul>
      </aside>

      
      <section className="card">
        <h2>Tabs Content</h2>
        <div className="content-box">
          <p style={{marginTop:0}}><strong>{items[active]?.title}</strong></p>
          <textarea
            value={items[active]?.content || ""}
            onChange={(e)=>setItems(v=>v.map((x,i)=>i===active?{...x,content:e.target.value}:x))}
            rows={10}
          />
        </div>
        <div className="row" style={{marginTop:8}}>
          <button className="btn" onClick={generate}>Generate</button>
        </div>
      </section>

      
      <aside className="card">
        <div className="row space-between">
          <label className="label">Output</label>
          <div className="row gap">
            <button className="btn" onClick={copyOut} disabled={!output}>Copy</button>
            <button className="btn" onClick={downloadOut} disabled={!output}>Download</button>
          </div>
        </div>
        <textarea className="output" readOnly value={output} />
      </aside>
    </section>
  );
}
