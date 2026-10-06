"use client";
import { useEffect, useState } from "react";
import WhatsAppButton from "./WhatsAppButton";

/** Bouton WhatsApp flottant : n'apparaît qu'une fois le héros dépassé, pour ne pas le surcharger. */
export default function WhatsAppFloat() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    document.addEventListener("scroll", onScroll, { passive: true });
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`wa-wrap${show ? " on" : ""}`} inert={!show}>
      <WhatsAppButton variant="float" label="WhatsApp" />
    </div>
  );
}