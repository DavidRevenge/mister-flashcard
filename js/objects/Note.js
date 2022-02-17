class Note {
    list = JSON.parse(localStorage.getItem('noteList')); //['First', 'Second', 'Third'];
    ul = '';
    input = '';
    constructor() {
        this.ul = document.createElement('ul');
        this.refresh();
        this.addInput();
        this.addButton();
        this.loadList();
    }
    add(text, notValidate = false, id, strike = false) {
        if ((this.checkInput(text) || notValidate === true)) {
            var li = document.createElement('li');
            var deleteIcon = document.createElement('span');
            deleteIcon.setAttribute('style', 'color: red; font-weight: bold;');
            deleteIcon.innerHTML = 'X';
            deleteIcon.style.marginLeft = '0.5rem';
            li.classList.add('cursor-pointer');
            li.innerHTML = '<span class="text">' + text + '</span>';
            var that = this;
            li.querySelector('.text').addEventListener('click', function () {
                that.strike(this, id);
            });
            if (strike === true) li.querySelector('.text').click();
            deleteIcon.setAttribute('data-id', id);
            deleteIcon.addEventListener('click', function () {
                li.remove();
                that.removeFromList(id);
            });
            li.setAttribute('id', id);
            li.append(deleteIcon);
            this.ul.append(li);
            this.refresh();
        }
    }
    strike(text, id) {
        if (!text.classList.contains('strike')) {
            this.list.forEach(elem => {
                if (elem.id === id) elem.strike = true;
            });
            text.classList.add('strike');
        } else {
            this.list.forEach(elem => {
                if (elem.id === id) elem.strike = false;
            });
            text.classList.remove('strike');
        }
        this.saveList();
    }
    saveList() {
        localStorage.setItem('noteList', JSON.stringify(this.list));
    }
    refresh() {
        document.getElementById('listBox').append(this.ul);
    }
    removeFromList(id) {
        this.list = this.list.filter(elem => elem.id !== id);
        this.saveList();
    }
    addToList(text, id) {
        var object = new NoteModel(id, text);
        this.list.push(object);
        this.saveList();
    }
    addInput() {
        var input = document.createElement('input');
        input.setAttribute('autocomplete', 'off' + new Date().getTime());
        this.input = input;
        var that = this;
        this.input.addEventListener("keyup", function (event) {
            if (event.keyCode === 13) {
                that.completeAdd();
            }
        });
        document.getElementById('note').append(this.input);
    }
    addButton() {
        var button = document.createElement('button');
        button.innerHTML = 'Insert';
        button.setAttribute('style', 'margin-left: 0.5rem');
        var that = this;
        button.addEventListener('click', function () {
            that.completeAdd();
        });
        document.getElementById('note').append(button);
    }
    completeAdd() {
        var id = Util.makeid(10);
        this.add(this.input.value, false, id);
        this.addToList(this.input.value, id);
        document.querySelector('#note input').value = '';
    }
    checkInput() {
        if (this.input.value.trim() === "") return false;
        else return true;
    }
    loadList() {
        var that = this;
        this.list.forEach(function (elem) {
            that.add(elem.text, true, elem.id, elem.strike);
        });
    }

}
var note = new Note();
