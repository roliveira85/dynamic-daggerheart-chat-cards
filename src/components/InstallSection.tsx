import { useState } from 'react'

const steps = [
  {
    num: 1,
    icon: '📥',
    title: 'Baixar o módulo',
    desc: 'Faça o download do repositório como ZIP ou clone via git na pasta de módulos do Foundry.',
    code: `# Via git (recomendado)
cd {FoundryData}/Data/modules/
git clone https://github.com/yourname/dh-roll-enhancer

# Ou extrair o ZIP manualmente em:
# {FoundryData}/Data/modules/dh-roll-enhancer/`,
  },
  {
    num: 2,
    icon: '⚙️',
    title: 'Instalar pelo manifest URL',
    desc: 'No Foundry VTT, vá em "Manage Modules" → "Install Module" e cole o URL do manifest.',
    code: `# URL do manifest para instalar diretamente no Foundry:
https://raw.githubusercontent.com/yourname/dh-roll-enhancer/main/module.json

# Foundry irá baixar e instalar automaticamente`,
  },
  {
    num: 3,
    icon: '✅',
    title: 'Ativar no mundo',
    desc: 'Abra seu mundo com o sistema Daggerheart, vá em "Manage Modules" e ative o "DH Roll Enhancer".',
    code: `# Verificar se está ativo via console do Foundry (F12):
game.modules.get('dh-roll-enhancer')?.active
// → true`,
  },
  {
    num: 4,
    icon: '🎲',
    title: 'Testar',
    desc: 'Faça um roll de Duality com um personagem. O card aparecerá com os controles extras do módulo.',
    code: `# Testar via macro no console do Foundry:
game.modules.get('dh-roll-enhancer').api
// → { addTarget: f, setDamageModifier: f }`,
  },
]

const requirements = [
  { label: 'Foundry VTT', value: 'v12+', bg: 'bg-blue-950/30 border-blue-800/40', text: 'text-blue-300' },
  { label: 'Sistema Daggerheart', value: 'Foundryborne v2.0+', bg: 'bg-violet-950/30 border-violet-800/40', text: 'text-violet-300' },
  { label: 'Node.js (dev)', value: 'v18+ (opcional)', bg: 'bg-emerald-950/30 border-emerald-800/40', text: 'text-emerald-300' },
]

const settings = [
  {
    id: 'allowPlayerEdit',
    label: 'Permitir edição por jogadores',
    default: 'Ativado',
    desc: 'Jogadores podem editar seus próprios cards. Se desativado, apenas o GM pode editar.',
    scope: 'World',
  },
  {
    id: 'showRerollButton',
    label: 'Mostrar botão de re-roll',
    default: 'Ativado',
    desc: 'Exibe o botão de re-roll individual nos dados do card.',
    scope: 'World',
  },
  {
    id: 'requireGMForTarget',
    label: 'Apenas GM pode adicionar alvos',
    default: 'Desativado',
    desc: 'Só o GM pode adicionar novos alvos ao card, mesmo se o jogador for o autor.',
    scope: 'World',
  },
  {
    id: 'showModuleBadge',
    label: 'Mostrar badge do módulo',
    default: 'Ativado',
    desc: 'Exibe o pequeno badge "DH Roll Enhancer" no rodapé do card.',
    scope: 'Client',
  },
]

const compatIssues = [
  {
    module: 'Dice So Nice!',
    status: 'compatible',
    note: 'Totalmente compatível — animação de dados funciona normalmente',
  },
  {
    module: 'Midi QoL',
    status: 'compatible',
    note: 'Sistema diferente (D&D 5e), não interfere',
  },
  {
    module: 'Chat Edit',
    status: 'partial',
    note: 'Funciona juntos, mas evitar editar conteúdo de cards DH via Chat Edit',
  },
  {
    module: 'Token Action HUD',
    status: 'compatible',
    note: 'Sem conflito — HUDs de token são independentes do chat',
  },
  {
    module: 'Permission Viewer',
    status: 'compatible',
    note: 'Compatível, reforça as permissões do módulo',
  },
]

const statusColor: Record<string, { bg: string; text: string; label: string }> = {
  compatible: { bg: 'bg-emerald-900/40', text: 'text-emerald-400', label: '✓ Compatível' },
  partial: { bg: 'bg-amber-900/40', text: 'text-amber-400', label: '⚠ Parcial' },
  incompatible: { bg: 'bg-rose-900/40', text: 'text-rose-400', label: '✗ Incompatível' },
}

export default function InstallSection() {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-900/50 border border-emerald-700/50 flex items-center justify-center">
            📦
          </div>
          <div>
            <p className="text-xs text-emerald-400 font-semibold uppercase tracking-widest mb-0.5">Instalação</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Como instalar e configurar
            </h2>
          </div>
        </div>

        {/* Requirements */}
        <div className="flex flex-wrap gap-3 mb-10">
          {requirements.map(req => (
            <div key={req.label} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${req.bg}`}>
              <div>
                <p className="text-xs text-gray-500">{req.label}</p>
                <p className={`text-sm font-bold ${req.text}`}>{req.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Install steps */}
        <div className="space-y-6 mb-14">
          {steps.map(step => (
            <div key={step.num} className="bg-[#130f1a] border border-white/10 rounded-xl overflow-hidden">
              <div className="flex items-start gap-4 p-5 border-b border-white/5">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-violet-900/50 border border-violet-700/50 flex items-center justify-center font-bold text-violet-300">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-white font-bold flex items-center gap-2">
                    <span>{step.icon}</span> {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">{step.desc}</p>
                </div>
              </div>
              <div className="relative">
                <pre className="bg-[#0a0a0f] p-4 text-xs text-gray-300 font-mono leading-relaxed overflow-x-auto">
                  <code>{step.code}</code>
                </pre>
                <button
                  onClick={() => copy(step.code, `step-${step.num}`)}
                  className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-500 hover:text-gray-300 text-xs transition-all"
                >
                  {copied === `step-${step.num}` ? '✓ Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Settings */}
        <div className="mb-14">
          <h3 className="text-white font-bold text-xl mb-5 flex items-center gap-2">
            <span>⚙️</span> Configurações disponíveis
          </h3>
          <div className="bg-[#0a0a0f] border border-white/10 rounded-xl overflow-hidden">
            <div className="grid grid-cols-4 gap-0 px-5 py-3 border-b border-white/5 text-xs text-gray-500 font-semibold uppercase tracking-wider">
              <span>Configuração</span>
              <span className="hidden sm:block">Padrão</span>
              <span className="hidden md:block">Escopo</span>
              <span className="col-span-2 md:col-span-1">Descrição</span>
            </div>
            {settings.map((s, i) => (
              <div key={s.id} className={`grid grid-cols-1 sm:grid-cols-4 gap-2 px-5 py-4 ${i < settings.length - 1 ? 'border-b border-white/5' : ''}`}>
                <div>
                  <code className="text-xs text-violet-300 font-mono">{s.id}</code>
                  <p className="text-xs text-gray-300 mt-0.5">{s.label}</p>
                </div>
                <div className="hidden sm:flex items-center">
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-900/30 border border-emerald-700/30 text-emerald-400">{s.default}</span>
                </div>
                <div className="hidden md:flex items-center">
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-900/30 border border-blue-700/30 text-blue-400">{s.scope}</span>
                </div>
                <div className="sm:col-span-1">
                  <p className="text-xs text-gray-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compatibility */}
        <div>
          <h3 className="text-white font-bold text-xl mb-5 flex items-center gap-2">
            <span>🔌</span> Compatibilidade com outros módulos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {compatIssues.map(c => {
              const sc = statusColor[c.status]
              return (
                <div key={c.module} className={`flex items-start gap-3 p-4 rounded-xl border ${sc.bg} border-white/10`}>
                  <span className={`text-xs font-bold flex-shrink-0 pt-0.5 ${sc.text}`}>{sc.label}</span>
                  <div>
                    <p className="text-sm text-white font-semibold">{c.module}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{c.note}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 bg-gradient-to-r from-violet-950/60 to-indigo-950/60 border border-violet-700/40 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Pronto para melhorar sua mesa?</h3>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto text-sm">
            O DH Roll Enhancer é de código aberto e gratuito. Contribuições são bem-vindas no GitHub.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => copy('https://raw.githubusercontent.com/yourname/dh-roll-enhancer/main/module.json', 'manifest')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-700 hover:bg-violet-600 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-900/40"
            >
              {copied === 'manifest' ? '✓ Copiado!' : '📋 Copiar URL do Manifest'}
            </button>
            <a
              href="https://github.com/yourname/dh-roll-enhancer"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 font-semibold text-sm transition-all"
            >
              ⭐ Ver no GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
