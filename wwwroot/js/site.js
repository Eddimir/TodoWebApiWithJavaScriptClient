
//Select element
const clear = document.querySelector(".clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");

//classes names
const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH = "lineThrough";


clear.addEventListener("click", function () {
  //localStorage.clear();
  location.reload();
});
//Show date
const options = {weekday:"long", month:"short",day:"numeric"};
const today = new Date();

dateElement.innerHTML = today.toLocaleDateString("en-US", options);

let todos = [];
const uri = 'api/TodoItems';


function getItems() {
  list.innerHTML = "";

  fetch(uri)
    .then(response => response.json())
    .then(data => _displayItems(data))
    .catch(error => console.error('Unable to get items.', error));
}

//add item to the list user the enter key
document.addEventListener("keyup", function (event) {
  if (event.keyCode == 13) {
    //const toDo = input;
    if (input.value) {
      addItem();
    }
  }  
});

function addItem() {
  const inputvalue = input.value;
  const item = {isComplete: false,name: inputvalue.trim()};

  fetch(uri, {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'},
    body: JSON.stringify(item)}).then(response => response.json())
    .then(() => {
      addToDo(inputvalue, 0, false);
      input.value = '';
      getItems();
    }).catch(error => console.error('Unable to add item.', error));
}

function _displayItems(data) {
  _displayCount(data.length);

  data.forEach(item => {
     addToDo(item.name, item.id, item.isComplete);
  });

  todos = data;
}

//add Todo funcion
function addToDo(name,id, done) {
  
  const DONE = done ? CHECK : UNCHECK;
  const LINE = done ? LINE_THROUGH : "";

  const text = ` <li class="item">
                   <i class="fa ${DONE} co" job="complete" id="${id}" done="${done}" nameitem="${name}"></i>
                   <p class="text ${LINE}">${name}</p>
                   <i class ="fa fa-trash-o de" job="delete" id="${id}"></i>
                </li>`;
  
  const position = "beforeend";
  list.insertAdjacentHTML(position, text);
}

//target the items created dinamicaly
list.addEventListener("click", function (event) {
  const element = event.target;
  const elementJob = element.attributes.job.value;

  if (elementJob == "complete") {
    completeToDo(element);    
  }
  else if (elementJob == "delete") {
    removeToDo(element);    
  }
});

//complete to do
function completeToDo(element) {
  element.classList.toggle(CHECK);
  element.classList.toggle(UNCHECK);
  element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

  updateItem(element);
}

//remove todo
function removeToDo(element) {
  element.parentNode.parentNode.removeChild(element.parentNode);

   fetch(`${uri}/${element.id}`, {
    method: 'DELETE'
  })
  .then(() => getItems())
  .catch(error => console.error('Unable to delete item.', error));
}

function updateItem(element) {
  const items = element.attributes;
  const itemId = items.id.value;
  const item = {
    id: parseInt(itemId, 10),
    isComplete: items.done.value == "false",
    name: items.nameitem.value.trim()
  };


  fetch(`${uri}/${itemId}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  }).then(() => getItems())
  .catch(error => console.error('Unable to update item.', error));
}

function _displayCount(itemCount) {
  const name = (itemCount === 1) ? 'to-do' : 'to-dos';
  document.getElementById('counter').innerText = `${itemCount} ${name}`;
}
//addToDo("Drink Cofee",1, false, true);
/*



//addToDo("Drink Cofee2");

const input = document.getElementById("input");
document.addEventListener("keyup", function (event) {
  if (event.keyCode = 13) {
    const toDo = input.value;
    if (toDo) {
      addToDo(toDo);
    }    
    input.value = "";
  }  
});*/







/*Js API .net core */
/*const uri = 'api/TodoItems';
let todos = [];

function getItems() {
  fetch(uri)
    .then(response => response.json())
    .then(data => _displayItems(data))
    .catch(error => console.error('Unable to get items.', error));
}

function addItem() {
  const addNameTextbox = document.getElementById('add-name');

  const item = {
    isComplete: false,
    name: addNameTextbox.value.trim()
  };

  fetch(uri, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  })
    .then(response => response.json())
    .then(() => {
      getItems();
      addNameTextbox.value = '';
    })
    .catch(error => console.error('Unable to add item.', error));
}

function deleteItem(id) {
  fetch(`${uri}/${id}`, {
    method: 'DELETE'
  })
  .then(() => getItems())
  .catch(error => console.error('Unable to delete item.', error));
}

function displayEditForm(id) {
  const item = todos.find(item => item.id === id);
  
  document.getElementById('edit-name').value = item.name;
  document.getElementById('edit-id').value = item.id;
  document.getElementById('edit-isComplete').checked = item.isComplete;
  document.getElementById('editForm').style.display = 'block';
}

function updateItem() {
  const itemId = document.getElementById('edit-id').value;
  const item = {
    id: parseInt(itemId, 10),
    isComplete: document.getElementById('edit-isComplete').checked,
    name: document.getElementById('edit-name').value.trim()
  };

  fetch(`${uri}/${itemId}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  })
  .then(() => getItems())
  .catch(error => console.error('Unable to update item.', error));

  closeInput();

  return false;
}

function closeInput() {
  document.getElementById('editForm').style.display = 'none';
}

function _displayCount(itemCount) {
  const name = (itemCount === 1) ? 'to-do' : 'to-dos';

  document.getElementById('counter').innerText = `${itemCount} ${name}`;
}

function _displayItems(data) {
  const tBody = document.getElementById('todos');
  tBody.innerHTML = '';

  _displayCount(data.length);

  const button = document.createElement('button');

  data.forEach(item => {
    let isCompleteCheckbox = document.createElement('input');
    isCompleteCheckbox.type = 'checkbox';
    isCompleteCheckbox.disabled = true;
    isCompleteCheckbox.checked = item.isComplete;

    let editButton = button.cloneNode(false);
    editButton.innerText = 'Edit';
    editButton.setAttribute('onclick', `displayEditForm(${item.id})`);

    let deleteButton = button.cloneNode(false);
    deleteButton.innerText = 'Delete';
    deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);

    let tr = tBody.insertRow();
    
    let td1 = tr.insertCell(0);
    td1.appendChild(isCompleteCheckbox);

    let td2 = tr.insertCell(1);
    let textNode = document.createTextNode(item.name);
    td2.appendChild(textNode);

    let td3 = tr.insertCell(2);
    td3.appendChild(editButton);

    let td4 = tr.insertCell(3);
    td4.appendChild(deleteButton);
  });

  todos = data;
}*/