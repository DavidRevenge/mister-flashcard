
class CardModel {
    name = "";
    connection = "";
    src = "";
    deckName = "";
    filename = ""
    ipa = {
        text: "",
        soundUrl: ""
    }
    base64 = false;
    constructor() {
        this.name = $('input#name').val();
        this.connection = $('input#connection').val();

        this.src = window.location.href + $('#sampleImg').attr('src');

        this.deckName = $('#deckName').children('option:selected').val();
        this.filename = Util.getFileName(this.name);
        this.ipa.text = $('input#ipa').val();
        this.ipa.soundUrl = $('input[name="ipaSoundRB"]:checked').val();
    }
    refreshDeskName() {
        this.deckName = $('#deckName').children('option:selected').val();
    }
    refreshName() {
        this.name = $('input#name').val();
    }
    refreshConnection() {
        this.connection = $('input#connection').val();
    }
    refreshIpa() {
        this.ipa.soundUrl = $('input[name="ipaSoundRB"]:checked').val();
        this.ipa.text = $('input#ipa').val();
    }
    refreshSrc() {
        var location = window.location.href.replace('#', '');
        this.src = location + $('#sampleImg').attr('src');
    }
    refresh() {
        this.refreshDeskName();
        this.refreshConnection();
        this.refreshName();
        this.refreshIpa();
        this.refreshSrc();
    }
    setBase64(base64) {
        this.base64 = base64;
    }

}