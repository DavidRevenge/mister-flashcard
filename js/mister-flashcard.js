const SERVER_IP = 'http://127.0.0.1:8765';
const DOWNLOAD_FOLDER = 'img/download/';

var defaultDeck = (!!localStorage.getItem('defaultDeck')) ? localStorage.getItem('defaultDeck') : false;

/**
 * @version 1.3.3
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
    static addCard(card, filename, sound, minimalPairs = false) {
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
        card.refreshDeskName();
        var note = (minimalPairs === true) ? new BasicModel(card, sound, document.getElementById('word').value) : new PictureWordsModel(card, filename, sound);
        MisterFlashcard.invoke('addNote', 6, {
            note: note
        }).then(result => {
            Util.hideLoader();
            alert('Card successfully added!');
        });
    }
    static sendToAnki(card) {
        MisterFlashcard.addCard(card, card.filename, new SoundModel(card.ipa.text, card.filename + '.mp3', card.ipa.soundUrl));
    }
    static addSound(soundIPAHref, soundTitle = false) {
        var player = document.getElementById("audio-container-player");
        player = $('#audio-container-player').clone().css('display', 'inline');
        $(player).children('source').attr('src', soundIPAHref);
        $('#audio-container').append(player).append('<input type="radio" name="ipaSoundRB" value="' + soundIPAHref + '" > <br />');
        if (soundTitle !== false) $(player).before('<h5>' + soundTitle + '</h5>');
        /* Spunto il primo audio della lista */
        var firstAudio = $('#audio-container').children('input[type=radio]');
        $(firstAudio[0]).attr('checked', 'checked');
    }
}

class Preview {
    static setIpa(text) {
        $('#preview .ipaBox span').text(text);
    }
    static setName(text) {
        $('#preview .nameBox span').text(text);
    }
    static initCrop(card) {
        $('#openCropSampleImg').unbind('click');
        $('#openCropSampleImg').click(function () {
            Preview.enableCropSend();
            $('#sendToAnkiOnCrop').unbind('click');
            $('#closeCropSampleImg').unbind('click');
            var el = document.getElementById('sampleImg');
            var resize = new Croppie(el, {
                viewport: { width: 100, height: 100 },
                boundary: { width: 300, height: 300 },
                showZoomer: true,
                enableResize: true,
                enableOrientation: true,
                mouseWheelZoom: 'ctrl'
            });
            $('#sendToAnkiOnCrop').click(function () {
                resize.result('base64').then(function (base64) {
                    card.setBase64(Util.cleanBase64(base64));
                    MisterFlashcard.sendToAnki(card);
                    $('#closeCropSampleImg').click();
                });
            });
            $('#closeCropSampleImg').click(function () {
                resize.destroy();
                $(this).addClass('d-none');
                $('#openCropSampleImg').removeClass('d-none');
                Preview.disableCropSend();
            });
            $(this).addClass('d-none');
            $('#closeCropSampleImg').removeClass('d-none');
        });
    }
    static enableCropSend() {
        $('#sendToAnki').addClass('d-none');
        $('#sendToAnkiOnCrop').removeClass('d-none');
    }
    static disableCropSend() {
        $('#sendToAnkiOnCrop').addClass('d-none');
        $('#sendToAnki').removeClass('d-none');
    }
}
// class Card {
//     static setName(name) {
//         $('#name').val(name);
//         $('.nameBox span').text(name);
//     }
// }
class Ipa {
    static append(text, title) {
        $('#ipa-container').append('<h5>' + title + '</h5><a href="#" class="searchedIPA" style="font-size: 1.5rem;">' + text + '</a><br />');
    }
    static prepend(text, title) {
        $('#ipa-container').prepend('<h5>' + title + '</h5><a href="#" class="searchedIPA" style="font-size: 1.5rem;">' + text + '</a><br />');
    }
    static printList(result) {
        result.each(function (index) {
            if (index >= 2) return false;
            var ipaTitle = $(this).closest('li').find('.qualifier-content a').html();
            Ipa.append($(this).text(), ipaTitle);
        });
    }
}
class Input {
    static setIpa(text) {
        $('input#ipa').val(text);
        Preview.setIpa(text);
    }
    static setName(name) {
        $('#name').val(name);
        Preview.setName(name);
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
    base64 = false;
    constructor(name, connection, src, ipaSound) {
        this.name = name;
        this.connection = connection;
        this.src = src;
        this.deckName = $('#deckName').children('option:selected').val();
        this.filename = Util.getFileName(name);
        this.ipa.text = $('input#ipa').val();
        this.ipa.soundUrl = ipaSound;
    }
    refreshDeskName() {
        this.deckName = $('#deckName').children('option:selected').val();
    }
    setBase64(base64) {
        this.base64 = base64;
    }

}
class Util {
    static cleanBase64(base64) {
        var base64 = base64.replace("data:image/png;base64,", "");
        return base64 = base64.replace("data:image/jpeg;base64,", "");
    }
    static getFileName(name) {
        var date = new Date();
        var timestamp = date.getTime();
        var filename = '_' + name + '_' + timestamp;
        return filename.split(' ').join('_');
    }
    static capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    static showLoader() {
        $('.loader').addClass('on');
    }
    static hideLoader() {
        $('.loader').removeClass('on');
    }
}
class PhpCall {
    static searchIPA(word) {
        word = word.trim();
        var result;
        var lang = $('#languages').children('option:selected').val();
        jQuery.get('get_ipa.php', { word: word, lang: lang }, function (data) {

            var html = $.parseHTML(data);
            result = $('.IPA, .ipa', html);
            $('#ipa-container').empty();

            //auto set first ipa
            if ( !! result[0]) Input.setIpa(result[0].innerText);

            Ipa.printList(result);

            $('.searchedIPA').click(function () {
                Input.setIpa($(this).text());
            })
            if (lang === 'en') {
                var soundIPAUrls = $('.audiometa a', html);
            } else if (lang === 'de') {
                var soundIPAUrls = $('.internal', html);
            }
            $('#audio-container').empty();
            var foundIt = false;
            $(soundIPAUrls).each(function () {
                if (lang === 'de' && $(this).attr('href').indexOf('upload') >= 1) {
                    var soundIPAHref = 'https:' + $(this).attr('href');
                    MisterFlashcard.addSound(soundIPAHref);
                } else if (lang === 'en') {
                    var soundTitle = $(this).parent().parent().find('.audiolink').text();
                    var condition = soundTitle.toLowerCase().indexOf('uk') < 0; // && soundTitle.toLowerCase().indexOf('us') < 0;
                    if (condition) return true;
                    foundIt = true;
                    PhpCall.getIpaSound(decodeURIComponent($(this).attr('href')), soundTitle);
                }
            });
            if (!foundIt) {
                PhpCall.getIpaSound(word, 'Oxford Sound', true);
            }
        });
    }
    static searchWord(word) {
        Util.showLoader();
        var word = ($('#languages').children('option:selected').val() !== 'de') ? $('#word').val().toLowerCase() : $('#word').val();
        PhpCall.searchIPA(word);
        $.ajax('get_images.php', {
            type: 'GET',
            timeout: 5000,
            data: { word: word },
            success: function (data, status, xhr) {
                Util.hideLoader();
                data = data.split("\\/").join('/');
                data = JSON.parse(data).data;

                $('#search-container').empty();
                data.result.items.forEach(element => {
                    let src = element.media;
                    let img = $('<img class="cardImage" style="width: 300px; cursor: pointer;" src="' + src + '" />');
                    $('#search-container').append(img);
                });


                $('.cardImage').click(function () {
                    Util.showLoader();
                    var name = $('#name').val() ? $('#name').val() : '';
                    var connection = $('#connection').val();
                    var src = $(this).attr('src');
                    var ipaSound = $('input[name="ipaSoundRB"]:checked').val();
                    //var deckName = $('#deckName').children('option:selected').val();
                    //var card = new CardModel(name, connection, src, deckName, $('input#ipa').val(), ipaSound);
                    var card = new CardModel(name, connection, src, ipaSound);

                    $.ajax('download_image.php', {
                        type: 'GET',
                        timeout: 5000,
                        data: { url: src, imgName: name },
                        success: function (data, status, xhr) {
                            $("#sampleImg").attr('src', DOWNLOAD_FOLDER + name + '.jpg');
                            Util.hideLoader();
                        },
                        fail: function (xhr, textStatus, errorThrown) {
                            console.log('request base64 failed');
                        }
                    });

                    Preview.initCrop(card);

                    $('#sendToAnki').unbind('click');
                    $('#sendToAnki').click(function () {
                        card.setBase64(false);
                        MisterFlashcard.sendToAnki(card);
                    });

                });
            },
            fail: function (xhr, textStatus, errorThrown) {
                console.log('request failed');
            }
        });

    }
    static getIpaSound(url = false, soundTitle = false, otherWebsite = false) {
        if (otherWebsite === true) {
            jQuery.get('get_ipa_sound.php', { url: url, otherWebsite: true }, function (data) {
                var soundHtml = $.parseHTML(data);
                var soundIPAHref = $('.phons_br', soundHtml).find('.pron-uk').attr('data-src-ogg');

                var ipa = $('.phons_br', soundHtml).find('.phon').text();
                Ipa.prepend(ipa);
                Input.setIpa(ipa);

                MisterFlashcard.addSound(soundIPAHref, soundTitle);
            });
        } else {
            jQuery.get('get_ipa_sound.php', { url: url }, function (data) {
                var soundHtml = $.parseHTML(data);
                var soundIPAHref = 'https:' + $('.internal', soundHtml).attr('href');
                MisterFlashcard.addSound(soundIPAHref, soundTitle);
            });
        }
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
        var name = Util.capitalizeFirstLetter($(this).val());
        Input.setName(name);
    });
    MisterFlashcard.setDecks();
    document.getElementById('deckName').addEventListener('change', function () {
        localStorage.setItem('defaultDeck', this.value);
    });
    document.getElementById('ipa').addEventListener('keyup', function () {
        Preview.setIpa(this.value);
    });
    document.getElementById('addMinimalPairs').addEventListener('click', function () {
        if (confirm('Inviare su Anki?')) {
            var name = $('#name').val() ? $('#name').val() : '';
            var ipaSound = $('input[name="ipaSoundRB"]:checked').val();
            var card = new CardModel(name, "", "", ipaSound);
            MisterFlashcard.addCard(card, card.filename, new SoundModel(card.ipa.text, card.filename + '.mp3', card.ipa.soundUrl), true);
        }
    })
});