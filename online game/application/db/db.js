const sqlite3 = require('sqlite3').verbose();

function DB(options) {
    options = options instanceof Object ? options : {};
    let db;

    function isUniqLogin(login) {
        return new Promise(resolve => {
           db.serialize(() => {
               const query = 'SELECT id FROM users WHERE login=?';
               db.get(query, [login], (err, rows) => { resolve(rows) });
           });
        });
    }

    this.setUser = async (login, password, nickname) => {
        return new Promise(async resolve => {
            const result = await isUniqLogin(login);
            if (!result) {
                const query = "INSERT INTO users (login, password, nickname) VALUES (?, ?, ?)";
                db.run(query, [login, password, nickname], err => { resolve(!err); });
            } else {
                resolve(null);
            }
        });
    };

    this.getUser = (login, password) => {
        return new Promise(resolve => {
            if (login && password) {
                db.serialize(() => {
                    const query = "SELECT * FROM users WHERE login=? AND password=?";
                    db.get(query, [login, password], (err, rows) => { resolve((err) ? null : rows); });
                });
            } else {
                resolve(null);
            }
        });
    };

    this.getUserByToken = token => {
      return new Promise(resolve => {
          if (token) {
              db.serialize(() => {
                  const query = "SELECT * FROM users WHERE token=?";
                  db.get(query, [token], (err, rows) => { resolve((err) ? null: rows); });
              });
          } else {
              resolve(null);
          }
      });
    };

    this.updateToken = (id, token) => {
        return new Promise(resolve => {
            if (id) {
                db.serialize(() => {
                    const query = 'UPDATE users SET token=? WHERE id=?';
                    db.run(query, [token, id], err => { resolve(!err); });
                })
            } else {
                resolve(null);
            }
        });
    };

    this.getRecords = () => {
        return new Promise(resolve => {
           db.serialize(() => {
                const query = "SELECT nickname as nick, score FROM users";
                db.all(query, (err, rows) => { resolve((err) ? null : rows); });
           });
        });
    };

    this.updateUser = (id, options) => {
        return new Promise(resolve => {
            if (id && options) {
                if (options instanceof Object) {//много параметров
                    let name = [];
                    let val = [];
                    for (let option in options) {
                        name.push(`${option}=?`);
                        val.push(options[option]);
                    }
                    val.push(id);
                    const query =`UPDATE users SET ${name.join(', ')} WHERE id=?`;
                    db.run(query, val, err => { resolve(!err); });
                } else {//один параметр и это score
                    const query = "SELECT * FROM users WHERE id=?";
                    db.get(query, [id], (err, rows) => {
                        if (!err) {
                            rows.score++;
                            const query = `UPDATE users SET score=? WHERE id=?`;
                            db.run(query, [rows.score, id], err => { resolve(!err); });
                        } else {
                            resolve(null);
                        }
                    });
                }
            } else {
                resolve(null);
            }
        });
    };

    function init() {
      db = new sqlite3.Database(`${__dirname}/${options.SETTINGS.NAME}`)
    }
    init();

}

module.exports = DB;