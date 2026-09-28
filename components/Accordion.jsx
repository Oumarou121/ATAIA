"use client";
import { useId, useState } from "react";

export default function Accordion({ title, rows, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="acc-item">
      <button className="acc-trigger" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        {title}
        <span className="acc-icon">{open ? "−" : "+"}</span>
      </button>
      <div className="acc-panel" id={id} hidden={!open}>
        <dl>
          {rows.map(([k, v]) => (
            <Fragment2 key={k} k={k} v={v} />
          ))}
        </dl>
      </div>
    </div>
  );
}

function Fragment2({ k, v }) {
  return (
    <>
      <dt>{k}</dt>
      <dd>{v}</dd>
    </>
  );
}
