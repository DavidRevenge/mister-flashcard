var objects = ['PictureWordsModel', 'BasicModel','BasicFieldsModel','PWFieldsModel','AudioModel','SoundModel','CardModel'];

objects.forEach(function(obj) {
    MisterFlashcard.addScript('js/models/'+obj+'.js');
});
// MisterFlashcard.addScript('js/models/PictureWordsModel.js');
// MisterFlashcard.addScript('js/models/BasicModel.js');
// MisterFlashcard.addScript('js/models/BasicFieldsModel.js');
// MisterFlashcard.addScript('js/models/PWFieldsModel.js');
// MisterFlashcard.addScript('js/models/AudioModel.js');
// MisterFlashcard.addScript('js/models/SoundModel.js');
// MisterFlashcard.addScript('js/models/CardModel.js');