//Local Storage
const getLocalStorage = () =>
  JSON.parse(localStorage.getItem("db_category")) ?? [];
const setLocalStorage = (db_category) =>
  localStorage.setItem("db_category", JSON.stringify(db_category));

//CRUD
const readCategory = () => getLocalStorage();

const createCategory = (category) => {
  const db_category = getLocalStorage();
  db_category.push(category);
  setLocalStorage(db_category);
};

const updateCategory = (index, category) => {
  const db_category = readCategory();
  db_category[index] = category;
  setLocalStorage(db_category);
  index = "new";
};

const deleteCategory = (index) => {
  const db_category = readCategory();
  db_category.splice(index, 1);
  setLocalStorage(db_category);
};

//HTML
const clearFields = () => {
  const fields = document.querySelectorAll(".formInput");
  fields.forEach((field) => (field.value = ""));
};

const isValidFields = () => {
  return document.getElementById("catForm").reportValidity();
};

const saveCategory = () => {
  if (isValidFields()) {
    const category = {
      id: Math.random().toString(24).slice(8),
      name: document.getElementById("catName").value,
      tax: document.getElementById("catTax").value,
    };
    const index = document.getElementById("catName").dataset.index;

    if (index == "new") {
      validateInput(category);
      createCategory(category);
      clearFields();
    } else {
      validateInput(category);
      updateCategory(index, category);
      clearFields();
      document.getElementById("catName").dataset.index = "new";
    }

    updateTable();
  }
};

const validateInput = (category) => {
  let inputs = Object.values(category);
  const spcChars = `/()<>{}[]`
  for (let input of inputs) {
    const result = spcChars.split('').some(char => {
        if (input.includes(char)) {
            alert("this is not a valid input");
            throw new Error("PEPE VOCÊ NÃO É BEM VINDO");
            stop;
        } 
    })

  }
};
const createRow = (category, index) => {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td id="content">${index + 1} - ${category.id}</td>
    <td id="content">${category.name}</td>
    <td id="content">${category.tax} %</td>
    <td> 
        <button class="secBtn" id='edit-${index}'>Edit</button>
        <button class="mainBtn" id='delete-${index}' >Delete</button>
    </td>
    
    

    `;
  document
    .querySelector("#categoryTable>tbody")
    .appendChild(newRow)
    .classList.add("othRow");
};

const clearTable = () => {
  const rows = document.querySelectorAll("#categoryTable>tbody tr");
  rows.forEach((row) => row.parentNode.removeChild(row));
};

const updateTable = () => {
  const db_category = readCategory();
  clearTable();
  db_category.forEach(createRow);
};

const fillFields = (category) => {
  document.getElementById("catName").value = category.name;
  document.getElementById("catTax").value = category.tax;
  document.getElementById("catName").dataset.index = category.index;
};

const editCategory = (index) => {
  const category = readCategory()[index];
  category.index = index;
  fillFields(category);
};

const editDelete = (event) => {
  if (event.target.type == "submit") {
    const [action, index] = event.target.id.split("-");
    console.log(action, index);
    if (action == "edit") {
      editCategory(index);
    } else {
      const category = readCategory()[index];
      const response = confirm(
        `Are you really sure you want to delete ${category.name} from the categories table?`
      );
      if (response) {
        deleteCategory(index);
        updateTable();
      }
    }
  }
};

updateTable();

//Events
document.getElementById("saveCat").addEventListener("click", saveCategory);

document.querySelector("#categoryTable").addEventListener("click", editDelete);
