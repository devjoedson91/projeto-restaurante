// adicionar um metodo ao objeto do dom de formularios e adicionar um recurso pra ele

// dir(document.querySelector('form')) - codigo para encontrar os formularios do projeto e identificar seu prototype

HTMLFormElement.prototype.save = function() { // adicionando um metodo ao prototype HTMLFormElement

    let form = this;

    return new Promise((resolve, reject) => {

        form.addEventListener('submit', e => { 

            e.preventDefault();
           
            let formData = new FormData(form); // essa classe lista o formulario como objeto
       
            const option = {
              method: form.method, // metodo do formulario
              body: formData // dados do form
            }
    
       
            fetch(form.action, option)
                 .then(response => response.json())
                 .then(json => {

                        console.log('JSON', json);

                 })
                     
                //      .then(json => {
                         
                //         console.log(json);
                //         resolve(json);
                    
                //     })

                //  ).catch(err => reject(err))
                
       
         });


    })

}