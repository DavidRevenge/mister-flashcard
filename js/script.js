const SERVER_IP = 'http://127.0.0.1:8765';

var defaultDeck = (!! localStorage.getItem('defaultDeck')) ? localStorage.getItem('defaultDeck') : false;

function invoke(action, version, params = {}) {
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
function retrieveMediaFile(imgSrc) {

    result = invoke('retrieveMediaFile', 6, {
        //"filename": "_dog_1582907679938.jpg"
        "filename": imgSrc
    });
    return result;
}
function retrieveDeckNames() {
    return invoke('deckNames', 6);
}
function setDecks() {
    retrieveDeckNames().then(decks => {
        decks  = decks.filter(d => d.toLowerCase() !== 'predefinito');
        $.each(decks, function () {
            var option = $("<option />");
            if (this.toString() === defaultDeck) { 
                console.log('entrato');
                option.attr('selected', 'selected'); 
            }
            $('#deckName').append(option.val(this).text(this));
        });
    });
}
function addCard(card, filename, sound) {
    filename = filename + ".jpg";
    invoke('storeMediaFile', 6, {
        "filename": filename,
        "url": card.src
    });
    invoke('addNote', 6, {
        note: {
            "deckName": card.deckName,
            "modelName": "2. Picture Words",
            "fields": {
                "Word": card.name,
                "Picture": '<img src="' + filename + '">',
                "Gender, Personal Connection, Extra Info (Back side)": card.connection,
                "Pronunciation (Recording and/or IPA)": sound.ipa + "[sound:" + sound.fileName + "]"
            },
            "options": {
                "allowDuplicate": true
            },
            "tags": [
                "Anki Daddo"
            ],
            "audio": {
                "url": sound.fileUrl,
                "filename": sound.fileName,
                "skipHash": "7e2c2f954ef6051373ba916f000168dc",
                "fields": [
                    "Front"
                ]
            }
        }
    });
}
function sendOnAnki(card) {
    var fileName = Util.getFileName(card);
    addCard(card, fileName, {
        ipa: card.ipa.text,
        fileName: fileName + '.mp3',
        fileUrl: card.ipa.soundUrl
    });
}
function addSound(soundIPAHref) {
    var player = document.getElementById("audio-container-player");
    player = $('#audio-container-player').clone().css('display', 'inline');
    $(player).children('source').attr('src', soundIPAHref);
    $('#audio-container').append(player).append('<input type="radio" name="ipaSoundRB" value="' + soundIPAHref + '" > <br />');
    /* Spunto il primo audio della lista */
    var primoAudio = $('#audio-container').children('input[type=radio]');
    $(primoAudio[0]).attr('checked', 'checked');
}
/** Classes */
class Util {
    static getFileName(card) {
        var date = new Date();
        var timestamp = date.getTime();
        var filename = '_' + card.name + '_' + timestamp;
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
                    addSound(soundIPAHref);
                } else if (lang === 'en') {
                    PhpCall.getIpaSound(decodeURIComponent($(this).attr('href')));
                }
            });
        });
    }
    static searchWord(word) {
        var name = ($('#languages').children('option:selected').val() !== 'de') ? $('#name').val().toLowerCase() : $('#name').val();
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

                    var card = {
                        name: name,
                        connection: connection,
                        src: src,
                        deckName: deckName,
                        ipa: {
                            text: $('input#ipa').val(),
                            soundUrl: ipaSound //$('input#ipaSound').val() //'https://upload.wikimedia.org/wikipedia/commons/4/4c/En-us-sand.ogg'
                        }
                    }
                    if (confirm('Inviare su Anki?')) sendOnAnki(card);
                });
            },
            fail: function (xhr, textStatus, errorThrown) {
                console.log('request failed');
            }
        });

    }
    static getIpaSound(url) {
        jQuery.get('get_ipa_sound.php', { url: url}, function (data) {
            var soundHtml = $.parseHTML(data);
            var soundIPAHref = 'https:' + $('.internal', soundHtml).attr('href');
            addSound(soundIPAHref);
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
    setDecks();
    document.getElementById('deckName').addEventListener('change', function() {
        localStorage.setItem('defaultDeck', this.value);
    });
});