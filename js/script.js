const addressForm = document.querySelector("#address-form");
const cepInput = document.querySelector("#cep");
const addressInput = document.querySelector("#address");
const cityInput = document.querySelector("#city");
const neighborhoodInput = document.querySelector("#neighborhood");
const regionInput = document.querySelector("#region");
const formInputs = document.querySelectorAll("[data-input]");

const closeButton = document.querySelector("#close-message");

const  fadeElement= document.querySelector('#fade');

// Validate CEP Input
cepInput.addEventListener("keypress", (e) => {
  const onlyNumbers = /[0-9]|\./;
  const key = String.fromCharCode(e.keyCode);



  // allow only numbers
  if (!onlyNumbers.test(key)) {
    e.preventDefault();
    return;
  }
});

// Evento to get address
cepInput.addEventListener("keyup", (e) => {
  const inputValue = e.target.value;

  //   Check if we have correct length
  if (inputValue.length === 8) {
    getAddress(inputValue);
  }
});

// Get customer address from API 
const getAddress = async (cep) => {
    toggleLoader();

    cepInput.blur();

    const apiUrl = `https://viacep.com.br/ws/${cep}/json/`;

    const response = await fetch(apiUrl);

    const data = await response.json();

   // show erro and reset form
   if(data.erro === true) {
    if(!addressInput.hasAttribute("disabled")) {
       toggleDisabled();
    } 

      addressForm.reset()
      toggleLoader()
      toggleMessage("CEP invalido, tente novamente!.")
      return;
   }

   if(addressInput.value === "") {
     toggleDisabled();
   }

   addressInput.value = data.logradouro;
   cityInput.value = data.localidade;
   neighborhoodInput.value = data.bairro;
   regionInput.value = data.uf;

   toggleLoader();
};

// Add or remove disabled atribute
const toggleDisabled = () => {

  if(regionInput.hasAttribute("disabled")) {
        formInputs.forEach((input) => {
          input.removeAttribute("disabled");
        }); 
  }
  else {
    formInputs.forEach((input) => {
      input.setAttribute("disabled", "disabled");
    });
  } 
}

// show or hide loader
const toggleLoader = () => {
    const loaderElement = document.querySelector('#loader');

    fadeElement.classList.toggle("hide");
    loaderElement.classList.toggle('hide');
};

//show or hide message
const toggleMessage = (msg) => {
  
  const messageElement = document.querySelector('#message');
  const messageElementText = document.querySelector('#message p');

  messageElementText.innerHTML = msg;

  fadeElement.classList.toggle('hide');
  messageElement.classList.toggle('hide');
};

// close message modal
closeButton.addEventListener("click", () => toggleMessage());

// save addres 
addressForm.addEventListener("submit", (e) => {
  e.preventDefault()

  toggleLoader()

  setTimeout(() => {

    toggleLoader();

    toggleMessage("Endereço salvo com sucesso!");

    addressForm.reset();

    toggleDisabled();

  }, 1500);
});