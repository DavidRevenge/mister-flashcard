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

            // Util.addScript('js/erase.js');
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