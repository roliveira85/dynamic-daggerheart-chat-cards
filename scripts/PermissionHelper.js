export class PermissionHelper {
    static canEdit(message) {
        // O GM sempre tem permissão
        if (game.user.isGM) return true;
        
        // Verifica a configuração do módulo
        const allowPlayerEdit = game.settings.get("dynamic-daggerheart-chat-cards", "allowPlayerEdit");
        
        // Se a opção estiver ativa e o jogador for o dono da mensagem
        return allowPlayerEdit && message.isAuthor;
    }
}