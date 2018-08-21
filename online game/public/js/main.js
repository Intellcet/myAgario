$(() => {
    const $selectors = {
        nick: $('.nick'), login: $('.login'), color: $('.color'), password: $('.password'), startBtn: $('.startBtn'),
    };

    const storage = localStorage;

    function sendRequest(data) {
        return new Promise(resolve => {
            $.ajax({
                url: 'http://localhost:3000',
                type: 'POST',
                dataType: 'json',
                data,
                success: data => {
                    resolve(data);
                }
            });
        });
    }

    $selectors.startBtn.on('click', async () => {
        let nick = null; let color = null; let password = null; let login = null;
        if ($selectors.password.val() && $selectors.login.val()) {
            password = $selectors.password.val();
            login = $selectors.login.val();
            if ($selectors.nick.val()) { nick = $selectors.nick.val(); }
            if ($selectors.color.val()) { color = $selectors.color.val(); }
            password = md5(login + password);
            const result = await sendRequest({ login, password, nick, color });
            if (result.code === 200) {
                storage.setItem('token', result.token);
                $selectors.password.val(''); $selectors.password.val('');
                $selectors.nick.val('');     $selectors.color.val('');
                window.location.href = '/game';
            } else {
                console.log(result);
            }
        } else {
            alert('Не введены логин и (или) пароль!');
        }

    });


});



