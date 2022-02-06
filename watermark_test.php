<?php
    // Load the stamp and the photo to apply the watermark to
    $stamp = imagecreatefrompng('img/star-icon.png');
    $im = imagecreatefromjpeg('img/sample.jpg');

// Set the margins for the stamp and get the height/width of the stamp image
    $marge_right = 10;
    $marge_bottom = 10;
    $sx = imagesx($stamp);
    $sy = imagesy($stamp);

// Copy the stamp image onto our photo using the margin offsets and the photo
    // width to calculate positioning of the stamp.
    imagecopy($im, $stamp, imagesx($im) - $sx - $marge_right, 0 + $marge_bottom, 0, 0, imagesx($stamp), imagesy($stamp));


// Output and free memory
    // header('Content-type: image/png');
     imagejpeg($im, 'img/watermark_test.jpg');
    // imagedestroy($im);