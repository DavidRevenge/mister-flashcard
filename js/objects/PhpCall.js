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
            if (!!result[0]) Input.setIpa(result[0].innerText);

            Ipa.printList(result);

            $('.searchedIPA').click(function () {
                Input.setIpa($(this).text());
            })
            if (lang === 'en') {
                /** Replace to for verb */
                word = word.replace('to ', '');
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
                Input.setConnection('');
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
                    var src = $(this).attr('src');
                    var card = new CardModel();

                    $.ajax('download_image.php', {
                        type: 'GET',
                        timeout: 5000,
                        data: { url: src, imgName: name, createStickers: createStickers },
                        success: function (data, status, xhr) {
                            $("#sampleImg").attr('src', DOWNLOAD_FOLDER + name + '.jpg?version=' + Date.now());

                            var listener = new Listener(name);

                            listener.numbers();
                            listener.star();
                            listener.calendar();
                            listener.removeSticker();

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
                // $('.cardImage').first().click();
            },
            fail: function (xhr, textStatus, errorThrown) {
                console.log('request failed');
            }
        });

    }
    static getIpaSound(url = false, soundTitle = false, otherWebsite = false, radioButtonToCheck = false) {
        Util.showLoader();
        if (otherWebsite === true) {
            jQuery.get('get_ipa_sound.php', { url: url, otherWebsite: true }, function (data) {
                var soundHtml = $.parseHTML(data);
                var soundIPAHref = $('.phons_br', soundHtml).find('.pron-uk').attr('data-src-ogg');

                var ipa = $('.phons_br', soundHtml).find('.phon').text();
                Ipa.prepend(ipa);
                Input.setIpa(ipa);

                if (radioButtonToCheck === false) MisterFlashcard.addSound(soundIPAHref, soundTitle);
                else MisterFlashcard.addSound(soundIPAHref, soundTitle, radioButtonToCheck);
                Util.hideLoader();
            });
        } else {
            jQuery.get('get_ipa_sound.php', { url: url }, function (data) {
                var soundHtml = $.parseHTML(data);
                var soundIPAHref = 'https:' + $('.internal', soundHtml).attr('href');
                MisterFlashcard.addSound(soundIPAHref, soundTitle);
                Util.hideLoader();
            });
        }
    }
}