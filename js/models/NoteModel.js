class NoteModel {
    id = '';
    text = '';
    strike = false;
    constructor(id, text) {
        this.id = id;
        this.text = text;
    }
    setStrike(strike) {
        this.strike = strike;
    }
}