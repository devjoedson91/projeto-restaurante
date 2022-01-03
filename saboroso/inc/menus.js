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

            //fields.photo = `images/${path.parse(files.photo.path).base}`;

            console.log('QUE PORRA É ESSA: ',fields.photo);

            console.log('FILES.PHOTO', files.photo.newFilename);

            let query, queryPhoto = '', params = [
                fields.title,
                fields.description,
                fields.price
            ];

            if (files.photo.newFilename) {

                 queryPhoto = ',photo = ?';
                 params.push(`images/${files.photo.newFilename}`);
            }

            if (parseInt(fields.id) > 0) {

                params.push(fields.id);

                query = `
                
                    UPDATE tb_menus 
                    SET title = ?,
                        description = ?,
                        price = ?
                        ${queryPhoto}
                    WHERE id = ?
                `;

            } else {

                if (!files.photo.newFilename) {

                    reject('Envie a foto do prato.');
                }

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

    }

}