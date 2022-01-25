const SERVER_IP = 'http://127.0.0.1:8765';

var defaultDeck = (!!localStorage.getItem('defaultDeck')) ? localStorage.getItem('defaultDeck') : false;

/**
 * @version 1.2.0
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
            xhr.addEventListener('error', () => reject('failed to issue request'));
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
    static addCard(card, filename, sound, minimalPairs = false) {
        if (minimalPairs === true) {
            MisterFlashcard.invokeAddNote(card, filename, sound, minimalPairs);
        } else {
            filename = filename + ".jpg";
            MisterFlashcard.invoke('storeMediaFile', 6, {
                "filename": filename,
                "url": card.src
            }).then(result => {
                MisterFlashcard.invokeAddNote(card, filename, sound, minimalPairs);
            });
        }
    }
    static invokeAddNote(card, filename, sound, minimalPairs = false) {
        var note = (minimalPairs === true) ? new BasicModel(card, sound, document.getElementById('word').value) : new PictureWordsModel(card, filename, sound);
        MisterFlashcard.invoke('addNote', 6, {
            note: note
        }).then(result => {
            alert('Card successfully added!');
        });
    }
    static sendOnAnki(card) {
        MisterFlashcard.addCard(card, card.filename, new SoundModel(card.ipa.text, card.filename + '.mp3', card.ipa.soundUrl));
    }
    static addSound(soundIPAHref, soundTitle = false) {
        var player = document.getElementById("audio-container-player");
        player = $('#audio-container-player').clone().css('display', 'inline');
        $(player).children('source').attr('src', soundIPAHref);
        $('#audio-container').append(player).append('<input type="radio" name="ipaSoundRB" value="' + soundIPAHref + '" > <br />');
        if (soundTitle !== false) $('#audio-container').append('<h5>'+soundTitle+'</h5>');
        /* Spunto il primo audio della lista */
        var firstAudio = $('#audio-container').children('input[type=radio]');
        $(firstAudio[0]).attr('checked', 'checked');
    }
}
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
class BasicFieldsModel {
    "Fronte" = '';
    "Retro" = '';
    constructor(card, sound, rightWord) {
        this["Fronte"] = card.name + "[sound:" + sound.filename + "]";
        this["Retro"] = Util.capitalizeFirstLetter(rightWord) + " " + "[sound:" + sound.filename + "]";
    }
}
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
class AudioModel {
    "url" = "";
    "filename" = "";
    "skipHash" = "7e2c2f954ef6051373ba916f000168dc";
    "fields" = ["Front"];
    constructor(sound) {
        this.url = sound.fileUrl;
        this.filename = sound.filename;
    }
}
class SoundModel {
    ipa = "";
    filename = "";
    fileUrl = "";    
    constructor(ipa, filename, fileUrl) {
        this.ipa = ipa;
        this.filename = filename;
        this.fileUrl = fileUrl;
    }
}
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
    constructor(name, connection, src, deckName, ipaText, ipaSound) {
        this.name = name;
        this.connection = connection;
        this.src = src;
        this.deckName = deckName;
        this.filename = Util.getFileName(name);
        this.ipa.text = ipaText;
        this.ipa.soundUrl = ipaSound;
    }
}
class Util {
    static getFileName(name) {
        var date = new Date();
        var timestamp = date.getTime();
        var filename = '_' + name + '_' + timestamp;
        return filename.split(' ').join('_');
    }
    static capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}
class PhpCall {
    static searchIPA(word) {
        var result;
        var lang = $('#languages').children('option:selected').val();
        jQuery.get('get_ipa.php', { word: word, lang: lang }, function (data) {

            var html = $.parseHTML(data);
            result = $('.IPA, .ipa', html);
            $('#ipa-container').empty();
            result.each(function () {
                $('#ipa-container').append('<a href="#" class="searchedIPA" style="font-size: 1.5rem;">' + $(this).text() + '</a><br />');
            });
            $('.searchedIPA').click(function () {
                $('input#ipa').val($(this).text())
            })
            if (lang === 'en') {
                var soundIPAUrls = $('.audiometa a', html);
            } else if (lang === 'de') {
                var soundIPAUrls = $('.internal', html);
            }
            $('#audio-container').empty();
            $(soundIPAUrls).each(function () {
                if (lang === 'de' && $(this).attr('href').indexOf('upload') >= 1) {
                    var soundIPAHref = 'https:' + $(this).attr('href');
                    MisterFlashcard.addSound(soundIPAHref);
                } else if (lang === 'en') {
                    var soundTitle = $(this).parent().parent().find('.audiolink').text();
                    var condition = soundTitle.toLowerCase().indexOf('uk') < 0; // && soundTitle.toLowerCase().indexOf('us') < 0;
                    if (condition) return true;
                    PhpCall.getIpaSound(decodeURIComponent($(this).attr('href')), soundTitle);
                }
            });
        });
    }
    static searchWord(word) {
        var word = ($('#languages').children('option:selected').val() !== 'de') ? $('#word').val().toLowerCase() : $('#word').val();
        PhpCall.searchIPA(word);
        $.ajax('get_images.php', {
            type: 'GET',
            timeout: 5000,
            data: { word: word },
            success: function (data, status, xhr) {
                data = data.split("\\/").join('/');
                data = JSON.parse(data).data;

                $('#search-container').empty();
                data.result.items.forEach(element => {
                    let src = element.media;
                    let img = $('<img class="cardImage" style="width: 300px; cursor: pointer;" src="' + src + '" />');
                    $('#search-container').append(img);
                });
                $('.cardImage').click(function () {

                    var name = $('#name').val() ? $('#name').val() : '';
                    var connection = $('#connection').val();
                    var src = $(this).attr('src');
                    var ipaSound = $('input[name="ipaSoundRB"]:checked').val();
                    var deckName = $('#deckName').children('option:selected').val();
                    var card = new CardModel(name, connection, src, deckName, $('input#ipa').val(), ipaSound);
                    if (confirm('Inviare su Anki?')) MisterFlashcard.sendOnAnki(card);
                });
            },
            fail: function (xhr, textStatus, errorThrown) {
                console.log('request failed');
            }
        });

    }
    static getIpaSound(url, soundTitle = false) {
        jQuery.get('get_ipa_sound.php', { url: url }, function (data) {
            var soundHtml = $.parseHTML(data);
            var soundIPAHref = 'https:' + $('.internal', soundHtml).attr('href');
            MisterFlashcard.addSound(soundIPAHref, soundTitle);
        });
    }
}
/* ON READY! */
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
        $('#name').val(Util.capitalizeFirstLetter($(this).val()));
    });
    MisterFlashcard.setDecks();
    document.getElementById('deckName').addEventListener('change', function () {
        localStorage.setItem('defaultDeck', this.value);
    });
    document.getElementById('addMinimalPairs').addEventListener('click', function () {
        if (confirm('Inviare su Anki?')) {
            var name = $('#name').val() ? $('#name').val() : '';
            var ipaSound = $('input[name="ipaSoundRB"]:checked').val();
            var deckName = $('#deckName').children('option:selected').val();
            var card = new CardModel(name, "", "", deckName, $('input#ipa').val(), ipaSound);
            MisterFlashcard.addCard(card, card.filename, new SoundModel(card.ipa.text, card.filename + '.mp3', card.ipa.soundUrl), true);
        }
    })
});