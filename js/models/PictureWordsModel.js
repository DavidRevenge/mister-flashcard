class PictureWordsModel {
    "deckName" = "";
    "modelName" = "2. Picture Words";
    "fields" = {};
    "options" = { "allowDuplicate": true };
    "tags" = ["Anki Daddo"];
    "audio" = {}
    constructor(card, filename, sound) {
        this.deckName = card.deckName;
        this.fields = new PWFieldsModel(card, filename, sound);
        this.audio = new AudioModel(sound);
    }
}