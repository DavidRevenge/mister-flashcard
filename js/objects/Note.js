var json = "{
sdfasdfsd
}";
class Note {
    list = [];
    ul = '';
    input = '';
    constructor() {
        this.ul = document.createElement('ul');
        this.refresh();
        this.addInput();
        this.addButton();
    }
    add(text) {
        if (this.checkInput(text)) {
            var li = document.createElement('li');
            var deleteIcon  = document.createElement('span');
            deleteIcon.setAttribute('style', 'color: red; font-weight: bold;');
            deleteIcon.innerHTML = 'X';
            deleteIcon.style.marginLeft = '0.5rem';
            li.classList.add('cursor-pointer');
            li.innerHTML = '<span class="text">'+text+'</span>';
            var that = this;
            li.querySelector('.text').addEventListener('click', function () {
                that.strike(this);
            });
            deleteIcon.addEventListener('click', function () {
                li.remove();
            });
            li.append(deleteIcon);
            this.ul.append(li);
            this.refresh();
        }
    }
    strike(text) {
        if (!text.classList.contains('strike')) text.classList.add('strike');
        else text.classList.remove('strike');
    }
    refresh() {
        document.getElementById('listBox').append(this.ul);
    }
    addInput() {
        var input = document.createElement('input');
        input.setAttribute('autocomplete', 'off' + new Date().getTime());
        this.input = input;
        var that = this;
        this.input.addEventListener("keyup", function (event) {
            if (event.keyCode === 13) {
                that.add(that.input.value);
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
            that.add(that.input.value);
        });
        document.getElementById('note').append(button);
    }
    checkInput() {
        if (this.input.value.trim() === "") return false;
        else return true;
    }

}
var note = new Note();
