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

    this.getUserById = id => {
        return new Promise(resolve => {
            if (id) {
                const query = "SELECT * FROM users WHERE id=?";
                db.get(query, [id], (err, row) => { resolve((err) ? null : row); })
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
                        if (!!options[option]) {
                            name.push(`${option}=?`);
                            val.push(options[option]);
                        }
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

    this.createParty = leaderId => {
        return new Promise(resolve => {
            if (leaderId) {
                db.serialize(async () => {
                    const user = await this.getUserById(leaderId);
                    if (user) {
                        const query = "INSERT INTO party (id_leader) VALUES (?)";
                        db.run(query, [leaderId], err => {
                            if (!err) {
                                const query = "SELECT id FROM party WHERE id_leader=?";
                                db.get(query, [leaderId], async (err, row) => {
                                    if (row) {
                                        resolve(await this.addMemberToParty(row.id, leaderId));
                                    } else {
                                        resolve(null);
                                    }
                                });
                            }
                            resolve(null);
                        });
                    } else {
                        resolve(null);
                    }
                });
            } else {
                resolve(null);
            }
        });
    };

    this.getPartyByIdLeader = leaderId => {
        return new Promise(resolve => {
            if (leaderId) {
                const query = "SELECT * FROM party WHERE id_leader=?";
                db.get(query, [leaderId], (err, row) => { resolve((err) ? null : row); });
            } else {
                resolve(null);
            }
        });
    };

    this.addMemberToParty = (partyId, memberId) => {
        return new Promise(resolve => {
            if (partyId && memberId) {
                const query = "INSERT INTO members (id_party, id_member) VALUES (?, ?)";
                db.run(query, [partyId, memberId], err => { resolve(!(err)); });
            } else {
                resolve(null);
            }
        });
    };

    this.getPartyId = id => {
        return new Promise(resolve => {
           if (id) {
               const query = "SELECT id_party AS id FROM members WHERE id_member = ?";
               db.get(query, [id], (err, row) => { resolve((err) ? null : row) });
           } else {
               resolve(null);
           }
        });
    };

    this.isPartyLeader =  (idParty, idMember) => {
        return new Promise(resolve => {
            if (idParty && idMember) {
                const query = "SELECT * FROM party WHERE id=? AND id_leader=?";
                db.get(query, [idParty, idMember], (err, row) => { resolve((err) ? null : row) });
            } else {
                resolve(null);
            }
        });
    };

    this.leaveFromParty = (idParty, idMember) => {
      return new Promise(resolve => {
          if (idParty && idMember) {
              const query = "DELETE FROM members WHERE id_party=? AND id_member=?";
              db.run(query, [idParty, idMember], err => { resolve(!(err)); });
          } else {
              resolve(null);
          }
      });
    };

    this.getUserParty = id => {
        return new Promise(resolve => {
            db.serialize(() => {
                if (id) {
                    const query = "SELECT id_party FROM members WHERE id_member = ?";
                    db.get(query, [id], (err, row) => {
                        if (row) {
                            const query = "SELECT id_member FROM members WHERE id_party = ?";
                            db.all(query, [row.id_party], (err, row) => {
                               if (row) {
                                   let query = "SELECT id, nickname FROM users WHERE";
                                   const arr = [];
                                   for (let res of row) {
                                       query += ' id=? OR';
                                       arr.push(res.id_member);
                                   }
                                   query = query.slice(0, query.length - 3);
                                   db.all(query, arr, (err, rows) => { resolve((err) ? null : rows); });
                               } else {
                                   resolve(null);
                               }
                            });
                        } else {
                            resolve(null);
                        }
                    });
                } else {
                    resolve(null);
                }
            });
        });
    };

    this.isUserLeader = id => {
        return new Promise(resolve => {
            if (id) {
                const query = "SELECT id FROM party WHERE id_leader=?";
                db.get(query, [id], (err, row) => { resolve((err) ? null : !!(row)); });
            } else {
                resolve(null);
            }
        });
    };

    this.simpleDeleteParty = id => {
        return new Promise(resolve => {
            if (id) {
                const query = "DELETE FROM party WHERE id=?";
                db.run(query, [id], err => { resolve(!err); });
            } else {
                resolve(null);
            }
        });
    };

    this.deleteParty = id => {
        return new Promise(resolve => {
            if (id) {
                db.serialize(() => {
                    const query = "DELETE FROM members WHERE id_member=?";
                    db.run(query, [id], err => {
                        if (!err) {
                            const query = "SELECT id FROM party WHERE id_leader=?";
                            db.get(query, [id], (err, row) => {
                                if (row) {
                                    const query = "DELETE FROM members WHERE id_party=?";
                                    db.run(query, [row.id], err => {
                                        if (!err) {
                                            const query = "DELETE FROM party WHERE id_leader=?";
                                            db.run(query, [id], err => { resolve(!(err)); });
                                        } else {
                                            resolve(null);
                                        }
                                    });
                                } else {
                                    resolve(null);
                                }
                            });
                        } else {
                            resolve(null);
                        }
                    });
                });
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