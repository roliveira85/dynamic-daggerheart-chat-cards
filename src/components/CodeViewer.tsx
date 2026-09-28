import { useState } from 'react'

const codeFiles = [
  {
    id: 'module-json',
    name: 'module.json',
    lang: 'json',
    description: 'Manifest do módulo',
    code: `{
  "id": "dh-roll-enhancer",
  "title": "DH Roll Enhancer",
  "description": "Adds interactive editing to Daggerheart Duality Roll chat cards: targets, damage, rerolls and ability notes.",
  "version": "1.0.0",
  "authors": [
    {
      "name": "Your Name",
      "discord": "yourname"
    }
  ],
  "compatibility": {
    "minimum": "12",
    "verified": "13",
    "maximum": "13"
  },
  "relationships": {
    "systems": [
      {
        "id": "daggerheart",
        "type": "system",
        "compatibility": {
          "minimum": "2.0.0"
        }
      }
    ]
  },
  "esmodules": [
    "scripts/main.js"
  ],
  "styles": [
    "styles/dh-roll-enhancer.css"
  ],
  "languages": [
    {
      "lang": "en",
      "name": "English",
      "path": "lang/en.json"
    },
    {
      "lang": "pt-BR",
      "name": "Português (Brasil)",
      "path": "lang/pt-BR.json"
    }
  ],
  "url": "https://github.com/yourname/dh-roll-enhancer",
  "manifest": "https://raw.githubusercontent.com/yourname/dh-roll-enhancer/main/module.json",
  "download": "https://github.com/yourname/dh-roll-enhancer/releases/latest/download/module.zip"
}`,
  },
  {
    id: 'main-js',
    name: 'scripts/main.js',
    lang: 'javascript',
    description: 'Entry point do módulo',
    code: `/**
 * DH Roll Enhancer — main.js
 * Entry point: registra todos os hooks e inicializa o módulo
 */

import { RollEnhancer } from './RollEnhancer.js';
import { PermissionHelper } from './PermissionHelper.js';

const MODULE_ID = 'dh-roll-enhancer';

// ───────────────────────────────────────────────
// INIT: registrar configurações do módulo
// ───────────────────────────────────────────────
Hooks.once('init', () => {
  console.log(\`\${MODULE_ID} | Initializing DH Roll Enhancer\`);

  game.settings.register(MODULE_ID, 'allowPlayerEdit', {
    name: 'Permitir edição por jogadores',
    hint: 'Se ativado, jogadores podem editar seus próprios cards de roll.',
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(MODULE_ID, 'showRerollButton', {
    name: 'Mostrar botão de re-roll',
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });

  // Pré-carregar templates HBS do módulo
  loadTemplates([
    \`modules/\${MODULE_ID}/templates/target-editor.hbs\`,
    \`modules/\${MODULE_ID}/templates/damage-editor.hbs\`,
    \`modules/\${MODULE_ID}/templates/note-editor.hbs\`,
  ]);
});

// ───────────────────────────────────────────────
// READY: configuração pós-inicialização
// ───────────────────────────────────────────────
Hooks.once('ready', () => {
  console.log(\`\${MODULE_ID} | Ready\`);
});

// ───────────────────────────────────────────────
// CORE HOOK: interceptar renderização de chat cards
// ───────────────────────────────────────────────
Hooks.on('renderChatMessage', (message, html, data) => {
  // Verificar se é um card do sistema Daggerheart
  if (game.system.id !== 'daggerheart') return;
  if (!RollEnhancer.isDaggerheartRoll(message)) return;

  // Verificar permissão do usuário atual
  const canEdit = PermissionHelper.canEdit(message);

  // Aplicar enhancements ao card
  RollEnhancer.enhance(message, html, { canEdit });
});

// ───────────────────────────────────────────────
// Expor API pública para macros/outros módulos
// ───────────────────────────────────────────────
Hooks.once('ready', () => {
  game.modules.get(MODULE_ID).api = {
    addTarget: (messageId, tokenId) =>
      RollEnhancer.addTarget(messageId, tokenId),
    setDamageModifier: (messageId, value) =>
      RollEnhancer.setDamageModifier(messageId, value),
  };
});`,
  },
  {
    id: 'roll-enhancer',
    name: 'scripts/RollEnhancer.js',
    lang: 'javascript',
    description: 'Classe principal de enhancement',
    code: `/**
 * RollEnhancer.js
 * Detecta Daggerheart Duality Roll cards e injeta os controles interativos.
 * Toda a lógica de "o que é um DH roll card" está aqui.
 */

import { TargetManager } from './TargetManager.js';
import { DamageEditor } from './DamageEditor.js';
import { RerollManager } from './RerollManager.js';
import { NoteEditor } from './NoteEditor.js';
import { FlagStore } from './FlagStore.js';

export class RollEnhancer {

  /**
   * Detecta se uma ChatMessage é um Duality Roll do Daggerheart.
   * Inspeciona o sistema da mensagem e o template usado.
   */
  static isDaggerheartRoll(message) {
    // O sistema Daggerheart usa message.system para guardar dados
    const sys = message.system;
    if (!sys) return false;

    // Rolls de Dualidade têm dHope e dFear no roll
    const hasRoll = sys.roll ?? sys.hasRoll;
    if (!hasRoll) return false;

    // Verificar se é um chat card de roll (não de ability use, etc.)
    const content = message.content;
    return content?.includes('chat-roll') || content?.includes('roll-result-container');
  }

  /**
   * Injeta todos os controles no card.
   * Chamado sempre que renderChatMessage dispara para este card.
   */
  static async enhance(message, html, options = {}) {
    const { canEdit = false } = options;
    const flags = FlagStore.getAll(message);

    // Injetar painel de alvos extras
    await TargetManager.inject(message, html, flags, canEdit);

    // Injetar editor de dano
    await DamageEditor.inject(message, html, flags, canEdit);

    // Injetar botões de re-roll (se configurado)
    if (game.settings.get('dh-roll-enhancer', 'showRerollButton')) {
      await RerollManager.inject(message, html, flags, canEdit);
    }

    // Injetar editor de notas
    await NoteEditor.inject(message, html, flags, canEdit);

    // Aplicar estado salvo dos flags ao card renderizado
    RollEnhancer._restoreState(html, flags);

    // Marcar o card como "enhanced" para evitar double-inject
    html.find('.chat-roll').addClass('dh-re-enhanced');
  }

  /**
   * Restaura o estado visual a partir dos flags salvos.
   */
  static _restoreState(html, flags) {
    // Restaurar modificador de dano
    if (flags.damageModifier !== undefined && flags.damageModifier !== 0) {
      const modEl = html.find('.dh-re-damage-modifier');
      modEl.text(flags.damageModifier > 0
        ? \`+\${flags.damageModifier}\`
        : flags.damageModifier
      );
    }

    // Marcar dados que foram rerrolados
    if (flags.rerolledDice?.length) {
      flags.rerolledDice.forEach(({ index, type }) => {
        html.find(\`[data-die-index="\${index}"][data-type="\${type}"]\`)
          .addClass('dh-re-rerolled');
      });
    }
  }

  // ─── API pública ───────────────────────────────

  static async addTarget(messageId, tokenId) {
    const message = game.messages.get(messageId);
    const token = canvas.tokens.get(tokenId);
    if (!message || !token) return;

    const extraTargets = FlagStore.get(message, 'extraTargets') ?? [];
    extraTargets.push({
      id: token.id,
      name: token.name,
      actorId: token.actor?.id,
      hit: null, // null = não determinado
      addedVia: null,
    });

    await FlagStore.set(message, 'extraTargets', extraTargets);
  }

  static async setDamageModifier(messageId, value) {
    const message = game.messages.get(messageId);
    if (!message) return;
    await FlagStore.set(message, 'damageModifier', value);
  }
}`,
  },
  {
    id: 'target-manager',
    name: 'scripts/TargetManager.js',
    lang: 'javascript',
    description: 'Gerenciador de alvos',
    code: `/**
 * TargetManager.js
 * Injeta a UI de gerenciamento de alvos no Duality Roll card.
 * Suporta adicionar alvos extras após o roll (Hold Then Off, Whirlwind, etc.)
 */

import { FlagStore } from './FlagStore.js';

const MODULE_ID = 'dh-roll-enhancer';

export class TargetManager {

  static async inject(message, html, flags, canEdit) {
    const targetSection = html.find('.target-section');
    if (!targetSection.length) return;

    const extraTargets = flags.extraTargets ?? [];

    // Renderizar template de alvos extras
    const templateData = {
      extraTargets,
      canEdit,
      messageId: message.id,
      hasExtras: extraTargets.length > 0,
    };

    const rendered = await renderTemplate(
      \`modules/\${MODULE_ID}/templates/target-editor.hbs\`,
      templateData
    );

    // Injetar após a seção de alvos original (não substituir)
    targetSection.after(rendered);

    // Vincular eventos
    TargetManager._bindEvents(message, html);
  }

  static _bindEvents(message, html) {
    // Botão "Adicionar Alvo do Canvas"
    html.find('.dh-re-add-target-btn').on('click', async (event) => {
      event.preventDefault();

      const targets = [...game.user.targets];
      if (!targets.length) {
        ui.notifications.warn(
          game.i18n.localize('DHRE.TargetManager.noTargets')
        );
        return;
      }

      const extraTargets = FlagStore.get(message, 'extraTargets') ?? [];
      const existingIds = new Set(extraTargets.map(t => t.id));

      let added = 0;
      for (const token of targets) {
        if (existingIds.has(token.id)) continue;
        extraTargets.push({
          id: token.id,
          name: token.name,
          actorId: token.actor?.id,
          hit: true, // padrão: hit
          addedVia: FlagStore.get(message, 'abilityNote') ?? null,
        });
        added++;
      }

      if (added === 0) {
        ui.notifications.info(
          game.i18n.localize('DHRE.TargetManager.alreadyAdded')
        );
        return;
      }

      await FlagStore.set(message, 'extraTargets', extraTargets);
      // → renderChatMessage é chamado automaticamente para todos
    });

    // Toggle hit/miss por alvo
    html.find('.dh-re-target-hit-toggle').on('click', async (event) => {
      const btn = $(event.currentTarget);
      const targetId = btn.closest('[data-target-id]').data('target-id');

      const extraTargets = FlagStore.get(message, 'extraTargets') ?? [];
      const target = extraTargets.find(t => t.id === targetId);
      if (!target) return;

      target.hit = !target.hit;
      await FlagStore.set(message, 'extraTargets', extraTargets);
    });

    // Remover alvo extra
    html.find('.dh-re-target-remove').on('click', async (event) => {
      const targetId = $(event.currentTarget)
        .closest('[data-target-id]')
        .data('target-id');

      const extraTargets = (FlagStore.get(message, 'extraTargets') ?? [])
        .filter(t => t.id !== targetId);

      await FlagStore.set(message, 'extraTargets', extraTargets);
    });
  }
}`,
  },
  {
    id: 'flag-store',
    name: 'scripts/FlagStore.js',
    lang: 'javascript',
    description: 'Abstração de flags',
    code: `/**
 * FlagStore.js
 * Abstração para leitura e escrita de flags no ChatMessage.
 *
 * Flags são o mecanismo de persistência do Foundry VTT para dados
 * arbitrários em documentos. São sincronizados via WebSocket para
 * todos os clientes conectados automaticamente.
 *
 * Estrutura dos flags:
 * flags['dh-roll-enhancer'] = {
 *   extraTargets: [...],      // alvos adicionados pós-roll
 *   damageModifier: 0,        // modificador de dano inline
 *   rerolledDice: [...],      // dados rerrolados com histórico
 *   abilityNote: "",          // nota de habilidade
 *   abilityId: null,          // ID da habilidade usada
 * }
 */

const MODULE_ID = 'dh-roll-enhancer';

export class FlagStore {

  /**
   * Ler todos os flags do módulo de uma mensagem
   */
  static getAll(message) {
    return message.getFlag(MODULE_ID, '') ?? {};
  }

  /**
   * Ler um flag específico
   */
  static get(message, key) {
    return message.getFlag(MODULE_ID, key);
  }

  /**
   * Salvar um flag. Isso dispara um update no banco do Foundry
   * e propaga via WebSocket para todos os clientes.
   * renderChatMessage será chamado novamente em todos.
   */
  static async set(message, key, value) {
    return message.setFlag(MODULE_ID, key, value);
  }

  /**
   * Remover um flag
   */
  static async unset(message, key) {
    return message.unsetFlag(MODULE_ID, key);
  }

  /**
   * Resetar todos os flags do módulo nesta mensagem
   */
  static async reset(message) {
    const allKeys = Object.keys(FlagStore.getAll(message));
    for (const key of allKeys) {
      await FlagStore.unset(message, key);
    }
  }
}`,
  },
  {
    id: 'css',
    name: 'styles/dh-roll-enhancer.css',
    lang: 'css',
    description: 'Estilos integrados ao tema Daggerheart',
    code: `/**
 * DH Roll Enhancer — Estilos
 * Usa variáveis CSS do sistema Daggerheart para integração visual perfeita.
 * Todos os seletores são prefixados com .dh-re- para evitar conflitos.
 */

/* ─── Wrapper dos controles extras ─────────────────── */
.dh-re-enhancer-panel {
  margin-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 8px;
}

/* ─── Seção de alvos extras ─────────────────────────── */
.dh-re-extra-targets {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dh-re-extra-target-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(99, 63, 191, 0.12);
  border: 1px solid rgba(99, 63, 191, 0.25);
  font-size: 12px;
}

.dh-re-extra-target-row .dh-re-hit-badge {
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  padding: 2px 8px;
  border-radius: 9999px;
  transition: all 0.15s ease;
}

.dh-re-extra-target-row .dh-re-hit-badge.is-hit {
  color: var(--dh-color-success, #4ade80);
  border: 1px solid rgba(74, 222, 128, 0.3);
}

.dh-re-extra-target-row .dh-re-hit-badge.is-miss {
  color: var(--dh-color-danger, #f87171);
  border: 1px solid rgba(248, 113, 113, 0.3);
}

/* ─── Botão adicionar alvo ──────────────────────────── */
.dh-re-add-target-btn {
  width: 100%;
  padding: 4px;
  margin-top: 4px;
  border: 1px dashed rgba(99, 63, 191, 0.4);
  border-radius: 6px;
  background: transparent;
  color: rgba(167, 139, 250, 0.7);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.dh-re-add-target-btn:hover {
  background: rgba(99, 63, 191, 0.15);
  color: rgb(167, 139, 250);
  border-color: rgba(99, 63, 191, 0.6);
}

/* ─── Editor de dano ────────────────────────────────── */
.dh-re-damage-editor {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.dh-re-damage-modifier-btn {
  width: 22px;
  height: 22px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-light-primary, #e5e7eb);
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  line-height: 1;
}

.dh-re-damage-modifier-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.dh-re-damage-modifier {
  font-size: 12px;
  font-weight: 600;
  color: var(--dh-color-hope, #fbbf24);
  min-width: 24px;
  text-align: center;
}

/* ─── Dado rerrolado ────────────────────────────────── */
.dice.dh-re-rerolled {
  opacity: 0.5;
  position: relative;
}

.dice.dh-re-rerolled::after {
  content: '↺';
  position: absolute;
  top: -6px;
  right: -4px;
  font-size: 10px;
  color: var(--dh-color-hope, #fbbf24);
}

/* ─── Badge "DH RE ativo" ───────────────────────────── */
.dh-re-active-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 6px;
  font-size: 9px;
  color: rgba(139, 92, 246, 0.4);
  letter-spacing: 0.05em;
}

.dh-re-active-badge::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(139, 92, 246, 0.5);
}`,
  },
  {
    id: 'target-hbs',
    name: 'templates/target-editor.hbs',
    lang: 'handlebars',
    description: 'Template de alvos extras',
    code: `{{!-- target-editor.hbs --}}
{{!-- Injetado APÓS a seção de alvos original do Daggerheart --}}

{{#if (or hasExtras canEdit)}}
<div class="dh-re-enhancer-panel dh-re-target-panel">

  {{!-- Alvos extras (adicionados via módulo) --}}
  {{#if hasExtras}}
  <div class="roll-part-header" style="font-size:11px; opacity:0.7; margin-bottom:4px;">
    <span>{{localize "DHRE.TargetManager.extraTargets"}}</span>
  </div>
  <div class="dh-re-extra-targets">
    {{#each extraTargets as |target|}}
    <div class="dh-re-extra-target-row" data-target-id="{{target.id}}">
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="font-size:12px; color: var(--color-text-light-primary)">
          {{target.name}}
        </span>
        {{#if target.addedVia}}
        <span style="font-size:9px; opacity:0.5; font-style:italic">
          via {{target.addedVia}}
        </span>
        {{/if}}
      </div>
      <div style="display:flex; align-items:center; gap:6px;">
        {{#if ../canEdit}}
        <button
          class="dh-re-hit-badge dh-re-target-hit-toggle {{ifThen target.hit 'is-hit' 'is-miss'}}"
          title="{{localize 'DHRE.TargetManager.toggleHit'}}"
        >
          {{#if target.hit}}
            {{localize "DAGGERHEART.GENERAL.hit.single"}}
          {{else}}
            {{localize "DAGGERHEART.GENERAL.miss.single"}}
          {{/if}}
        </button>
        <button class="dh-re-target-remove" title="{{localize 'DHRE.TargetManager.remove'}}" style="background:none; border:none; color: rgba(255,255,255,0.3); cursor:pointer; font-size:12px; padding:2px 4px;">
          ✕
        </button>
        {{else}}
        <span class="dh-re-hit-badge {{ifThen target.hit 'is-hit' 'is-miss'}}">
          {{#if target.hit}}{{localize "DAGGERHEART.GENERAL.hit.single"}}{{else}}{{localize "DAGGERHEART.GENERAL.miss.single"}}{{/if}}
        </span>
        {{/if}}
      </div>
    </div>
    {{/each}}
  </div>
  {{/if}}

  {{!-- Botão de adicionar (apenas GM e autores com permissão) --}}
  {{#if canEdit}}
  <button class="dh-re-add-target-btn" data-message-id="{{messageId}}">
    <i class="fa-solid fa-crosshairs"></i>
    {{localize "DHRE.TargetManager.addFromCanvas"}}
  </button>
  {{/if}}

  <div class="dh-re-active-badge">DH Roll Enhancer</div>
</div>
{{/if}}`,
  },
]

function highlight(code: string, lang: string): string {
  // Simple syntax highlighting — color coding via span replacement
  if (lang === 'json') {
    return code
      .replace(/("[\w-]+")\s*:/g, '<span style="color:#7dd3fc">$1</span>:')
      .replace(/:\s*(".*?")/g, ': <span style="color:#86efac">$1</span>')
      .replace(/:\s*(true|false|null)/g, ': <span style="color:#c084fc">$1</span>')
      .replace(/:\s*(\d+)/g, ': <span style="color:#fbbf24">$1</span>')
  }
  if (lang === 'css') {
    return code
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color:#6b7280">$1</span>')
      .replace(/([\w-.]+)\s*\{/g, '<span style="color:#93c5fd">$1</span> {')
      .replace(/([\w-]+)\s*:/g, '<span style="color:#86efac">$1</span>:')
  }
  if (lang === 'javascript') {
    return code
      .replace(/(\/\*[\s\S]*?\*\/|\/\/.*$)/gm, '<span style="color:#6b7280">$1</span>')
      .replace(/\b(import|export|class|const|let|var|async|await|return|if|else|for|of|new|static|this)\b/g, '<span style="color:#c084fc">$1</span>')
      .replace(/\b(true|false|null|undefined)\b/g, '<span style="color:#f97316">$1</span>')
      .replace(/('[^']*'|`[^`]*`)/g, '<span style="color:#86efac">$1</span>')
  }
  if (lang === 'handlebars') {
    return code
      .replace(/({{!--[\s\S]*?--}})/g, '<span style="color:#6b7280">$1</span>')
      .replace(/({{[^}]*}})/g, '<span style="color:#fbbf24">$1</span>')
      .replace(/(<[^>]+>)/g, '<span style="color:#93c5fd">$1</span>')
  }
  return code
}

export default function CodeViewer() {
  const [activeFile, setActiveFile] = useState(codeFiles[0].id)
  const file = codeFiles.find(f => f.id === activeFile)!

  const langIcon: Record<string, string> = {
    json: '🔧',
    javascript: '📄',
    css: '🎨',
    handlebars: '📝',
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-yellow-900/50 border border-yellow-700/50 flex items-center justify-center">
            💻
          </div>
          <div>
            <p className="text-xs text-yellow-400 font-semibold uppercase tracking-widest mb-0.5">Código-fonte</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Implementação completa do módulo
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* File list sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#0a0a0f] border border-white/10 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                <p className="text-xs text-gray-500 font-semibold">ARQUIVOS</p>
              </div>
              <div className="p-2 space-y-0.5">
                {codeFiles.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFile(f.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all text-xs ${
                      activeFile === f.id
                        ? 'bg-violet-700/30 text-violet-200 border border-violet-600/40'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{langIcon[f.lang] ?? '📄'}</span>
                      <span className="font-mono truncate">{f.name.split('/').pop()}</span>
                    </div>
                    <p className="text-[10px] text-gray-600 mt-0.5 truncate">{f.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Code pane */}
          <div className="lg:col-span-3">
            <div className="bg-[#0a0a0f] border border-white/10 rounded-xl overflow-hidden h-full flex flex-col">
              {/* File header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02] flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <span className="text-xs text-gray-400 font-mono ml-2">{file.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-500 font-mono">
                    {file.lang}
                  </span>
                </div>
              </div>

              {/* Code */}
              <div className="flex-1 overflow-auto p-0">
                <div className="flex text-xs font-mono leading-relaxed">
                  {/* Line numbers */}
                  <div className="select-none py-5 pl-4 pr-3 text-right text-gray-700 bg-white/[0.01] border-r border-white/5 flex-shrink-0">
                    {file.code.split('\n').map((_, i) => (
                      <div key={i} className="leading-[1.6rem]">{i + 1}</div>
                    ))}
                  </div>
                  {/* Code content */}
                  <pre className="py-5 px-4 text-gray-300 overflow-x-auto flex-1 leading-[1.6rem]">
                    <code
                      dangerouslySetInnerHTML={{
                        __html: highlight(file.code, file.lang)
                      }}
                    />
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="mt-6 bg-blue-950/30 border border-blue-800/40 rounded-xl p-4 text-sm text-gray-400">
          <strong className="text-blue-300">📌 Nota:</strong> Este código representa a arquitetura completa do módulo.
          Os arquivos <code className="bg-blue-900/40 px-1.5 py-0.5 rounded text-blue-300 text-xs">DamageEditor.js</code>,{' '}
          <code className="bg-blue-900/40 px-1.5 py-0.5 rounded text-blue-300 text-xs">RerollManager.js</code>,{' '}
          <code className="bg-blue-900/40 px-1.5 py-0.5 rounded text-blue-300 text-xs">NoteEditor.js</code> e{' '}
          <code className="bg-blue-900/40 px-1.5 py-0.5 rounded text-blue-300 text-xs">PermissionHelper.js</code>{' '}
          seguem o mesmo padrão demonstrado em <code className="bg-blue-900/40 px-1.5 py-0.5 rounded text-blue-300 text-xs">TargetManager.js</code>.
        </div>
      </div>
    </div>
  )
}
