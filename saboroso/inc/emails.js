const res = require('express/lib/response');
var conn = require('./db');

module.exports = {

    save(req) {
        return new Promise((resolve, reject) => {

            if (!req.fields.email) {

                reject('Preencha o e-mail');
        
            } else {
        
                conn.query(`
                
                      INSERT INTO tb_emails (email) VALUES (?)
        
                  `, [req.fields.email], (err, results) => {
        
                      if (err) {
        
                          reject(err.message);

                      } else {
                          resolve(results);
                      }
        
                  });
            }
            
        });
    },

    getEmails() {

        return new Promise((res, rej) => {
            conn.query(`

                SELECT * FROM tb_emails ORDER BY id
            
            `, (err, results) => {

                if (err) {
                    rej(err);
                } else {
                    res(results);
                }
                
            });

        });
    },

    delete(id) {

        return new Promise((resolve, reject) => {

            conn.query(`
            
                DELETE FROM tb_emails WHERE id = ?
            
            `, [
                id
            ], (err, results) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }

            });
        });
    }
}