'use client';

function PlayerInput({ id, number, defaultValue }: { id: string; number: string; defaultValue: string }) {
  return (
    <div className="group relative border-b border-white/10 pb-2 hover:border-coral focus-within:border-coral focus-within:pl-2 transition-all duration-300">
      <span className="absolute right-0 bottom-3 font-handwritten text-white/20 text-sm italic">Jugador {number}</span>
      <input 
        id={id}
        className="w-full bg-transparent border-none p-0 outline-none text-xl font-light text-white placeholder:text-white/10" 
        placeholder="Nombre..." 
        type="text" 
        defaultValue={defaultValue} 
      />
    </div>
  );
}

export default function Home() {
  return (
    <main className="pt-32 pb-24 px-6 md:px-12 lg:ml-24 relative z-10 max-w-7xl mx-auto">
      {/* Intro */}
      <div className="mb-20 flex flex-col items-start lg:items-center">
        <div className="inline-block px-3 py-1 bg-coral/10 rounded-full mb-6">
          <span className="font-handwritten text-coral text-xl">Solo Vibras Costeras</span>
        </div>
        <h1 className="font-display text-5xl md:text-8xl font-black text-white letter-spaced-tight leading-none mb-4 lg:text-center">
          Torneo<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-coral via-sunset to-primary">Config</span>
        </h1>
        <p className="font-body text-lg text-on-surface/60 max-w-xl lg:text-center font-light">
          Creando la experiencia perfecta de torneo americano. Ajusta la configuración para la mejor competición en la arena.
        </p>
      </div>

      {/* Asymmetric Layout Section */}
      <div className="asymmetric-grid mb-12">
        {/* Main Panel: Players */}
        <section className="col-span-12 lg:col-span-8 coastal-mist rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
          <div className="noise-texture absolute inset-0"></div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10">
            <div>
              <h2 className="font-display text-3xl font-bold text-white mb-1">Participantes</h2>
              <p className="font-handwritten text-sunset text-lg">— ¿Quién pisará la arena hoy?</p>
            </div>
            <button className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-primary hover:text-white transition-colors">
              <span className="material-symbols-outlined text-sm">person_add</span>
              Invitar Jugadores
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 relative z-10">
            <PlayerInput id="p1" number="01" defaultValue="Julian Casablancas" />
            <PlayerInput id="p2" number="02" defaultValue="Elena Rossi" />
            <PlayerInput id="p3" number="03" defaultValue="Mark Thompson" />
            <PlayerInput id="p4" number="04" defaultValue="Sofia Chen" />
            <PlayerInput id="p5" number="05" defaultValue="Hugo Mendes" />
            <PlayerInput id="p6" number="06" defaultValue="Clara Varga" />
          </div>
          
          {/* Quick Stats */}
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-wrap gap-12 relative z-10">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest font-bold opacity-30 mb-2">Capacidad Total</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-display font-bold text-white">08</span>
                <span className="text-xs font-handwritten text-coral italic">Lugares ocupados</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest font-bold opacity-30 mb-2">Carga de Pistas</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-display font-bold text-white">Equilibrada</span>
              </div>
            </div>
          </div>
        </section>

        {/* Secondary Column: Stats & Settings */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* Pistas Card */}
          <div className="coastal-mist rounded-[2rem] p-8 relative overflow-hidden group">
            <div className="noise-texture absolute inset-0"></div>
            <span className="material-symbols-outlined absolute top-6 right-6 text-white/10 text-6xl group-hover:text-coral/20 transition-colors">grid_view</span>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-white/40 mb-6 relative z-10">Pistas Disponibles</label>
            <div className="flex items-center gap-8 relative z-10">
              <span className="font-display text-7xl font-light text-white letter-spaced-tight">02</span>
              <div className="flex flex-col gap-2">
                <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-ink transition-all">
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
                <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-ink transition-all">
                  <span className="material-symbols-outlined text-sm">remove</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Rondas Card */}
          <div className="coastal-mist rounded-[2rem] p-8 relative overflow-hidden group">
            <div className="noise-texture absolute inset-0"></div>
            <span className="material-symbols-outlined absolute top-6 right-6 text-white/10 text-6xl group-hover:text-primary/20 transition-colors">cached</span>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-white/40 mb-6 relative z-10">Rondas Automáticas</label>
            <div className="flex items-center gap-8 relative z-10">
              <span className="font-display text-7xl font-light text-white letter-spaced-tight">07</span>
              <div className="flex flex-col gap-2">
                <p className="font-handwritten text-primary text-xl mt-2 italic">Sincronización perfecta.</p>
              </div>
            </div>
          </div>
          
          {/* Match Start CTA (Organic Shape) */}
          <div className="mt-4 flex justify-center lg:justify-start">
            <button className="play-button-organic w-full py-12 px-8 flex items-center justify-center gap-4 group">
              <span className="material-symbols-outlined text-4xl text-ink font-bold group-hover:scale-110 transition-transform">play_arrow</span>
              <span className="font-display text-2xl font-black text-ink uppercase tracking-tighter">¡A JUGAR!</span>
            </button>
          </div>
        </div>
      </div>

      {/* Handcrafted Details */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 items-center opacity-30">
        <div className="flex items-center gap-4 border-l border-white/20 pl-6 py-2">
          <span className="material-symbols-outlined text-3xl">waves</span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest">Espíritu Costero</p>
            <p className="font-handwritten italic text-xs">Brisa Atlántica Integrada</p>
          </div>
        </div>
        <div className="flex flex-col items-center text-center">
          <span className="material-symbols-outlined text-4xl mb-2 text-sunset">wb_sunny</span>
          <p className="text-[8px] font-black uppercase tracking-[0.5em]">LIGA BEACH EDICIÓN '24</p>
        </div>
        <div className="flex items-center justify-end gap-4 border-r border-white/20 pr-6 py-2">
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest">Club Premium</p>
            <p className="font-handwritten italic text-xs">Exclusividad en Padel</p>
          </div>
          <span className="material-symbols-outlined text-3xl">sailing</span>
        </div>
      </div>
    </main>
  );
}
