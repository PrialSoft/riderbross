import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  /** Logos en public/marcas: evita que el navegador mantenga PNG viejos al reemplazar archivo con el mismo nombre. */
  async headers() {
    return [
      {
        source: "/marcas/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
  experimental: {
    serverActions: {
      // La foto viaja como base64 dentro del Server Action; subimos el límite para evitar el error de 1MB.
      // Igual comprimimos del lado cliente para no inflar requests.
      bodySizeLimit: "3mb",
    },
  },
};

export default nextConfig;
