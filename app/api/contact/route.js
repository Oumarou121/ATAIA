import { NextResponse } from "next/server";

// Point d'entrée du formulaire de contact.
// Pour recevoir réellement les messages, branchez ici un service d'e-mail
// (Resend, Nodemailer/SMTP, etc.) en utilisant des variables d'environnement.
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim();
  const message = String(body?.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
  }
  if (name.length > 120 || email.length > 200 || message.length > 5000) {
    return NextResponse.json({ error: "Message trop long." }, { status: 400 });
  }

  // TODO: envoyer l'e-mail ici (ex. await sendMail({ name, email, message }))
  console.log("[contact]", { name, email, message });

  return NextResponse.json({ ok: true });
}
