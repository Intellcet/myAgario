$(() => {

    const $selectors = {
        nick: $('.nick'), login: $('.login'), password: $('.password'), regBtn: $('.regBtn'),
    };

    function sendRequest(data) {
        return new Promise(resolve => {
            $.ajax({
                url: 'http://localhost:3000/registration',
                type: 'POST',
                dataType: 'json',
                data,
                success: data => {
                    resolve(data);
                }
            });
        });
    }

    $selectors.regBtn.on('click', async () => {
        let nick = null; let login = null; let password = null; let passwordAgain = null;
        if ($selectors.password.val() && $selectors.nick.val() && $selectors.login.val()) {
            password = $($selectors.password[0]).val();
            passwordAgain = $($selectors.password[1]).val();
            login = $selectors.login.val();
            nick = $selectors.nick.val();
            if (passwordAgain === password) {
                password = md5(login + password);
                const result = await sendRequest({ login, password, nick });
                if (result.code === 200) {
                    $selectors.password.val(''); $selectors.password.val('');
                    $selectors.nick.val('');
                    window.location.href = '/';
                } else {
                    console.log(result);
                }
            } else {
                alert('Пароли не совпадают!');
            }
        } else {
            alert('Не введены логин и (или) пароль!');
        }

    });

});



