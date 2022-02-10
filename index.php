<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="css/croppie.css">
    <link rel="stylesheet" type="text/css" href="css/styles.css">
    
</head>

<body>
    <div class="container-fluid">
        <div class="loader"></div>
        <div class="row">
            <div class="col-12 col-lg-6 p-4">
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
                    <p>
                        <input type="text" name="ipa" id="ipa">
                        <input type="hidden" name="ipaSound" id="ipaSound">
                        <input id="addMinimalPairs" type="button" value="Add Minimal Pairs">
                    </p>
                    <form action="#">
                        <div style="border: 2px dashed black; display: inline-block; padding: 1rem;" id="audio-container">

                        </div>
                    </form>
                    <button id="getOxfordSound" class="m-2">Get Oxford Sound</button>
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

            </div>
            <div id="preview" class="col-12 col-md-4 pt-4 text-center">
                <div class="nameBox">
                     <span>Name</span>
                </div>
                <hr />
                <div id="imgBox" class="imgBox">
                   <img id="sampleImg" class="sample-img" src="img/sample.jpg">
                   <div class="toolBox">
                       <img id="addStar" src="img/star-icon.png">
                       <img id="addCalendar" src="img/calendar-icon.png">
                       <img id="removeSticker" src="img/remove.svg">
                   </div>
                   <div class="numberBox">
                       <img id="number_1" src="img/numbers/1.png">
                       <img id="number_2" src="img/numbers/2.png">
                       <img id="number_3" src="img/numbers/3.png">
                       <img id="number_4" src="img/numbers/4.png">
                       <img id="number_5" src="img/numbers/5.png">
                       <img id="number_6" src="img/numbers/6.png">
                       <img id="number_7" src="img/numbers/7.png">
                       <img id="number_8" src="img/numbers/8.png">
                       <img id="number_9" src="img/numbers/9.png">
                   </div>
                </div>
                <div class="ipaBox pt-3 mb-5">
                    <span>/ipa/</span>
                </div>
                <button id="openCropSampleImg" class="btn btn-primary w-50 mb-5">Open Crop</button>
                <button id="closeCropSampleImg" class="btn btn-danger w-50 mb-5 d-none">Close Crop</button>
                <button id="sendToAnkiOnCrop" class="btn btn-primary w-50 mb-5 d-none">Send</button>
                <button id="sendToAnki" class="btn btn-primary w-50 mb-5">Send</button>
            </div>
            
        </div>
        <div class="row">
            <div id="search-container">

            </div>
        </div>
    </div>




    </div>

    <div class="toastBox" aria-live="polite" aria-atomic="true">

        <!-- Then put toasts within -->
        <div class="toast" role="alert" aria-live="assertive" aria-atomic="true"  data-autohide="true" data-delay="3000" >
            <div class="toast-header">
                <strong class="mr-auto title"></strong>
                <small class="text-muted"></small>
                <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="toast-body">
               
            </div>
        </div>
    </div>


    <script src="js/jquery-3.4.1.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/croppie.min.js"></script>
    <script src="js/mister-flashcard.js"></script>


</body>

</html>
