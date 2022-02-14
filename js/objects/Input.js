class Input {
    static setIpa(text) {
        $('input#ipa').val(text);
        Preview.setIpa(text);
    }
    static setName(name) {
        $('#name').val(name);
        Preview.setName(name);
    }
    static setConnection(name) {
        $('#connection').val(name);
    }
}