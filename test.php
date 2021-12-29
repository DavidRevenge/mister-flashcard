
<?php 
    echo "test.php partito!";

    $url = 'https://www.cicap.org/new/images/a/t/calamaro_gigante_femmina.jpg';
    $img = 'img/calamaro.jpg';
    file_put_contents($img, file_get_contents($url));
?>