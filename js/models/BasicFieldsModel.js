class BasicFieldsModel {
    "Fronte" = '';
    "Retro" = '';
    constructor(card, sound, rightWord) {
        this["Fronte"] = card.name + "[sound:" + sound.filename + "]";
        this["Retro"] = Util.capitalizeFirstLetter(rightWord) + " " + "[sound:" + sound.filename + "]";
    }
}