import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import MuiProvider from "@/components/providers/MuiProvider";
import Navbar from "@/components/Navbar/NavbarWrapper";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "RiderBross - Servicio Técnico de Motocicletas",
  description: "Taller especializado en servicio técnico de motocicletas. Consulta el estado de tu moto por patente.",
  keywords: "motocicletas, servicio técnico, taller, RiderBross",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={montserrat.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Creepster&family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <MuiProvider>
          <Navbar />
          <main style={{ minHeight: 'calc(100vh - 64px)', position: 'relative', zIndex: 1 }}>
            {children}
          </main>
        </MuiProvider>
      </body>
    </html>
  );
}
