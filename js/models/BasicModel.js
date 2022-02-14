class BasicModel {
    "deckName" = "";
    "modelName" = "Basilare";
    "fields" = {};
    "options" = { "allowDuplicate": true };
    "tags" = ["Anki Daddo"];
    "audio" = {}
    constructor(card, sound, rightWord) {
        this.deckName = card.deckName;
        this.fields = new BasicFieldsModel(card, sound, rightWord);
        this.audio = new AudioModel(sound);
    }
}