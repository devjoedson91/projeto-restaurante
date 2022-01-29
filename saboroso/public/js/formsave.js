// adicionar um metodo ao objeto do dom de formularios e adicionar um recurso pra ele

// dir(document.querySelector('form')) - codigo para encontrar os formularios do projeto e identificar seu prototype

HTMLFormElement.prototype.save = function(config) { // adicionando um metodo ao prototype HTMLFormElement

    let form = this;

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
                  
                  if (json.error) {
                      if (typeof config.failure === 'function') config.failure(json.error);
                  } else {
                      if (typeof config.success === 'function') config.success(json);
                  }

           }).catch(err => {

                  if (typeof config.failure === 'function') config.failure(err);

           })
          
 
   });

}