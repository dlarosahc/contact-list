const NAME_REGEX = /^[A-Z][a-z]*[ ][A-Z][a-z ]*$/;
const NUMBER_REGEX = /^[0](412|212|424|426|414|416)[0-9]{7}$/;

const nameInput = document.querySelector('#input-name');
const numberInput = document.querySelector('#input-number');
const formBtn = document.querySelector('#form-btn');
const form = document.querySelector('#form');
const list = document.querySelector('#list');
const user = JSON.parse(localStorage.getItem('user'));
const logOut = document.querySelector('#logout-btn');
const totalContacts = document.querySelector('#total-contacts');

// Validations
let nameValidation = false;
let numberValidation = false;


  if (!user) {
    window.location.href = '../';
  }

  //Funcion para cerrar sesion
logOut.addEventListener('click', async e => {
  localStorage.removeItem('user');
  window.location.href = '../';
});



// Functions
const renderCounters = async () =>{
  const totalContact = contacts.length;
  totalContacts.innerHTML =`${totalContact}`;
  
  } 
  


const validateInput = (input, validation) => {
  const infoText = input.parentElement.children[2];
  if (input.value === '') {
    input.classList.remove('incorrect');
    input.classList.remove('correct');
    infoText.classList.remove('show');
  } else if (validation) {
    input.classList.add('correct');
    input.classList.remove('incorrect');
    infoText.classList.remove('show');
  } else {
    input.classList.add('incorrect');
    input.classList.remove('correct');
    infoText.classList.add('show');
  }

  if (nameValidation && numberValidation) {
    formBtn.disabled = false;
  } else {
    formBtn.disabled = true;
  }
}


// Data
let contacts = [];

nameInput.addEventListener('input', e => {
  nameValidation = NAME_REGEX.test(nameInput.value);
  validateInput(nameInput, nameValidation);
});

numberInput.addEventListener('input', e => {
  numberValidation = NUMBER_REGEX.test(numberInput.value);
  validateInput(numberInput, numberValidation);
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  const responseJSON = await fetch('http://localhost:3000/contacts', {
      method: 'post',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({contacto: nameInput.value, numero: numberInput.value, user: user.username}),
  });

  const response = await responseJSON.json();

  const li= document.createElement('li');
  li.innerHTML = `
  <li class="contact" id="${response.id}">
   <button class="delete-btn">
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="delete-icon">
       <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
     </svg>        
   </button>
   <p>${response.contacto}</p>
   <p>${response.numero}</p>
   <button class="edit-btn">
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="edit-icon">
       <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
     </svg>
   </button>
   </li>
 `;
 list.append(li)
 form.reset();
 nameInput.classList.remove('correct');
 numberInput.classList.remove('correct');
 nameValidation = false;
  numberValidation = false;
  formBtn.disabled = true;
  nameValidation = false;
});

//Funcion para que se quede la info al recargar la pagina.
const getContacts = async () => {
  const response = await fetch('http://localhost:3000/contacts', {method: 'GET'});
  const contacts = await response.json();
  const userContact = contacts.filter(contacto => contacto.user === user.username);
  userContact.forEach(contacto => {
    const li = document.createElement('li');
    li.innerHTML = `
     <li class="contact" id="${contacto.id}">
      <button class="delete-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="delete-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>        
      </button>
      <p>${contacto.contacto}</p>
      <p>${contacto.numero}</p>
      <button class="edit-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="edit-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
      </button>
      </li>
    `;
    list.append(li)
  });
}


list.addEventListener('click', async e => {
  const deleteBtn = e.target.closest('.delete-btn');
  const editBtn = e.target.closest('.edit-btn');
  //Eliminar
  if (deleteBtn) {
    const id =e.target.closest('.delete-btn').parentElement.id ;
    console.log(e.target);
    await fetch(`http://localhost:3000/contacts/${id}`, {method: 'DELETE',});
    e.target.closest('.delete-btn').parentElement.remove();
  } else 
   // Editar
  if (editBtn) {
    const li = editBtn.parentElement;
    const nameEdit = li.children[1];
    const numberEdit = li.children[2];
    const nombreValido = NAME_REGEX.test(nameEdit.innerHTML);
    const telefonoValido = NUMBER_REGEX.test(numberEdit.innerHTML);

    if (editBtn){
      nameEdit.classList.add('border-edit');
      numberEdit.classList.add('border-edit');
    }
    if (!nombreValido && !telefonoValido) {
      nameEdit.classList.add('edit-error');
      numberEdit.classList.add('edit-error');
      alert('Nombre y Numero de Telefono incorrectos, por favor usar un formato valido');
      return;
    }  else if (!nombreValido && telefonoValido){
      nameEdit.classList.add('edit-error');
      numberEdit.classList.remove('edit-error');
      alert('Nombre incorrecto, agregar Nombre y Apellido usando mayuscula solo en la primera letra de cada uno');
      return;
    } else if (!telefonoValido && nombreValido){
      nameEdit.classList.remove('edit-error');
      numberEdit.classList.add('edit-error');
      alert('Numero de Telefono incorrecto, por favor usar un numero telefonico Venezolano');
      return;
    }
      // Aqui es cuando se empieza a editar
    if (li.classList.contains('editando')) {
      console.log(nombreValido, telefonoValido);
      if (!nombreValido || !telefonoValido){
        return;
      }
      li.classList.remove('editando');
      // esto es un arreglo para poder alamacenar los cambios aqui
      const editedContact = {
        contacto: nameEdit.innerHTML,
        numero: numberEdit.innerHTML
      };
      // aqui se guarda en el localHost
      const id =e.target.closest('.edit-btn').parentElement.id ;
      const responseJSON = await fetch(`http://localhost:3000/contacts/${id}`, {method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editedContact),
     });
     await responseJSON.json();

      nameEdit.removeAttribute('contenteditable');
      numberEdit.removeAttribute('contenteditable');  
      editBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="edit-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
      </svg>
      `;
      nameEdit.classList.remove('border-edit', 'edit-error' );
      numberEdit.classList.remove('border-edit', 'edit-error');
    } else {
      li.classList.add('editando');
      nameEdit.setAttribute('contenteditable', true);
      numberEdit.setAttribute('contenteditable', true);
      editBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="edit-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
      </svg>
      `;
    }
  }
  
});

getContacts ();
renderCounters();
console.log(list);


