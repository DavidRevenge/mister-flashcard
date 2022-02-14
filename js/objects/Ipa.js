class Ipa {
    static append(text, title) {
        $('#ipa-container').append('<h5>' + title + '</h5><a href="#" class="searchedIPA" style="font-size: 1.5rem;">' + text + '</a><br />');
    }
    static prepend(text, title) {
        $('#ipa-container').prepend('<h5>' + title + '</h5><a href="#" class="searchedIPA" style="font-size: 1.5rem;">' + text + '</a><br />');
    }
    static printList(result) {
        result.each(function (index) {
            if (index >= 2) return false;
            var ipaTitle = $(this).closest('li').find('.qualifier-content a').html();
            Ipa.append($(this).text(), ipaTitle);
        });
    }
}