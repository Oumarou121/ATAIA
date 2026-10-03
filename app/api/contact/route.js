import { handleContact } from "@/lib/contact.mjs";

// Nodemailer a besoin de Node.js (pas du runtime « edge »), et la route ne doit jamais être mise en cache.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Les autres méthodes (GET…) reçoivent automatiquement une réponse 405.
export async function POST(request) {
  return handleContact(request);
}
