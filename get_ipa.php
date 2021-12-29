<?php



$word = empty($_GET['word']) ? 'language' : $_GET['word'];

$word = urlencode($word);

$lang = empty($_GET['lang']) ? 'en' : $_GET['lang'];

//The URL with parameters / query string.
$url = 'https://'.$lang.'.wiktionary.org/wiki/'.$word;

$curl_handle = curl_init();
curl_setopt($curl_handle, CURLOPT_URL, $url);
curl_setopt($curl_handle, CURLOPT_CONNECTTIMEOUT, 2);
curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($curl_handle, CURLOPT_USERAGENT, 'AnkiDaddo');
$query = curl_exec($curl_handle);
curl_close($curl_handle);

// //Once again, we use file_get_contents to GET the URL in question.
//  $contents = file_get_contents($url);


//Print out the contents.
echo $query;
