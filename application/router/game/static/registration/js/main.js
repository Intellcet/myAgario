$(() => {

    const $selectors = {
        nick: $('.nick'), login: $('.login'), password: $('.password'), regBtn: $('.regBtn'),
    };

    const regexp = {
        rus: /^[а-яА-ЯёЁ]+/, //проверка на русские буквы
    };

    const SVG_ELEMS = {
        CORRECT: `url("data:image/svg+xml,%3Csvg width='45px' height='34px' viewBox='0 0 45 34' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg transform='translate%28-56.000000, -59.000000%29' fill='%232EEC96'%3E%3Cpolygon points='70.1468531 85.8671329 97.013986 59 100.58042 62.5664336 70.1468531 93 56 78.8531469 59.5664336 75.2867133'%3E%3C/polygon%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A") white no-repeat right 1rem center`,
        INCORRECT: `url("data:image/svg+xml,%3Csvg width='30px' height='30px' viewBox='0 0 30 30' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg transform='translate%28-128.000000, -59.000000%29' fill='%23F44336'%3E%3Cpolygon points='157.848404 61.9920213 145.980053 73.8603723 157.848404 85.7287234 154.856383 88.7207447 142.988032 76.8523936 131.119681 88.7207447 128.12766 85.7287234 139.996011 73.8603723 128.12766 61.9920213 131.119681 59 142.988032 70.8683511 154.856383 59'%3E%3C/polygon%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A") white no-repeat right 1rem center`,
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

    $selectors.login.on('keyup', function() {
        const elem = $(this);
        if (!regexp.rus.test(elem.val()) && elem.val() !== '') {//галочка
            $selectors.login.css('background', SVG_ELEMS.CORRECT);
        } else {//крестик
            $selectors.login.css('background', SVG_ELEMS.INCORRECT)
        }
        $selectors.login.css('background-size', '0.75rem');
    });

    $($selectors.password[0]).on('keyup', function() {
        const elem = $(this);
        if (!regexp.rus.test(elem.val()) && elem.val() !== '') {//галочка
            elem.css('background', SVG_ELEMS.CORRECT);
        } else {//крестик
            elem.css('background', SVG_ELEMS.INCORRECT)
        }
        elem.css('background-size', '0.75rem');
    });

    function showError(error, selector = null) {
        $('.error-block').hide().show();
        $('.err-elem').empty().append(error);
        if (!selector || selector.hasOwnProperty('password')) {
            $selectors.login.removeClass('error').addClass('error');
            $($selectors.password[0]).removeClass('error').addClass('error');
        } else {
            selector.removeClass('error').addClass('error');
        }
        setTimeout(() => {
            $selectors.login.removeClass('error');
            $selectors.password.removeClass('error');
        }, 1000);
    }

    async function auth() {
        let nick = null; let login = null; let password = null; let passwordAgain = null;
        if ($selectors.password.val() && $selectors.login.val()) {
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
                    $(document).off("keydown");
                    window.location.href = '/';
                } else {
                    showError(result.error);
                }
            } else {
                let str = "Пароли не совпадают.";
                showError(str, $selectors.password);
            }
        } else {
            let selector; let str;
            if (!$($selectors.password[0]).val() && !$selectors.login.val()) {
                str = "Не введены логин и пароль.";
                selector = { password: $($selectors.password[0]), login: $selectors.login };
            } else if(!$($selectors.password[0]).val() && $selectors.login.val()) {
                str = "Не введен пароль.";
                selector = $($selectors.password[0]);
            } else {
                str = "Не введен логин.";
                selector = $selectors.login;
            }
            showError(str, selector);
        }
    }

    $selectors.regBtn.on('click', () => {
        auth();
    });

    $(document).on('keydown', event => {
        if (event.keyCode === 13) {
            auth();
        }
    });

});



