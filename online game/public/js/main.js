window.onload = () => {
    if (localStorage.getItem('token')) {
        window.href = '/game';
    }
};
$(() => {
    const $selectors = {
        nick: $('.nick'), login: $('.login'), color: $('.color'), password: $('.password'), startBtn: $('.startBtn'),
    };

    const storage = localStorage;

    const regexp = {
        rus: /^[а-яА-ЯёЁ]+/, //проверка на русские буквы
    };

    function sendRequest(data) {
        return new Promise(resolve => {
            $.ajax({
                url: 'http://localhost:3000',
                type: 'POST',
                dataType: 'json',
                data,
                success: data => { resolve(data); },
            });
        });
    }

    function showError(error, selector = null) {
        $('.error-block').hide().show();
        $('.err-elem').empty().append(error);
        if (!selector || selector instanceof Object) {
            $selectors.login.removeClass('error').addClass('error');
            $selectors.password.removeClass('error').addClass('error');
        } else {
            selector.removeClass('error').addClass('error');
        }
        setTimeout(() => {
            $selectors.login.removeClass('error');
            $selectors.password.removeClass('error');
        }, 1000);
    }

    async function login() {
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
                showError(result.error);
            }
        } else {
            let selector; let str;
            if (!$selectors.password.val() && !$selectors.login.val()) {
                str = "Не введены логин и пароль.";
                selector = { password: $selectors.password, login: $selectors.login };
            } else if(!$selectors.password.val() && $selectors.login.val()) {
                str = "Не введен пароль.";
                selector = $selectors.password;
            } else {
                str = "Не введен логин.";
                selector = $selectors.login;
            }
            showError(str, selector);
        }
    }


    $selectors.login.on('keydown', event => {
        if (!regexp.rus.test(event.key)) {//галочка
            $selectors.login.css('background', `url("data:image/svg+xml,%3Csvg width='45px' height='34px' viewBox='0 0 45 34' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg transform='translate%28-56.000000, -59.000000%29' fill='%232EEC96'%3E%3Cpolygon points='70.1468531 85.8671329 97.013986 59 100.58042 62.5664336 70.1468531 93 56 78.8531469 59.5664336 75.2867133'%3E%3C/polygon%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A") white no-repeat right 1rem center`);
        } else {//крестик
            $selectors.login.css('background', `url("data:image/svg+xml,%3Csvg width='30px' height='30px' viewBox='0 0 30 30' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg transform='translate%28-128.000000, -59.000000%29' fill='%23F44336'%3E%3Cpolygon points='157.848404 61.9920213 145.980053 73.8603723 157.848404 85.7287234 154.856383 88.7207447 142.988032 76.8523936 131.119681 88.7207447 128.12766 85.7287234 139.996011 73.8603723 128.12766 61.9920213 131.119681 59 142.988032 70.8683511 154.856383 59'%3E%3C/polygon%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A") white no-repeat right 1rem center`)
        }
        $selectors.login.css('background-size', '0.75rem');
    });

    $selectors.password.on('keydown', event => {
        if (!regexp.rus.test(event.key)) {//галочка
            $selectors.password.css('background', `url("data:image/svg+xml,%3Csvg width='45px' height='34px' viewBox='0 0 45 34' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg transform='translate%28-56.000000, -59.000000%29' fill='%232EEC96'%3E%3Cpolygon points='70.1468531 85.8671329 97.013986 59 100.58042 62.5664336 70.1468531 93 56 78.8531469 59.5664336 75.2867133'%3E%3C/polygon%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A") white no-repeat right 1rem center`);
        } else {//крестик
            $selectors.password.css('background', `url("data:image/svg+xml,%3Csvg width='30px' height='30px' viewBox='0 0 30 30' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg transform='translate%28-128.000000, -59.000000%29' fill='%23F44336'%3E%3Cpolygon points='157.848404 61.9920213 145.980053 73.8603723 157.848404 85.7287234 154.856383 88.7207447 142.988032 76.8523936 131.119681 88.7207447 128.12766 85.7287234 139.996011 73.8603723 128.12766 61.9920213 131.119681 59 142.988032 70.8683511 154.856383 59'%3E%3C/polygon%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A") white no-repeat right 1rem center`)
        }
        $selectors.password.css('background-size', '0.75rem');
    });

    $selectors.color.on('keydown', event => {
        if (!regexp.rus.test(event.key)) {//галочка
            $selectors.color.css('background', `url("data:image/svg+xml,%3Csvg width='45px' height='34px' viewBox='0 0 45 34' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg transform='translate%28-56.000000, -59.000000%29' fill='%232EEC96'%3E%3Cpolygon points='70.1468531 85.8671329 97.013986 59 100.58042 62.5664336 70.1468531 93 56 78.8531469 59.5664336 75.2867133'%3E%3C/polygon%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A") white no-repeat right 1rem center`);
        } else {//крестик
            $selectors.color.css('background', `url("data:image/svg+xml,%3Csvg width='30px' height='30px' viewBox='0 0 30 30' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg transform='translate%28-128.000000, -59.000000%29' fill='%23F44336'%3E%3Cpolygon points='157.848404 61.9920213 145.980053 73.8603723 157.848404 85.7287234 154.856383 88.7207447 142.988032 76.8523936 131.119681 88.7207447 128.12766 85.7287234 139.996011 73.8603723 128.12766 61.9920213 131.119681 59 142.988032 70.8683511 154.856383 59'%3E%3C/polygon%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A") white no-repeat right 1rem center`)
        }
        $selectors.color.css('background-size', '0.75rem');
    });

    $selectors.startBtn.on('click', () => {
        login();
    });

    $(document).on('keydown', event => {
        if (event.keyCode === 13) {
            login();
        }
    });


});



