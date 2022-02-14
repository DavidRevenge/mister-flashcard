class PWFieldsModel {
    "Word" = '';
    "Picture" = '';
    "Gender, Personal Connection, Extra Info (Back side)" = '';
    "Pronunciation (Recording and/or IPA)" = '';
    constructor(card, filename, sound) {
        this.Word = card.name;
        this.Picture = '<img src="' + filename + '">';
        this["Gender, Personal Connection, Extra Info (Back side)"] = card.connection;
        this["Pronunciation (Recording and/or IPA)"] = sound.ipa + "[sound:" + sound.filename + "]";
    }
}