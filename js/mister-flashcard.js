const SERVER_IP = 'http://127.0.0.1:8765';
const DOWNLOAD_FOLDER = 'img/download/';

var defaultDeck = (!!localStorage.getItem('defaultDeck')) ? localStorage.getItem('defaultDeck') : false;

var createStickers = false;

/**
 * @version 1.5.1
 */
class MisterFlashcard {
    static setDecks() {
        MisterFlashcard.retrieveDeckNames().then(decks => {
            decks = decks.filter(d => d.toLowerCase() !== 'predefinito');
            $.each(decks, function () {
                var option = $("<option />");
                if (this.toString() === defaultDeck) {
                    option.attr('selected', 'selected');
                }
                $('#deckName').append(option.val(this).text(this));
            });
        });
    }
    static invoke(action, version, params = {}) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.addEventListener(
                'error', () => {
                    reject('Aprire Anki!');
                    alert('Aprire Anki!');
                }
            );
            xhr.addEventListener('load', () => {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (Object.getOwnPropertyNames(response).length != 2) {
                        throw 'response has an unexpected number of fields';
                    }
                    if (!response.hasOwnProperty('error')) {
                        throw 'response is missing required error field';
                    }
                    if (!response.hasOwnProperty('result')) {
                        throw 'response is missing required result field';
                    }
                    if (response.error) {
                        throw response.error;
                    }
                    resolve(response.result);
                } catch (e) {
                    reject(e);
                }
            });

            xhr.open('POST', SERVER_IP);
            xhr.send(JSON.stringify({ action, version, params }));
        });
    }
    /**
     * @param text filename Example: "_dog_1582907679938.jpg"
     * @returns result
     */
    static retrieveMediaFile(filename) {

        result = MisterFlashcard.invoke('retrieveMediaFile', 6, {
            "filename": filename
        });
        return result;
    }
    static retrieveDeckNames() {
        return MisterFlashcard.invoke('deckNames', 6);
    }
    static addCard(card, filename, minimalPairs = false) {
        card.refresh();
        var sound = new SoundModel(card.ipa.text, card.filename + '.mp3', card.ipa.soundUrl);
        Util.showLoader();
        if (minimalPairs === true) {
            MisterFlashcard.invokeAddNote(card, filename, sound, minimalPairs);
        } else {
            filename = filename + Date.now() + ".jpg";
            var data = {
                "filename": filename
            }
            if (card.base64 === false) data['url'] = card.src;
            else data['data'] = card.base64;
            MisterFlashcard.invoke('storeMediaFile', 6, data).then(result => {
                MisterFlashcard.invokeAddNote(card, filename, sound, minimalPairs);
            });
        }
    }
    static invokeAddNote(card, filename, sound, minimalPairs = false) {
        card.refresh();
        var note = (minimalPairs === true) ? new BasicModel(card, sound, document.getElementById('word').value) : new PictureWordsModel(card, filename, sound);
        MisterFlashcard.invoke('addNote', 6, {
            note: note
        }).then(result => {
            Util.hideLoader();
            // alert('Card successfully added!');
            Util.showToast('Card successfully added!');
        });
    }
    static sendToAnki(card) {
        MisterFlashcard.addCard(card, card.filename) //, new SoundModel(card.ipa.text, card.filename + '.mp3', card.ipa.soundUrl));
    }
    static addSound(soundIPAHref, soundTitle = false, radioButtonToCheck = false) {
        var player = document.getElementById("audio-container-player");
        player = $('#audio-container-player').clone().css('display', 'inline');
        $(player).children('source').attr('src', soundIPAHref);
        $('#audio-container').append(player).append('<input type="radio" name="ipaSoundRB" value="' + soundIPAHref + '" > <br />');
        if (soundTitle !== false) $(player).before('<h5>' + soundTitle + '</h5>');
        /* Spunto il primo audio della lista */
        var firstAudio = $('#audio-container').children('input[type=radio]');
        if (radioButtonToCheck === false) $(firstAudio[0]).attr('checked', 'checked');
        else $(firstAudio[radioButtonToCheck]).attr('checked', 'checked');
    }    
    static addScript(src) {
        var s = document.createElement('script');
        s.setAttribute('src', src);
        s.setAttribute('id', src.replace('/', '_').replace('.', '_'));
        document.body.appendChild(s);
    }
}

/* ON READY! */

MisterFlashcard.addScript('js/utils.js');
MisterFlashcard.addScript('js/objects.js');
MisterFlashcard.addScript('js/models.js');
$(function () {
    $('#startSearch').click(function () {
        PhpCall.searchWord($('#word').val());
    });
    $('#word').keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') { $('#startSearch').click(); }
        event.stopPropagation();
    });
    $('#word').keyup(function (event) {
        var name = Util.capitalizeFirstLetter($(this).val());
        Input.setName(name);
    });
    MisterFlashcard.setDecks();
    document.getElementById('deckName').addEventListener('change', function () {
        localStorage.setItem('defaultDeck', this.value);
    });
    document.getElementById('createStickers').addEventListener('change', function () {
        createStickers = this.checked;
        if (this.checked) $('.numberBox, .toolBox').removeClass('d-none');
        else $('.numberBox, .toolBox').addClass('d-none');
        $('#sampleImg').attr('src', 'img/sample.jpg');
    });    
    document.getElementById('ipa').addEventListener('keyup', function () {
        Preview.setIpa(this.value);
    });
    document.getElementById('addMinimalPairs').addEventListener('click', function () {
        if (confirm('Inviare su Anki?')) {
            //  var name = $('#name').val() ? $('#name').val() : '';
            // var ipaSound = $('input[name="ipaSoundRB"]:checked').val();
            var card = new CardModel("");
            MisterFlashcard.addCard(card, card.filename, true);
        }
    });
    document.getElementById('getOxfordSound').addEventListener('click', function () {
        var word = document.getElementById('word').value;
        PhpCall.getIpaSound(word, 'Oxford Sound', true, 1);
    });
});




