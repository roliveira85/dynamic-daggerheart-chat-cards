export class FlagStore {
  static MODULE_ID = "dynamic-daggerheart-chat-cards";

  static get(message, key) {
      return message.getFlag(this.MODULE_ID, key);
  }

  static async set(message, key, value) {
      return await message.setFlag(this.MODULE_ID, key, value);
  }
}