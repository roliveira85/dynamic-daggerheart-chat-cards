export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 px-4 mt-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <span className="text-sm">⚔️</span>
              </div>
              <span className="text-white font-bold text-sm">DH Roll Enhancer</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Módulo adicional para o sistema Foundryborne Daggerheart no Foundry VTT.
              Código aberto, MIT License.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">Recursos</p>
            <ul className="space-y-2">
              {[
                { label: 'Foundry VTT API Docs', href: 'https://foundryvtt.com/api/' },
                { label: 'Sistema Daggerheart (GitHub)', href: 'https://github.com/Foundryborne/daggerheart' },
                { label: 'Foundry Package Development', href: 'https://foundryvtt.com/article/module-development/' },
                { label: 'League of Foundry Devs', href: 'https://discord.gg/foundryvtt' },
              ].map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 hover:text-violet-400 transition-colors"
                  >
                    {link.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Compatibility */}
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">Compatibilidade</p>
            <div className="space-y-2">
              {[
                { label: 'Foundry VTT', value: 'v12 – v13' },
                { label: 'Sistema Daggerheart', value: 'Foundryborne v2+' },
                { label: 'Licença', value: 'MIT' },
              ].map(item => (
                <div key={item.label} className="flex justify-between text-xs">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="text-gray-400">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <div className="flex flex-wrap justify-center gap-4">
            <span>⚠️ Não afiliado à Critical Role, Darrington Press ou Foundry VTT LLC</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Daggerheart™ é marca registrada de Critical Role, LLC</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
