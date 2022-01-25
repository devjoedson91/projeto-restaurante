class Grid {

    constructor(configs) {

        configs.listeners = Object.assign({

            afterUpdateClick: (e) => { // o assign nao junta esse objeto com os de mais.
                $('#modal-update').modal('show');
            },
            afterDeleteClick: (e) => { // o assign nao junta esse objeto com os de mais.
                window.location.reload();
            },
            afterFormCreate: (e) => {

                window.location.reload();
            },
            afterFormUpdate: (e) => {

                window.location.reload();
            },
            afterFormCreateError: (e) => {

                alert('Não foi possivel enviar o formulário');
            },
            afterFormUpdateError: (e) => {

                alert('Não foi possivel editar o formulário');
            }

        }, configs.listeners);

        this.options = Object.assign({}, { // junta os outros objetos no {}
            
            formCreate: '#modal-create form',
            formUpdate: '#modal-update form',
            btnUpdate: '.btn-update',
            btnDelete: '.btn-delete',
            onUpdateLoad: (form, name, data) => {

                let input = form.querySelector('[name='+name+']');
                if (input) input.value = data[name];
            }
                        
        }, configs);

        this.initForms();
        this.initButtons();

    }

    initForms() {

        this.formCreate = document.querySelector(this.options.formCreate);

        // para entender esse codigo, ver o arquivo formsave

        this.formCreate.save().then(json => {

            this.fireEvent('afterFormCreate');

        }).catch(err => {
            
            this.fireEvent('afterFormCreateError');
            console.log('eRRO: '+err);
            
        })


        this.formUpdate = document.querySelector(this.options.formUpdate);

        this.formUpdate.save().then(json => {

            this.fireEvent('afterFormUpdate');

        }).catch(err => {

            this.fireEvent('afterFormUpdateError');

        })


    }

    fireEvent(name, args) { // nome do evento e os argumentos

        if (typeof this.options.listeners[name] === 'function') this.options.listeners[name].apply(this, args);

        console.log(name, args);

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

                let data = this.getTRData(e);

                for (let name in data) {

                    this.options.onUpdateLoad(this.formUpdate, name, data);

                }

                this.fireEvent('afterUpdateClick', [e]);

            });

        });

        [...document.querySelectorAll(this.options.btnDelete)].forEach(btn => {

           btn.addEventListener('click', e => {

                this.fireEvent('beforeDeleteClick');

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