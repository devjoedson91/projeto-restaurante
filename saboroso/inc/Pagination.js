let conn = require('./db');

class Pagination {

    constructor(query, params = [], itensPage = 10) {

        this.query = query;
        this.params = params;
        this.itensPage = itensPage;
        this.currentPage = 1;

    }

    getPage(page) {

        this.currentPage = page - 1;

        this.params.push(this.currentPage * this.itensPage, this.itensPage);

        return new Promise((resolve, reject) => {

            conn.query([this.query, 'SELECT FOUND_ROWS() AS FOUND_ROWS'].join('; '), this.params, (err, results) => {

                if (err) {
                    reject(err);
                } else {

                    this.data = results[0];
                    this.total = results[1][0].FOUND_ROWS;
                    this.totalPages = Math.ceil(this.total / this.currentPage);
                    this.currentPage++;

                    resolve(this.data);
                    
                }

            });
        })
    }

    getTotal() {

        return this.total;
    }

    getCurrentPage() {

        return this.currentPage;
    }

    getTotalPages() {

        this.totalPages;
    }

    // metodo para aplicar navegação pelos botões 1,2,3,...

    getNavigation(params) {

        // variavel que recebe o limite de botoes mostrados na pagina, cada botao é uma pagina

        let limitPageNav = 5;
        let links = [];

        // variaveis de inicio de navegação

        let pagStart = 0;
        let pagEnd = 0;

        if (this.getTotalPages() < limitPageNav) {
            limitPageNav = this.getTotalPages();
        }

        // se tiver na 1ª pagina, chama o numero 1

        if ((this.getCurrentPage() - parseInt(limitPageNav/2)) < 1 ) {

            pagStart = 1;
            pagEnd = limitPageNav;

        } // chegando nas ultimas paginas
        
        else if ((this.getCurrentPage() + parsetInt(limitPageNav)) > this.getTotalPages()) {

            pagStart = this.getTotalPages() - limitPageNav;
            pagEnd = this.getTotalPages();

        } // no caso de estar no meio da navegação 
        
        else {

            pagStart = this.getCurrentPage() - parseInt(limitPageNav/2);
            pagEnd = this.getCurrentPage() + parseInt(limitPageNav/2);
        }

        // botao anterior

        if (this.getCurrentPage() > 1) { // tenho pagina anterior

            links.push({
                text: '<',
                href: '?' + this.getQueryString(Object.assign({}, params, {page: this.getCurrentPage() - 1 }))
            });

        }

        for (let x = pagStart; x <= pagEnd; x++) {

            links.push({
                text: x,
                href: '?' + this.getQueryString(Object.assign({}, params, {page: x})),
                active: (x === this.getCurrentPage())
            });
        }

        // botao proximo

        if (this.getCurrentPage() < this.getTotalPages()) {

            links.push({
                text: '>',
                href: '?' + this.getQueryString(Object.assign({}, params, {page: this.getCurrentPage() + 1 }))
            });

        }

        return links;
    }

    getQueryString(params) {

        let queryString = [];

        for (let name in params) {

            queryString.push(`${name}=${params[name]}`);

        }

        return queryString.join('&');

    }
 

}

module.exports = Pagination;