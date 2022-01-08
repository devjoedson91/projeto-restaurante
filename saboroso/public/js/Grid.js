class Grid {

    constructor(configs) {

        configs.listeners = Object.assign({

            afterUpdateClick: (e) => { // o assign nao junta esse objeto com os de mais.
                $('#modal-update').modal('show');
            },
            afterDeleteClick: (e) => { // o assign nao junta esse objeto com os de mais.
                window.location.reload();
            }

        }, configs.listeners);

        this.options = Object.assign({}, { // junta os outros objetos no {}
            
            formCreate: '#modal-create form',
            formUpdate: '#modal-update form',
            btnUpdate: '.btn-update',
            btnDelete: '.btn-delete',
                        
        }, configs);

        this.initForms();
        this.initButtons();

    }

    initForms() {

        this.formCreate = document.querySelector(this.options.formCreate);

        // para entender esse codigo, ver o arquivo formsave

        this.formCreate.save().then(json => {

            window.location.reload();

        }).catch(err => console.log('eRRO: '+err));


        this.formUpdate = document.querySelector(this.options.formUpdate);

        this.formUpdate.save().then(json => {

            window.location.reload();

        }).catch(err => console.log(err));


    }

    fireEvent(name, args) { // nome do evento e os argumentos

        if (typeof this.options.listeners[name] === 'function') this.options.listeners[name].apply(this, args);

    }

    getTRData(e) {

        let tr = e.path.find(el => { // path é o caminho onde o botao esta dentro da arvore dom

            return (el.tagName.toUpperCase() === 'TR');

        });

        return JSON.parse(tr.dataset.row);

    }

    initButtons() {

        [...document.querySelectorAll(this.options.btnUpdate)].forEach(btn => {

            btn.addEventListener('click', e => {

                this.fireEvent('beforeUpdateClick', [e]);

                let data = this.getTRData(e);

                for (let name in data) {

                    let input = this.formUpdate.querySelector(`[name=${name}]`);

                    switch(name) {
                    case 'date':
                        if (input) input.value = moment(data[name]).format('YYYY-MM-DD');
                        //console.log(moment(data[name]).format('YYYY-MM-DD'));
                        break; 
                    default:
                        if (input) input.value = data[name];

                    }

                }

                this.fireEvent('afterUpdateClick', [e]);

            });

        });

        [...document.querySelectorAll(this.options.btnDelete)].forEach(btn => {

            this.fireEvent('beforeDeleteClick', [e]);

            btn.addEventListener('click', e => {

                let data = this.getTRData(e);

                if (confirm(eval('`'+this.options.deleteMsg+'`'))) {

                    fetch(eval('`'+this.options.deleteUrl+'`'), {

                        method: 'DELETE',

                        })
                        .then(response => response.json())
                        .then(json => {
                            this.fireEvent('afterDeleteClick');

                    })
                }
            });

        });
    }

}