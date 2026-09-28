const problems = [
  {
    icon: '🚫',
    title: 'Cards Estáticos',
    description:
      'O Duality Roll card gerado pelo sistema é completamente estático. Após o roll, não é possível alterar nenhuma informação nele.',
  },
  {
    icon: '🎯',
    title: 'Alvos Não Editáveis',
    description:
      'Habilidades como "Hold Then Off" (Ranger) ou "Whirlwind" requerem múltiplos alvos após a jogada, mas não há como adicioná-los ao card existente.',
  },
  {
    icon: '💥',
    title: 'Dano Fixo',
    description:
      'O valor de dano não pode ser editado inline. Se o GM ou jogador precisar ajustar (resistência, imunidade, bônus), deve fazer manualmente fora do chat.',
  },
  {
    icon: '🎲',
    title: 'Sem Re-Roll Granular',
    description:
      'Não é possível rerrolar apenas um dado específico do roll. O sistema só permite rerolar tudo ou nada.',
  },
  {
    icon: '📋',
    title: 'Consequências de Habilidades Perdidas',
    description:
      'Habilidades com efeitos "on success" não têm onde registrar o que foi usado, criando confusão na mesa.',
  },
  {
    icon: '⚡',
    title: 'Sem Notas na Jogada',
    description:
      'Não dá para adicionar uma nota rápida ao card ("usando Hold Then Off para 2 novos alvos") sem deletar e recriar o card.',
  },
]

export default function ProblemSection() {
  return (
    <section className="py-20 px-4 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-rose-900/10 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section tag */}
        <div className="flex items-center gap-3 mb-10">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-rose-900/50 border border-rose-700/50 flex items-center justify-center text-rose-400">
            ⚠️
          </div>
          <div>
            <p className="text-xs text-rose-400 font-semibold uppercase tracking-widest mb-0.5">O Problema</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Por que o Daggerheart padrão limita sua mesa
            </h2>
          </div>
        </div>

        {/* Context box */}
        <div className="mb-10 bg-rose-950/30 border border-rose-800/40 rounded-xl p-5">
          <p className="text-gray-300 leading-relaxed">
            O sistema <strong className="text-rose-300">Foundryborne Daggerheart</strong> gera um card
            excelente para rolls de Dualidade — mas ele é{' '}
            <strong className="text-rose-300">completamente estático</strong> após a geração.
            Isso é um problema grave especialmente em habilidades como{' '}
            <code className="bg-rose-900/50 px-1.5 py-0.5 rounded text-rose-300 text-sm">Hold Then Off</code>{' '}
            do Ranger, onde o personagem pode usar o resultado de um ataque bem-sucedido para{' '}
            <strong>atingir 2 novos alvos</strong> — mas o card já foi criado sem eles.
          </p>
        </div>

        {/* Problems grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="bg-[#130f1a] border border-rose-900/30 rounded-xl p-5 hover:border-rose-700/50 transition-all duration-200 group"
            >
              <div className="text-2xl mb-3">{problem.icon}</div>
              <h3 className="text-white font-semibold mb-2 group-hover:text-rose-200 transition-colors">
                {problem.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">{problem.description}</p>
            </div>
          ))}
        </div>

        {/* Comparison */}
        <div className="mt-12 bg-[#130f1a] border border-white/10 rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span className="text-sm font-semibold text-rose-400">Sem o módulo (padrão)</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-400">
                {[
                  'Card gerado e congelado',
                  'GM precisa editar manualmente no banco',
                  'Alvos fixos no momento do roll',
                  'Dano não editável inline',
                  'Reroll tudo ou nada',
                  'Habilidades pós-roll geridas fora do sistema',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-rose-500 mt-0.5 flex-shrink-0">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-sm font-semibold text-emerald-400">Com DH Roll Enhancer</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                {[
                  'Card interativo e editável',
                  'Adicionar/remover alvos a qualquer momento',
                  'Modificar dano com +/- inline',
                  'Rerrolar dados individuais',
                  'Notas de habilidade registradas no card',
                  'Layout original 100% preservado',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
