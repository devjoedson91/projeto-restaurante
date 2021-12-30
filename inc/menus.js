let path = require('path');
let conn = require('./db');

module.exports = {
    getMenus() {
        return new Promise((res, rej) => {
            conn.query(`

                SELECT * FROM tb_menus ORDER BY title
            
            `, (err, results) => {

                if (err) {
                    rej(err);
                } else {
                    res(results);
                }
                
            });

        });
    },

    save(body) {

        return new Promise((resolve, reject) => {

            //fields.photo = `images/${path.parse(files.photo.path).base}`;

            conn.query(`

                INSERT INTO tb_menus (title, description, price, photo)
                VALUES (?, ?, ?, ?)
            
            `, [
                body.title,
                body.description,
                body.price,
                `images/${body.photo.name}`
            ], (err, results) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }

            });

        })

    }

}