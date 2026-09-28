const files = [
  {
    path: 'dh-roll-enhancer/',
    type: 'folder',
    description: 'Pasta raiz do módulo',
    children: [
      { path: 'module.json', type: 'json', description: 'Manifest do módulo — define dependências, compatibilidade, arquivos' },
      { path: 'scripts/', type: 'folder', description: 'Scripts JavaScript/ES6', children: [
        { path: 'main.js', type: 'js', description: 'Entry point — registra hooks e inicializa o módulo' },
        { path: 'RollEnhancer.js', type: 'js', description: 'Classe principal que detecta e melhora os Duality Roll cards' },
        { path: 'TargetManager.js', type: 'js', description: 'Gerencia adição/remoção de alvos no card' },
        { path: 'DamageEditor.js', type: 'js', description: 'Controles de edição de dano inline' },
        { path: 'RerollManager.js', type: 'js', description: 'Re-roll de dados individuais com histórico' },
        { path: 'NoteEditor.js', type: 'js', description: 'Notas e marcação de habilidades no card' },
        { path: 'FlagStore.js', type: 'js', description: 'Abstração para leitura/escrita de flags do ChatMessage' },
        { path: 'PermissionHelper.js', type: 'js', description: 'Verifica quem pode editar cada elemento' },
      ]},
      { path: 'styles/', type: 'folder', description: 'Estilos CSS', children: [
        { path: 'dh-roll-enhancer.css', type: 'css', description: 'Estilos que se integram ao tema do Daggerheart' },
      ]},
      { path: 'templates/', type: 'folder', description: 'Templates Handlebars (HBS)', children: [
        { path: 'target-editor.hbs', type: 'hbs', description: 'UI de seleção de alvos injetada no card' },
        { path: 'damage-editor.hbs', type: 'hbs', description: 'Controles de modificação de dano' },
        { path: 'note-editor.hbs', type: 'hbs', description: 'Campo de nota/habilidade' },
      ]},
      { path: 'lang/', type: 'folder', description: 'Internacionalização', children: [
        { path: 'en.json', type: 'json', description: 'Strings em inglês' },
        { path: 'pt-BR.json', type: 'json', description: 'Strings em português (Brasil)' },
      ]},
    ],
  },
]

const flowSteps = [
  {
    num: '1',
    title: 'Roll acontece',
    desc: 'Jogador clica em uma habilidade ou weapon no character sheet do Daggerheart',
    color: 'violet',
  },
  {
    num: '2',
    title: 'ChatMessage criada',
    desc: 'O sistema Daggerheart cria uma ChatMessage com o Duality Roll card original via template HBS',
    color: 'indigo',
  },
  {
    num: '3',
    title: 'Hook disparado',
    desc: 'renderChatMessage é disparado pelo Foundry. O DH Roll Enhancer verifica se é um Daggerheart roll',
    color: 'blue',
  },
  {
    num: '4',
    title: 'Enhancement injetado',
    desc: 'O módulo injeta botões e controles no HTML do card sem alterar o conteúdo original',
    color: 'cyan',
  },
  {
    num: '5',
    title: 'Jogador edita',
    desc: 'GM ou jogador clica em "Adicionar Alvo", modifica dano, faz reroll, adiciona nota',
    color: 'teal',
  },
  {
    num: '6',
    title: 'Flag salvo',
    desc: 'A alteração é salva via message.setFlag() → todos os clientes recebem o update via WebSocket',
    color: 'emerald',
  },
  {
    num: '7',
    title: 'Re-render',
    desc: 'renderChatMessage é chamado novamente → o módulo restaura o estado dos flags → card atualizado para todos',
    color: 'green',
  },
]

const colorMap: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  violet: { bg: 'bg-violet-900/30', border: 'border-violet-700/50', text: 'text-violet-300', dot: 'bg-violet-500' },
  indigo: { bg: 'bg-indigo-900/30', border: 'border-indigo-700/50', text: 'text-indigo-300', dot: 'bg-indigo-500' },
  blue: { bg: 'bg-blue-900/30', border: 'border-blue-700/50', text: 'text-blue-300', dot: 'bg-blue-500' },
  cyan: { bg: 'bg-cyan-900/30', border: 'border-cyan-700/50', text: 'text-cyan-300', dot: 'bg-cyan-500' },
  teal: { bg: 'bg-teal-900/30', border: 'border-teal-700/50', text: 'text-teal-300', dot: 'bg-teal-500' },
  emerald: { bg: 'bg-emerald-900/30', border: 'border-emerald-700/50', text: 'text-emerald-300', dot: 'bg-emerald-500' },
  green: { bg: 'bg-green-900/30', border: 'border-green-700/50', text: 'text-green-300', dot: 'bg-green-500' },
}

type FileNode = {
  path: string
  type: string
  description: string
  children?: FileNode[]
}

function FileTree({ nodes, depth = 0 }: { nodes: FileNode[]; depth?: number }) {
  const typeColor: Record<string, string> = {
    folder: 'text-yellow-400',
    js: 'text-yellow-300',
    json: 'text-blue-400',
    css: 'text-pink-400',
    hbs: 'text-orange-400',
  }
  const typeIcon: Record<string, string> = {
    folder: '📁',
    js: '📄',
    json: '🔧',
    css: '🎨',
    hbs: '📝',
  }

  return (
    <div className={depth > 0 ? 'ml-4 border-l border-white/5 pl-3 mt-1 space-y-1' : 'space-y-1'}>
      {nodes.map(node => (
        <div key={node.path}>
          <div className="flex items-start gap-2 py-0.5 group hover:bg-white/[0.02] rounded px-1 -mx-1">
            <span className="text-sm flex-shrink-0">{typeIcon[node.type]}</span>
            <div className="min-w-0">
              <span className={`text-xs font-mono font-semibold ${typeColor[node.type]}`}>{node.path}</span>
              <span className="text-xs text-gray-600 ml-2 hidden sm:inline">{node.description}</span>
            </div>
          </div>
          {node.children && <FileTree nodes={node.children} depth={depth + 1} />}
        </div>
      ))}
    </div>
  )
}

export default function ArchitectureSection() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-900/50 border border-blue-700/50 flex items-center justify-center">
            🏗️
          </div>
          <div>
            <p className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-0.5">Arquitetura</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Estrutura técnica do módulo
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* File structure */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span>📁</span> Estrutura de arquivos
            </h3>
            <div className="bg-[#0a0a0f] border border-white/10 rounded-xl p-5 font-mono">
              <FileTree nodes={files[0].children!} />
            </div>
          </div>

          {/* Design decisions */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span>🧠</span> Decisões de design
            </h3>
            {[
              {
                title: 'Sem modificação do sistema',
                icon: '🔒',
                desc: 'O módulo não altera nenhum arquivo do sistema Foundryborne Daggerheart. Usa apenas APIs públicas do Foundry VTT para máxima compatibilidade.',
              },
              {
                title: 'Flags como fonte de verdade',
                icon: '💾',
                desc: 'Todos os dados de enhancements são guardados como flags na ChatMessage. Nenhum estado vive apenas no cliente — tudo é sincronizado via banco do Foundry.',
              },
              {
                title: 'Permissões respeitadas',
                icon: '👤',
                desc: 'O módulo verifica se o usuário é autor da mensagem ou GM antes de mostrar controles de edição. Jogadores veem o card melhorado mas não podem editar cards alheios (configurável).',
              },
              {
                title: 'CSS aditivo',
                icon: '🎨',
                desc: 'Os estilos do módulo usam seletores específicos com namespace (.dh-re-*) para não conflitar com o CSS do sistema. Herdamos as variáveis CSS do Daggerheart.',
              },
              {
                title: 'Zero dependências externas',
                icon: '📦',
                desc: 'Nenhuma biblioteca externa além do jQuery já bundlado no Foundry. O módulo é vanilla JS + CSS + HBS para máxima performance e compatibilidade.',
              },
            ].map(d => (
              <div key={d.title} className="bg-[#130f1a] border border-white/10 rounded-xl p-4 flex gap-3">
                <span className="text-xl flex-shrink-0">{d.icon}</span>
                <div>
                  <h4 className="text-white font-semibold text-sm mb-1">{d.title}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flow diagram */}
        <div>
          <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
            <span>🔄</span> Fluxo completo de uma jogada
          </h3>
          <div className="relative">
            {/* Connector line */}
            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gradient-to-b from-violet-600/40 via-teal-600/40 to-green-600/40 hidden sm:block" />

            <div className="space-y-3">
              {flowSteps.map((step) => {
                const c = colorMap[step.color]
                return (
                  <div key={step.num} className="relative flex items-start gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm z-10 ${c.bg} ${c.border} ${c.text}`}>
                      {step.num}
                    </div>
                    <div className={`flex-1 rounded-xl border p-4 ${c.bg} ${c.border}`}>
                      <h4 className={`font-semibold text-sm mb-1 ${c.text}`}>{step.title}</h4>
                      <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
