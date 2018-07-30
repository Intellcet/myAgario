function GenerateNicks() {

    var nicks1 = new Array ('Клин', 'Гад', 'Дяд', 'Фик', 'Лор', 'Гул', 'Керч', 'Жоз', 'Диф', 'Ран', 'Кл', 'Бюл', 'Фил', 'Шок', 'Вак', 'Рад', 'Чех', 'Хэд', 'Ук', 'Цыф');
    var nicks2 = new Array ('ошер', 'алик', 'узок', 'ирод', 'еф', 'ох', 'эх', 'яван', 'юбар', 'етр', 'ыва', 'юстик', 'якар', 'усн', 'еп', 'обр', 'уф', 'агл', 'ран', 'ап', 'ябл');
    var nick;

    this.genNick = function () {
        var beg = Math.floor(Math.random() * nicks1.length);
        var end = Math.floor(Math.random() * nicks2.length)
        return nicks1[beg] + nicks2[end];
    };
};