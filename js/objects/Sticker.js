class Sticker {
    name = "";
    constructor(name) {
        this.name = name;
    }
    addClickListener(id, suffix) {
        var that = this;
        document.getElementById(id).addEventListener('click', function () {
            $("#sampleImg").attr('src', DOWNLOAD_FOLDER + that.name + suffix + '?version=' + Date.now());
        });
    }
}
class Listener extends Sticker {
    constructor(name) {
        super(name);
    }
    numbers() {
        super.addClickListener('number_1', '_1.jpg');
        super.addClickListener('number_2', '_2.jpg');
        super.addClickListener('number_3', '_3.jpg');
        super.addClickListener('number_4', '_4.jpg');
        super.addClickListener('number_5', '_5.jpg');
        super.addClickListener('number_6', '_6.jpg');
        super.addClickListener('number_7', '_7.jpg');
        super.addClickListener('number_8', '_8.jpg');
        super.addClickListener('number_9', '_9.jpg');
        super.addClickListener('number_10', '_10.jpg');
        super.addClickListener('number_11', '_11.jpg');
        super.addClickListener('number_12', '_12.jpg');
    }
    star() {
        super.addClickListener('addStar', '_star.jpg');
    }
    calendar() {
        super.addClickListener('addCalendar', '_calendar.jpg');
    }
    removeSticker() {
        super.addClickListener('removeSticker', '.jpg');
    }
}