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
            btnUpdate: 'btn-update',
            btnDelete: 'btn-delete',
            onUpdateLoad: (form, name, data) => {

                let input = form.querySelector('[name='+name+']');
                if (input) input.value = data[name];
            }
                        
        }, configs);

        this.rows = [...document.querySelectorAll('table tbody tr')];

        this.initForms();
        this.initButtons();

    }

    initForms() {

        this.formCreate = document.querySelector(this.options.formCreate);   

        // para entender esse codigo, ver o arquivo formsave

        // o formulario so poderá criar o save caso ele exista

        if (this.formCreate) {

            this.formCreate.save({

                success: () => {
    
                    this.fireEvent('afterFormCreate');
                },
                failure: () => {
    
                    this.fireEvent('afterFormCreateError');
                    console.log('eRRO: '+err);
    
                }
    
            });

        }

        this.formUpdate = document.querySelector(this.options.formUpdate);

        if (this.formUpdate) {

            this.formUpdate.save({

                success: () => {
    
                    this.fireEvent('afterFormUpdate');
                },
                failure: () => {
    
                    this.fireEvent('afterFormUpdateError');
                }
    
        
            });

        }

    }

    fireEvent(name, args) { // nome do evento e os argumentos

        if (typeof this.options.listeners[name] === 'function') this.options.listeners[name].apply(this, args);

        //console.log(name, args);

    }

    getTRData(e) {

        let tr = e.path.find(el => { // path é o caminho onde o botao esta dentro da arvore dom

            return (el.tagName.toUpperCase() === 'TR');

        });

        return JSON.parse(tr.dataset.row);

    }

    // metodo do click no botao btnUpdate

    btnUpdateClick(e) {

        let data = this.getTRData(e);

        for (let name in data) {

            this.options.onUpdateLoad(this.formUpdate, name, data);

        }

        this.fireEvent('afterUpdateClick', [e]);

    }

    // metodo do click no botao btnDelete

    btnDeleteClick(e) {

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
   

    }

    initButtons() {

        this.rows.forEach(row => {

            [...row.querySelectorAll('.btn')].forEach(btn => {

                btn.addEventListener('click', e => {

                    if (e.target.classList.contains(this.options.btnUpdate)) { // o alvo do evento clicado contem a class do btnUpdate?

                        this.btnUpdateClick(e);

                    } else if (e.target.classList.contains(this.options.btnDelete)) {

                        this.btnDeleteClick(e);

                    } else {

                        this.fireEvent('buttonClick', [e.target, this.getTRData(e), e]);
                    }

                });

            });

        });

    }

}