<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
</head>

<body>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12 p-4">
                <fieldset>
                    <p>
                        <label for="name">Name: </label>
                        <input type="text" name="name" id="name" placeholder="Name card">
                    </p>
                    <p>
                        <label for="name">Personal Connection: </label>
                        <input size="40" type="text" name="connection" id="connection" placeholder="Personal experience connection">
                    </p>
                </fieldset>
                <fieldset>
                    <label for="word">Search: </label>
                    <input type="text" name="word" id="word" placeholder="Image to search for">
                    <input id="startSearch" type="submit" value="Search">
                </fieldset>
                <fieldset>
                    <label for="word">IPA: </label><br />
                    <p><input type="text" name="ipa" id="ipa"></p>
                    <input type="hidden" name="ipaSound" id="ipaSound">
                    <form action="#">
                        <div style="border: 2px dashed black; display: inline-block; padding: 1rem;" id="audio-container">
                        </div>
                    </form>
                    <audio style="display:none" id="audio-container-player" controls>
                        <source src="" type="audio/ogg">
                        <!--<source src="horse.mp3" type="audio/mpeg"> -->
                        Your browser does not support the audio element.
                    </audio>
                    <br />
                    <div id="ipa-container"></div>
                </fieldset>
                <fieldset>
                    <label for="word">Deck: </label><br />
                    <select id="deckName">
                    </select>
                </fieldset>
                <br />
                <select id="languages">
                    <option value="en">English</option>
                    <option value="de">German</option>
                </select>

                <br /> <br />

                <div id="search-container">

                </div>
            </div>
        </div>
    </div>
    <script src="js/jquery-3.4.1.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/mister-flashcard.js"></script>
</body>

</html>