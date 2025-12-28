import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    serverActions: {
      // La foto viaja como base64 dentro del Server Action; subimos el límite para evitar el error de 1MB.
      // Igual comprimimos del lado cliente para no inflar requests.
      bodySizeLimit: "3mb",
    },
  },
};

export default nextConfig;
