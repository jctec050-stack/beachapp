import type { Metadata } from "next";
import { Montserrat, Inter, Caveat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Liga Beach — Torneo",
  description: "Gestión de torneo de playa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${montserrat.variable} ${inter.variable} ${caveat.variable} antialiased`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body className="text-gray-900 bg-gray-50 font-body selection:bg-blue-200 selection:text-gray-900 min-h-screen flex flex-col">
        {/* Simple Classic Header */}
        <header className="w-full bg-white border-b border-gray-200 shadow-sm px-6 py-4 flex justify-between items-center z-50">
          <div className="flex items-center gap-6">
            <span className="font-display text-2xl font-bold tracking-tight text-gray-900">
              LIGA<span className="text-blue-600">BEACH</span>
            </span>
            <nav className="hidden md:flex gap-6 items-center">
              <a className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors" href="/">Torneo Activo</a>
              <a className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors" href="/campeonato">Historial</a>
              <a className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors" href="#">Jugadores</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-gray-400 cursor-pointer hover:text-gray-600">notifications</span>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="material-symbols-outlined text-sm text-gray-600">person</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full relative">
          {children}
        </main>
      </body>
    </html>
  );
}
