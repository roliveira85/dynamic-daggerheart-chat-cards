import { FlagStore } from "./FlagStore.js";

export class TargetManager {
    constructor(message) {
        this.message = message;
    }

    async onAddTarget(event) {
        event.preventDefault();
        
        const currentTargets = Array.from(game.user.targets);
        if (currentTargets.length === 0) {
            return ui.notifications.warn("Você precisa focar (target) um token no mapa primeiro!");
        }

        let savedTargets = FlagStore.get(this.message, "targets") || [];

        currentTargets.forEach(t => {
            if (!savedTargets.find(st => st.id === t.id)) {
                savedTargets.push({ id: t.id, name: t.name, img: t.document.texture.src });
            }
        });

        await FlagStore.set(this.message, "targets", savedTargets);
    }

    async onRemoveTarget(event) {
        event.preventDefault();
        const targetId = event.currentTarget.dataset.targetId;
        
        let savedTargets = FlagStore.get(this.message, "targets") || [];
        savedTargets = savedTargets.filter(t => t.id !== targetId);

        await FlagStore.set(this.message, "targets", savedTargets);
    }
}