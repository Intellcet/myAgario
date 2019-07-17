const md5 = require('md5');
const express = require('express');
const router = express.Router();

function Router(options) {
    options = (options instanceof Object) ? options : {};
    const db = options.db;

    router.get('/registration', (req, res) => {
        res.sendFile(`${__dirname}/game/registration.html`);
    });

    router.get('/game', (req, res) => {
        res.sendFile(`${__dirname}/game/game.html`);
    });

    router.get('/game?', (req, res) => {
        console.log(req.query);
        res.send(req.query);
    });

    router.post('/', async (req, res) => {
        const login = req.body.login;
        let password = req.body.password;
        const nickname = req.body.nick;
        const color = req.body.color;
        if (login && password) {
            password = md5(login + password);
            const user = await db.getUser(login, password);
            if (user) {
                const token = md5(login + password);
                const result = await db.updateToken(user.id, token);
                if (result) {
                    await db.updateUser(user.id, { nickname, color });
                    return res.send({ code: 200, token })
                }
            }
            return res.send({ error: 'Пользователь с такими данными не найден.' });
        }
        res.send({error: 'Не введены логин или пароль.'});
    });

    router.post('/registration', async (req, res) => {
        const login = req.body.login;
        let password = req.body.password;
        const nickname = req.body.nick;
        if (login && password) {
            password = md5(login + password);
            const result = await db.setUser(login, password, nickname ? nickname : "");
            if (result) {
                return res.send({ code: 200 })
            }
            return res.send({ error: "Пользователь с таким логином уже существует." });
        }
        res.send({ error: "Ввели недостаточно данных." });
    });

    router.all('/*', (req, res) => {
        res.send('wrong way');
    });

    return router;
}

module.exports = Router;