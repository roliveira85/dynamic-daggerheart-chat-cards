import { useState } from 'react'

const features = [
  {
    id: 'targets',
    icon: '🎯',
    color: 'indigo',
    title: 'Gerenciador de Alvos Interativo',
    badge: 'Pós-Roll',
    points: [
      'Adicionar novos alvos do canvas após o roll',
      'Indicar hit/miss por alvo individualmente',
      'Suporte a habilidades multi-alvo (Hold Then Off, Whirlwind, etc.)',
      'Alvo extra marcado como "via habilidade X"',
      'GM pode editar mesmo em cards de jogadores',
      'Sincronização em tempo real para todos os clientes',
    ],
    abilities: ['Hold Then Off (Ranger)', 'Whirlwind (Warrior)', 'Multi-target spells'],
    demo: <TargetDemo />,
  },
  {
    id: 'damage',
    icon: '💥',
    color: 'rose',
    title: 'Editor de Dano Inline',
    badge: 'Edição Rápida',
    points: [
      'Botões +/- para ajustar dano sem recalcular',
      'Modificador temporário sem alterar o roll original',
      'Campo numérico direto para valores exatos',
      'Suporte a dano separado por alvo',
      'Histórico de modificações visível',
      'Compatível com resistências e imunidades',
    ],
    abilities: ['Vulnerable (dobrar dano)', 'Resistant (metade)', 'Bonus situacional'],
    demo: <DamageDemo />,
  },
  {
    id: 'reroll',
    icon: '🎲',
    color: 'amber',
    title: 'Re-roll de Dados Individuais',
    badge: 'Granular',
    points: [
      'Clicar em qualquer dado para rerrolá-lo',
      'Dado original marcado como "rerrolado"',
      'Histórico de todos os rolls mantido',
      'Suporte a dados de Hope, Fear e Advantage',
      'Registro visual do dado anterior',
      'Restrição por permissão (só autor ou GM)',
    ],
    abilities: ['Habilidades de reroll', 'Second chances', 'Lucky features'],
    demo: <RerollDemo />,
  },
  {
    id: 'notes',
    icon: '📋',
    color: 'emerald',
    title: 'Notas de Habilidade no Card',
    badge: 'Contexto',
    points: [
      'Adicionar nota rápida ao card via campo de texto',
      'Marcar qual habilidade está sendo usada no resultado',
      'Nota visível para todos os jogadores',
      'Templates de texto para habilidades comuns',
      'Vinculação ao item da habilidade no actor sheet',
      'Nota opcional — não polui o card se vazio',
    ],
    abilities: ['Hold Then Off', 'Spend Hope abilities', 'Reaction triggers'],
    demo: <NotesDemo />,
  },
]

function TargetDemo() {
  const [targets, setTargets] = useState([
    { name: 'Goblin Guerreiro', hit: true, extra: false },
    { name: 'Goblin Arqueiro', hit: false, extra: false },
  ])

  const addTarget = () => {
    setTargets(prev => [...prev, { name: 'Warg Alfa', hit: true, extra: true }])
  }

  return (
    <div className="space-y-2">
      {targets.map((t, i) => (
        <div key={i} className={`flex items-center justify-between rounded-lg px-3 py-2 border text-sm ${
          t.extra ? 'bg-indigo-950/60 border-indigo-600/50' : 'bg-black/30 border-white/10'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${t.hit ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            <span className="text-gray-300">{t.name}</span>
            {t.extra && <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-800/60 text-indigo-300">via Hold Then Off</span>}
          </div>
          <span className={`text-xs font-semibold ${t.hit ? 'text-emerald-400' : 'text-rose-400'}`}>
            {t.hit ? 'Hit' : 'Miss'}
          </span>
        </div>
      ))}
      {targets.length < 3 && (
        <button
          onClick={addTarget}
          className="w-full py-1.5 rounded-lg border border-dashed border-indigo-600/50 text-indigo-400 text-xs hover:bg-indigo-900/20 transition-all"
        >
          + Adicionar via Hold Then Off
        </button>
      )}
      {targets.length >= 3 && (
        <p className="text-xs text-center text-indigo-400">✓ 2 alvos extras adicionados!</p>
      )}
    </div>
  )
}

function DamageDemo() {
  const [modifier, setModifier] = useState(0)
  const baseTotal = 10

  return (
    <div className="space-y-3">
      <div className="bg-black/30 rounded-lg p-3 border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">Roll original</span>
          <span className="text-sm font-bold text-gray-300">2d6+2 = {baseTotal}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Modificador</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setModifier(m => m - 1)} className="w-6 h-6 rounded bg-rose-900/50 border border-rose-700/50 text-rose-300 text-sm font-bold hover:bg-rose-700/40 transition-colors">−</button>
            <span className={`text-sm font-bold w-8 text-center ${modifier > 0 ? 'text-emerald-400' : modifier < 0 ? 'text-rose-400' : 'text-gray-400'}`}>
              {modifier > 0 ? `+${modifier}` : modifier}
            </span>
            <button onClick={() => setModifier(m => m + 1)} className="w-6 h-6 rounded bg-emerald-900/50 border border-emerald-700/50 text-emerald-300 text-sm font-bold hover:bg-emerald-700/40 transition-colors">+</button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between bg-rose-950/40 rounded-lg px-4 py-3 border border-rose-700/40">
        <span className="text-xs text-gray-400">Total final</span>
        <span className="text-xl font-black text-rose-300">{baseTotal + modifier} dano</span>
      </div>
    </div>
  )
}

function RerollDemo() {
  const [hopeVal, setHopeVal] = useState(4)
  const [hopePrev, setHopePrev] = useState<number | null>(null)
  const [fearVal] = useState(9)

  const rerollHope = () => {
    setHopePrev(hopeVal)
    setHopeVal(Math.floor(Math.random() * 12) + 1)
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">Clique em um dado para rerrolá-lo:</p>
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-[10px] text-amber-400 mb-1">Hope</div>
          <div
            onClick={rerollHope}
            className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-lg font-black cursor-pointer transition-all ${
              hopePrev !== null
                ? 'border-amber-500 bg-amber-900/30 text-amber-300'
                : 'border-amber-700/60 bg-amber-900/20 text-amber-300 hover:border-amber-400 hover:scale-105'
            }`}
          >
            {hopeVal}
          </div>
          {hopePrev !== null && (
            <div className="text-[10px] text-gray-500 mt-1 line-through">{hopePrev}</div>
          )}
        </div>
        <div className="text-center">
          <div className="text-[10px] text-gray-400 mb-1">Fear</div>
          <div className="w-12 h-12 rounded-xl border-2 border-gray-700 bg-gray-900/50 flex items-center justify-center text-lg font-black text-gray-300">
            {fearVal}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-gray-500 mb-1">Total</div>
          <div className="text-2xl font-black text-white">{hopeVal + fearVal}</div>
          {hopeVal > fearVal && <div className="text-[10px] text-amber-400">Esperança ✦</div>}
          {fearVal > hopeVal && <div className="text-[10px] text-gray-400">Medo ☠</div>}
          {hopeVal === fearVal && <div className="text-[10px] text-purple-400">Crítico! ⚡</div>}
        </div>
      </div>
      {hopePrev !== null && (
        <p className="text-[10px] text-amber-500">🎲 Hope rerrolado: {hopePrev} → {hopeVal}</p>
      )}
    </div>
  )
}

function NotesDemo() {
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(false)
  const [ability, setAbility] = useState('')

  const save = () => {
    if (note || ability) setSaved(true)
  }

  return (
    <div className="space-y-2">
      {!saved ? (
        <>
          <select
            value={ability}
            onChange={e => setAbility(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-violet-500"
          >
            <option value="">Selecionar habilidade usada...</option>
            <option value="hold-then-off">Hold Then Off (Ranger)</option>
            <option value="whirlwind">Whirlwind (Warrior)</option>
            <option value="spend-hope">Gastar Esperança</option>
          </select>
          <input
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Nota rápida (ex: usando Hold Then Off → 2 alvos extras)"
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-violet-500"
          />
          <button onClick={save} className="w-full py-1.5 rounded-lg bg-violet-700/60 border border-violet-600/50 text-violet-200 text-xs font-semibold hover:bg-violet-600/60 transition-all">
            Salvar nota no card
          </button>
        </>
      ) : (
        <div className="bg-violet-950/40 border border-violet-700/40 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-violet-400 text-sm">📋</span>
            {ability && <span className="text-[10px] px-2 py-0.5 rounded bg-violet-900/60 text-violet-300">{ability === 'hold-then-off' ? 'Hold Then Off' : ability}</span>}
          </div>
          <p className="text-xs text-gray-300">{note || 'Hold Then Off ativado — 2 alvos extras aplicados'}</p>
          <button onClick={() => { setSaved(false); setNote(''); setAbility('') }} className="text-[10px] text-gray-500 hover:text-gray-300 mt-2">editar</button>
        </div>
      )}
    </div>
  )
}

export default function FeaturesSection() {
  const [active, setActive] = useState(features[0].id)
  const feature = features.find(f => f.id === active)!

  const colorMap: Record<string, { tab: string; icon: string; badge: string; point: string }> = {
    indigo: {
      tab: 'data-[active=true]:bg-indigo-700/40 data-[active=true]:border-indigo-600/60 data-[active=true]:text-indigo-200',
      icon: 'bg-indigo-900/50 border-indigo-700/50 text-indigo-300',
      badge: 'bg-indigo-900/50 text-indigo-300 border-indigo-700/50',
      point: 'text-indigo-400',
    },
    rose: {
      tab: 'data-[active=true]:bg-rose-700/40 data-[active=true]:border-rose-600/60 data-[active=true]:text-rose-200',
      icon: 'bg-rose-900/50 border-rose-700/50 text-rose-300',
      badge: 'bg-rose-900/50 text-rose-300 border-rose-700/50',
      point: 'text-rose-400',
    },
    amber: {
      tab: 'data-[active=true]:bg-amber-700/40 data-[active=true]:border-amber-600/60 data-[active=true]:text-amber-200',
      icon: 'bg-amber-900/50 border-amber-700/50 text-amber-300',
      badge: 'bg-amber-900/50 text-amber-300 border-amber-700/50',
      point: 'text-amber-400',
    },
    emerald: {
      tab: 'data-[active=true]:bg-emerald-700/40 data-[active=true]:border-emerald-600/60 data-[active=true]:text-emerald-200',
      icon: 'bg-emerald-900/50 border-emerald-700/50 text-emerald-300',
      badge: 'bg-emerald-900/50 text-emerald-300 border-emerald-700/50',
      point: 'text-emerald-400',
    },
  }

  return (
    <section className="py-20 px-4 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[600px] h-[300px] bg-indigo-900/10 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section tag */}
        <div className="flex items-center gap-3 mb-10">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-900/50 border border-indigo-700/50 flex items-center justify-center">
            ⚡
          </div>
          <div>
            <p className="text-xs text-indigo-400 font-semibold uppercase tracking-widest mb-0.5">Funcionalidades</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              O que o módulo adiciona ao seu jogo
            </h2>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {features.map(f => {
            const c = colorMap[f.color]
            return (
              <button
                key={f.id}
                data-active={active === f.id}
                onClick={() => setActive(f.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${
                  active === f.id
                    ? `${c.tab.replace('data-[active=true]:', '')} border-opacity-60`
                    : 'border-white/10 text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <span>{f.icon}</span>
                <span className="hidden sm:inline">{f.title.split(' ')[0]}</span>
              </button>
            )
          })}
        </div>

        {/* Feature panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Info */}
          <div className="bg-[#130f1a] border border-white/10 rounded-2xl p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center text-2xl ${colorMap[feature.color].icon}`}>
                {feature.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-white font-bold text-lg">{feature.title}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${colorMap[feature.color].badge}`}>
                    {feature.badge}
                  </span>
                </div>
              </div>
            </div>

            <ul className="space-y-2 mb-6">
              {feature.points.map(point => (
                <li key={point} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className={`mt-0.5 flex-shrink-0 ${colorMap[feature.color].point}`}>✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Casos de uso</p>
              <div className="flex flex-wrap gap-2">
                {feature.abilities.map(a => (
                  <span key={a} className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-400">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive demo */}
          <div className="bg-[#130f1a] border border-white/10 rounded-2xl p-6">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-4">Demo interativo</p>
            <div className="bg-[#0d0b12] border border-white/5 rounded-xl p-4">
              {feature.demo}
            </div>
            <p className="text-[10px] text-gray-600 mt-3 text-center">
              Simulação do comportamento no card — interaja para ver em ação
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
