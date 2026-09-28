const approach = [
  {
    step: '01',
    icon: '🪝',
    title: 'Hook renderChatMessage',
    subtitle: 'Interceptar sem Quebrar',
    description:
      'O módulo usa o hook nativo do Foundry VTT para interceptar cada mensagem de chat do tipo Duality Roll. Ele detecta automaticamente se é um card do sistema Daggerheart e injeta os controles interativos, preservando todo o HTML e CSS original.',
    code: `Hooks.on('renderChatMessage', (message, html, data) => {\n  if (!isDaggerheartRoll(message)) return;\n  DHRollEnhancer.enhance(message, html);\n});`,
  },
  {
    step: '02',
    icon: '💾',
    title: 'Flags do ChatMessage',
    subtitle: 'Persistência de Estado',
    description:
      'Toda alteração (alvos adicionados, modificadores de dano, notas) é salva como flags na própria ChatMessage via message.setFlag(). Isso garante que todos os clientes conectados vejam as mudanças em tempo real, e os dados persistem entre sessões.',
    code: `await message.setFlag('dh-roll-enhancer', 'extraTargets', [\n  { id: token.id, name: token.name, hit: true }\n]);\nawait message.setFlag('dh-roll-enhancer', 'damageModifier', +3);`,
  },
  {
    step: '03',
    icon: '🔄',
    title: 'Re-render Automático',
    subtitle: 'Reatividade Nativa',
    description:
      'Quando um flag muda, o Foundry dispara automaticamente renderChatMessage novamente para todos os clientes. O módulo reaplica o estado salvo nos flags, criando uma experiência reativa sem precisar de bibliotecas externas.',
    code: `// Foundry atualiza → re-render automático para todos\nmessage.update({'flags.dh-roll-enhancer': newFlags});\n// → renderChatMessage é chamado novamente em todos os clientes`,
  },
  {
    step: '04',
    icon: '🎯',
    title: 'Target Manager UI',
    subtitle: 'Interface de Alvos',
    description:
      'Um painel inline é adicionado ao card com tokens da cena. O GM ou jogador seleciona novos alvos do canvas e os adiciona ao card. O sistema preserva os alvos originais e marca os extras como "alvos adicionados" (ex: via Hold Then Off).',
    code: `// Detecta tokens selecionados/alvejados no canvas\nconst targets = game.user.targets;\nconst tokenData = [...targets].map(t => ({\n  id: t.id, name: t.name,\n  actorId: t.actor?.id\n}));`,
  },
]

export default function SolutionSection() {
  return (
    <section className="py-20 px-4 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section tag */}
        <div className="flex items-center gap-3 mb-10">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-violet-900/50 border border-violet-700/50 flex items-center justify-center">
            💡
          </div>
          <div>
            <p className="text-xs text-violet-400 font-semibold uppercase tracking-widest mb-0.5">A Solução</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Como o módulo funciona por dentro
            </h2>
          </div>
        </div>

        <p className="text-gray-400 max-w-2xl mb-12 text-sm leading-relaxed">
          O DH Roll Enhancer não modifica nenhum arquivo do sistema Daggerheart.
          Ele se encaixa <strong className="text-violet-300">sobre</strong> o sistema usando as
          APIs nativas do Foundry VTT — hooks, flags e document updates — de forma não-invasiva.
        </p>

        {/* Steps */}
        <div className="space-y-8">
          {approach.map((item, i) => (
            <div
              key={item.step}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-6 items-start ${
                i % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Info */}
              <div className={`${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-violet-500 font-bold">{item.step}</span>
                      <h3 className="text-white font-bold text-lg">{item.title}</h3>
                    </div>
                    <p className="text-violet-400 text-xs font-medium">{item.subtitle}</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </div>

              {/* Code */}
              <div className={`${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="bg-[#0a0a0f] border border-white/10 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                      <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    </div>
                    <span className="text-[11px] text-gray-500 font-mono ml-1">dh-roll-enhancer.js</span>
                  </div>
                  <pre className="p-4 text-xs text-gray-300 font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap break-words">
                    <code>{item.code}</code>
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Key insight */}
        <div className="mt-14 bg-gradient-to-r from-violet-950/50 to-indigo-950/50 border border-violet-700/40 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-violet-900/60 flex items-center justify-center text-xl">
              🔑
            </div>
            <div>
              <h3 className="text-white font-bold mb-2">Ponto-chave da arquitetura</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                O segredo está em usar <code className="bg-violet-900/50 px-1.5 py-0.5 rounded text-violet-300">message.setFlag()</code>{' '}
                combinado com o ciclo de re-render do Foundry. Toda mudança é persistida como dado no documento
                ChatMessage e propagada para todos os clientes em tempo real via WebSocket — o mesmo mecanismo
                que o Foundry usa para sincronizar qualquer outro dado do jogo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
