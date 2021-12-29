<?php



$word = empty($_GET['word']) ? 'language' : $_GET['word'];

$word = urlencode($word);

//The URL with parameters / query string.
//$url = 'https://api.qwant.com/api/search/images?t=image&q=' . $word . '&count=50&uiv=4&locale=it_IT';
//https://api.qwant.com/v3/search/images?q=dog&t=images&count=50&locale=it_IT&offset=0&device=desktop&safesearch=1
$url = 'https://api.qwant.com/v3/search/images?q=' . $word . '&t=images&count=50&locale=it_IT&offset=0';
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
