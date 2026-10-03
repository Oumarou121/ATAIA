/** @type {import('next').NextConfig} */
const nextConfig = {
  // Plus d'export statique : le site tourne sur Vercel avec un serveur Next.js (route /api/contact).
  images: {
    // Les images sont déjà optimisées en WebP par `npm run images` : pas de re-compression par Vercel.
    unoptimized: true,
  },
};

export default nextConfig;
