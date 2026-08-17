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
  title: "Liga Beach — Torneo Costero Premium",
  description: "Creando la experiencia perfecta de torneo americano.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${montserrat.variable} ${inter.variable} ${caveat.variable} dark antialiased`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body className="text-on-surface font-body selection:bg-coral/30 selection:text-white overflow-x-hidden min-h-full">
        {/* Subtle Background Glows */}
        <div className="fixed top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-coral/5 blur-[150px] rounded-full pointer-events-none z-0"></div>
        <div className="fixed bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
        
        {/* Header */}
        <header className="fixed top-0 w-full z-50 px-6 md:px-12 py-6 flex justify-between items-center bg-transparent backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-10">
            <span className="font-display text-2xl font-extrabold tracking-tighter text-white">LIGA<span className="text-coral">BEACH</span></span>
            <nav className="hidden md:flex gap-8 items-center">
              <a className="text-xs uppercase tracking-widest font-semibold hover:text-coral transition-colors" href="#">Torneos</a>
              <a className="text-xs uppercase tracking-widest font-semibold opacity-50 hover:opacity-100 transition-all" href="#">Pistas</a>
              <a className="text-xs uppercase tracking-widest font-semibold opacity-50 hover:opacity-100 transition-all" href="#">Jugadores</a>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <button className="hidden md:block text-xs font-bold uppercase tracking-widest border border-white/20 px-6 py-2.5 rounded-full hover:bg-white hover:text-ink transition-all">Nuevo Ingreso</button>
            <span className="material-symbols-outlined text-xl cursor-pointer hover:text-coral">notifications</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-coral to-sunset p-[1px]">
              <div className="w-full h-full rounded-full bg-ink flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">person</span>
              </div>
            </div>
          </div>
        </header>

        {/* Sidebar - Editorial Style */}
        <aside className="hidden lg:flex fixed left-0 top-0 h-full w-24 flex-col items-center py-24 border-r border-white/5 z-40">
          <div className="flex flex-col gap-12 mt-12">
            <a className="group relative" href="#">
              <span className="material-symbols-outlined text-coral">space_dashboard</span>
              <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-coral text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase">Inicio</span>
            </a>
            <a className="group relative" href="#">
              <span className="material-symbols-outlined opacity-30 group-hover:opacity-100 transition-opacity">sports_tennis</span>
            </a>
            <a className="group relative" href="#">
              <span className="material-symbols-outlined opacity-30 group-hover:opacity-100 transition-opacity">settings_input_component</span>
            </a>
            <a className="group relative" href="#">
              <span className="material-symbols-outlined opacity-30 group-hover:opacity-100 transition-opacity">history_edu</span>
            </a>
          </div>
          <div className="mt-auto pb-8">
            <div className="rotate-[-90deg] origin-center whitespace-nowrap text-[10px] uppercase tracking-[0.4em] font-bold opacity-20">Costa Premium '24</div>
          </div>
        </aside>

        {children}

        {/* Mobile Bottom Bar - Coastal Style */}
        <nav className="lg:hidden fixed bottom-0 w-full z-50 flex justify-around items-center px-4 py-5 bg-ink/80 backdrop-blur-xl border-t border-white/5">
          <a className="flex flex-col items-center text-coral" href="#"><span className="material-symbols-outlined text-2xl">waves</span></a>
          <a className="flex flex-col items-center opacity-40" href="#"><span className="material-symbols-outlined text-2xl">account_tree</span></a>
          <a className="flex flex-col items-center relative -top-4 w-14 h-14 bg-gradient-to-tr from-coral to-sunset rounded-full shadow-lg justify-center text-ink" href="#">
            <span className="material-symbols-outlined text-2xl font-bold">play_arrow</span>
          </a>
          <a className="flex flex-col items-center opacity-40" href="#"><span className="material-symbols-outlined text-2xl">settings</span></a>
          <a className="flex flex-col items-center opacity-40" href="#"><span className="material-symbols-outlined text-2xl">person</span></a>
        </nav>
      </body>
    </html>
  );
}
