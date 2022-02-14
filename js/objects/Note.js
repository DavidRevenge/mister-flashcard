class Note {
    list = [];
    ul = '';
    constructor() {
        this.ul = document.createElement('ul');
        this.refresh();
    }
    add(text) {
        var li  = document.createElement('li');
        li.classList.add('cursor-pointer');
        li.innerHTML = text;
        var that = this;
        li.addEventListener('click', function() {
            that.strike(this);
        });
        this.ul.append(li);
        this.refresh();
    }
    strike(li) {
        if ( ! li.classList.contains('strike')) li.classList.add('strike');
        else li.classList.remove('strike');
    }
    refresh() {
        document.getElementById('note').append(this.ul);
    }

}
var note = new Note();
note.add('ciao');
note.add('ciao');
note.add('ciao');
note.add('ciao');
