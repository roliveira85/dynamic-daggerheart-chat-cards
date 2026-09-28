export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-20 px-4">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-900/20 blur-[120px] rounded-full" />
        <div className="absolute top-10 left-1/4 w-[300px] h-[300px] bg-indigo-900/15 blur-[80px] rounded-full" />
        <div className="absolute top-5 right-1/4 w-[250px] h-[250px] bg-purple-900/15 blur-[80px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-700/60 bg-violet-950/60 text-violet-300 text-xs font-semibold mb-6 tracking-wider uppercase">
          <span>⚔️</span> Foundry VTT Module · Daggerheart System
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          <span className="bg-gradient-to-r from-violet-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
            DH Roll Enhancer
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-4 leading-relaxed">
          Módulo adicional para o sistema Daggerheart no Foundry VTT que transforma os cards
          de <strong className="text-violet-300">Duality Roll</strong> em elementos
          <strong className="text-indigo-300"> interativos e editáveis</strong> — sem quebrar o layout original.
        </p>

        <p className="text-sm text-gray-500 mb-10">
          Compatível com Foundry VTT v12+ · Sistema Daggerheart (Foundryborne)
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[
            { icon: '🎯', text: 'Editar Alvos Pós-Jogada' },
            { icon: '🎲', text: 'Rerrolar Dados Individuais' },
            { icon: '💥', text: 'Modificar Dano Inline' },
            { icon: '⚡', text: 'Habilidades Multi-Alvo' },
            { icon: '🔒', text: 'Layout Original Preservado' },
          ].map(pill => (
            <span
              key={pill.text}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:border-violet-500/40 hover:bg-violet-900/20 transition-all duration-200"
            >
              <span>{pill.icon}</span>
              {pill.text}
            </span>
          ))}
        </div>

        {/* Demo card mockup */}
        <div className="relative inline-block">
          <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-purple-600/20 rounded-2xl blur-xl" />
          <DualityCardMockup />
        </div>
      </div>
    </section>
  )
}

function DualityCardMockup() {
  return (
    <div className="relative bg-[#1a1225] border border-violet-800/40 rounded-xl shadow-2xl shadow-violet-900/30 w-full max-w-sm mx-auto text-left overflow-hidden">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-violet-900/80 to-indigo-900/80 px-4 py-3 border-b border-violet-700/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-sm font-bold text-violet-100">Duality Roll — Hold Then Off</span>
        </div>
        <span className="text-xs text-violet-400 font-medium">Ranger</span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Dice result */}
        <div className="bg-black/30 rounded-lg p-3 border border-white/5">
          <div className="text-xs text-gray-500 mb-2">Resultado</div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400/20 to-yellow-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold text-lg">9</div>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-600/40 flex items-center justify-center text-gray-300 font-bold text-lg">4</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">13</div>
              <div className="text-xs text-amber-400 font-semibold">com Esperança ✦</div>
            </div>
          </div>
        </div>

        {/* Damage — editable */}
        <div className="bg-black/30 rounded-lg p-3 border border-emerald-700/30">
          <div className="text-xs text-gray-500 mb-2 flex justify-between">
            <span>Dano</span>
            <span className="text-emerald-400 text-xs">✏️ editável</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[5, 3].map((v, i) => (
                <div key={i} className="w-8 h-8 rounded-md bg-rose-900/40 border border-rose-600/40 flex items-center justify-center text-rose-300 font-bold text-sm cursor-pointer hover:bg-rose-700/40 transition-colors">
                  {v}
                </div>
              ))}
              <div className="w-8 h-8 rounded-md bg-rose-900/40 border border-rose-600/40 flex items-center justify-center text-rose-300 font-bold text-sm">+2</div>
            </div>
            <div className="text-lg font-black text-rose-300">= 10</div>
          </div>
        </div>

        {/* Targets — editable */}
        <div className="bg-black/30 rounded-lg p-3 border border-indigo-700/30">
          <div className="text-xs text-gray-500 mb-2 flex justify-between">
            <span>Alvos (Hold Then Off)</span>
            <span className="text-indigo-400 text-xs">🎯 editável</span>
          </div>
          <div className="space-y-1.5">
            {['Goblin Saqueador', 'Goblin Arqueiro'].map((name, i) => (
              <div key={i} className="flex items-center justify-between bg-indigo-950/40 rounded-md px-3 py-1.5 border border-indigo-700/30 group">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs text-gray-300">{name}</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">Acerto</span>
              </div>
            ))}
            <button className="w-full flex items-center justify-center gap-1 py-1 rounded-md border border-dashed border-indigo-600/40 text-indigo-400 text-xs hover:bg-indigo-900/20 transition-colors">
              <span>+</span> Adicionar Alvo
            </button>
          </div>
        </div>

        {/* Module badge */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
          <span className="text-[10px] text-violet-500 font-medium">DH Roll Enhancer ativo</span>
        </div>
      </div>
    </div>
  )
}
