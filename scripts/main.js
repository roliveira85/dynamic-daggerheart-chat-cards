import { RollEnhancer } from "./RollEnhancer.js";

Hooks.once("init", () => {
    console.log("DH Roll Enhancer | Inicializando módulo dinâmico...");

    // Registra a configuração no menu do Foundry
    game.settings.register("dynamic-daggerheart-chat-cards", "allowPlayerEdit", {
        name: "Permitir Edição por Jogadores",
        hint: "Se ativo, os jogadores poderão editar os próprios cards (adicionar alvos, etc). Caso contrário, apenas o GM terá esse poder.",
        scope: "world",     // Configuração global para o mundo
        config: true,       // Aparece no menu de configurações
        type: Boolean,
        default: false      // Desativado por padrão
    });
});

Hooks.on("renderChatMessage", async (message, html, data) => {
    const isDaggerheartRoll = message.flags.daggerheart || html.find('.daggerheart-roll').length > 0;
    
    if (isDaggerheartRoll) {
        const enhancer = new RollEnhancer(message, html, data);
        await enhancer.injectDynamicUI();
    }
});