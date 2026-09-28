import { FlagStore } from "./FlagStore.js";
import { TargetManager } from "./TargetManager.js";
import { PermissionHelper } from "./PermissionHelper.js";

export class RollEnhancer {
    constructor(message, html, data) {
        this.message = message;
        this.html = html;
        this.data = data;
    }

    async injectDynamicUI() {
        // Validação de segurança usando nossa nova classe de permissões
        if (!PermissionHelper.canEdit(this.message)) return;

        const targets = FlagStore.get(this.message, "targets") || [];
        const customDamage = FlagStore.get(this.message, "customDamage") || null;

        const templateData = { targets, customDamage };
        const injectedHtml = await renderTemplate("modules/dynamic-daggerheart-chat-cards/templates/target-editor.hbs", templateData);

        const messageContent = this.html.find('.message-content');
        messageContent.append(injectedHtml);

        this.activateListeners(this.html);
    }

    activateListeners(html) {
        const targetManager = new TargetManager(this.message);
        
        html.find('.dh-add-target').click(ev => targetManager.onAddTarget(ev));
        html.find('.dh-remove-target').click(ev => targetManager.onRemoveTarget(ev));
    }
}