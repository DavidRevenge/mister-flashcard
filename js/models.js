var objects = ['PictureWordsModel', 'BasicModel','BasicFieldsModel','PWFieldsModel','AudioModel','SoundModel','CardModel', 'NoteModel'];

objects.forEach(function(obj) {
    MisterFlashcard.addScript('js/models/'+obj+'.js');
});