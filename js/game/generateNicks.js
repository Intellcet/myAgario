function GenerateNicks() {

    const nicks1 = ['Клин', 'Гад', 'Дяд', 'Фик', 'Лор', 'Гул', 'Керч', 'Жоз', 'Диф', 'Ран', 'Кл', 'Бюл', 'Фил', 'Шок', 'Вак', 'Рад', 'Чех', 'Хэд', 'Ук', 'Цыф'];
    const nicks2 = ['ошер', 'алик', 'узок', 'ирод', 'еф', 'ох', 'эх', 'яван', 'юбар', 'етр', 'ыва', 'юстик', 'якар', 'усн', 'еп', 'обр', 'уф', 'агл', 'ран', 'ап', 'ябл'];

    this.genNick = () => {
        const beg = Math.floor(Math.random() * nicks1.length);
        const end = Math.floor(Math.random() * nicks2.length);
        return nicks1[beg] + nicks2[end];
    };
}