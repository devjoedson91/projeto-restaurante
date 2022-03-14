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

    save(fields, files) {

        return new Promise((resolve, reject) => {

            fields.photo = `images/${path.parse(files.photo.filepath).base}`;

            console.log('QUE PORRA É ESSA: ',`images/${path.parse(files.photo.filepath).base}`);

            console.log('FILES.PHOTO', files.photo.newFilename);

            let query, params = [
                fields.title,
                fields.description,
                fields.price
            ];

            // if (files.photo.newFilename) {
                
            //      queryPhoto = ',photo = ?';
            //      params.push(fields.photo);
            // }

            if (parseInt(fields.id) > 0) {

                params.push(fields.id);

                query = `
                
                    UPDATE tb_menus 
                    SET title = ?,
                        description = ?,
                        price = ?
                    WHERE id = ?
                `;

            } else {

                if (!files.photo.newFilename) {

                    reject('Envie a foto do prato.');
                }

                params.push(fields.photo);

                query = `

                    INSERT INTO tb_menus (title, description, price, photo)
                    VALUES (?, ?, ?, ?)
                
                `;
                
            }

            conn.query(query, params, (err, results) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }

            });

        })

    },

    delete(id) {

        return new Promise((resolve, reject) => {

            conn.query(`
            
                DELETE FROM tb_menus WHERE id = ?
            
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

};