
class Util {

    static toDataURL(src, callback, outputFormat) {
        var img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
            var canvas = document.createElement('CANVAS');
            var ctx = canvas.getContext('2d');
            var dataURL;
            canvas.height = this.naturalHeight;
            canvas.width = this.naturalWidth;
            ctx.drawImage(this, 0, 0);
            dataURL = canvas.toDataURL(outputFormat);
            callback(dataURL);
        };
        img.src = src;
        if (img.complete || img.complete === undefined) {
            img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
            img.src = src;
        }
    }
    /**
   * By Ken Fyrstenberg Nilsen
   *
   * drawImageProp(context, image [, x, y, width, height [,offsetX, offsetY]])
   *
   * If image and context are only arguments rectangle will equal canvas
  */
    static drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {

        if (arguments.length === 2) {
            x = y = 0;
            w = ctx.canvas.width;
            h = ctx.canvas.height;
        }

        // default offset is center
        offsetX = typeof offsetX === "number" ? offsetX : 0.5;
        offsetY = typeof offsetY === "number" ? offsetY : 0.5;

        // keep bounds [0.0, 1.0]
        if (offsetX < 0) offsetX = 0;
        if (offsetY < 0) offsetY = 0;
        if (offsetX > 1) offsetX = 1;
        if (offsetY > 1) offsetY = 1;

        var iw = img.width,
            ih = img.height,
            r = Math.min(w / iw, h / ih),
            nw = iw * r,   // new prop. width
            nh = ih * r,   // new prop. height
            cx, cy, cw, ch, ar = 1;

        // decide which gap to fill    
        if (nw < w) ar = w / nw;
        if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
        nw *= ar;
        nh *= ar;

        // calc source rectangle
        cw = iw / (nw / w);
        ch = ih / (nh / h);

        cx = (iw - cw) * offsetX;
        cy = (ih - ch) * offsetY;

        // make sure source rectangle is valid
        if (cx < 0) cx = 0;
        if (cy < 0) cy = 0;
        if (cw > iw) cw = iw;
        if (ch > ih) ch = ih;

        // fill image in dest. rectangle
        ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
    }

    static createCanvasByImage(src, canvasId) {
        var c = document.getElementById(canvasId); //<canvas id="myCanvas"></canvas>
        var ctx = c.getContext("2d");
        var img = new Image();
        img.onload = function () {
            //ctx.drawImage(img, 0, 0, img.width * 2, img.height * 2);
            Util.drawImageProp(ctx, img, 0, 0, 300, 150);
        };
        img.src = src;

    }
    static showToast(message) {
        var result = 'Result';
        $('.toast .title').html(result);
        $('.toast .toast-body').html(message);
        $('.toast').toast('show');
    }
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