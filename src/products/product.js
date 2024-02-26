const getLocalStorage = () =>
  JSON.parse(localStorage.getItem("db_product")) ?? [];
const getCategories = () =>
  JSON.parse(localStorage.getItem("db_category")) ?? [];
const setLocalStorage = (db_product) =>
  localStorage.setItem("db_product", JSON.stringify(db_product));


const readCategory = () => getCategories();
const readProduct = () => getLocalStorage();

const select = document.querySelector("select");

const createProduct = (product) => {
  const db_product = getLocalStorage();
  db_product.push(product);
  setLocalStorage(db_product);
};

const updateProduct = (index, product) => {
  const db_product = readProduct();
  db_product[index] = product;
  setLocalStorage(db_product);
};

const deleteProduct = (index) => {
  const db_product = readProduct();
  db_product.splice(index, 1);
  setLocalStorage(db_product);
};

const clearFields = () => {
  const fields = document.querySelectorAll(".formInput");
  fields.forEach((field) => (field.value = ""));
};

const categories = readCategory();

for (const i of categories) {
  const option = document.createElement("option");
  option.textContent = i.name;
  option.value = i.id;
  select.appendChild(option);
}

const isValidFields = () => {
  return document.getElementById("prodForm").reportValidity();
};
const updateTable = () => {
  const db_product = readProduct();
  db_product.forEach(createRow);
};

const validateInput = (product) => {
    let inputs = Object.values(product);
    const spcChars = `/()<>{}[]`
    for (let input of inputs) {
      const result = spcChars.split('').some(char => {
          if (JSON.stringify(input).includes(char)) {
            alert("this is not a valid input");
            throw new Error("PEPE VOCÊ NÃO É BEM VINDO");
            stop;
          } 
      })
  
    }
  };

const saveProduct = () => {
  if (isValidFields()) {
    let listCategories = readCategory();

    let category = document.querySelector("select").value;
    let selectedCategory = listCategories.find((obj) => obj.id == category);
    let categoryName = selectedCategory.name;
    let id = Math.random().toString(24).slice(8);
    let name = document.getElementById("prodName").value;
    let amount = document.getElementById("prodAmnt").value;
    let uniPrice = document.getElementById("uniPrice").value;
    let taxPercent = selectedCategory.tax / 100;
    let taxedPrice = parseFloat(uniPrice) + parseFloat(uniPrice * taxPercent);
    let taxPrice = parseFloat(taxedPrice) - parseFloat(uniPrice);

    const product = {
      id: id,
      name: name,
      amount: amount,
      uniPrice: uniPrice,
      category: categoryName,
      taxPercent: taxPercent,
      taxPrice: taxPrice,
      taxedPrice: taxedPrice,
    };
    const index = document.getElementById("prodName").dataset.index;
    if (index == "new") {
      validateInput(product);
      createProduct(product);
      clearFields();
    } else {
      validateInput(product);
      updateProduct(index, product);
      clearFields();
      document.getElementById("prodName").dataset.index = "new";
    }

    updateTable();
  }
};


const createRow = (product, index) => {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td id="content">${index + 1} - ${product.id}</td>
    <td id="content">${product.name}</td>
    <td id="content">${product.amount}</td>
    <!-- que coisa feia... -->
    <td id="content">$${parseFloat(product.uniPrice).toFixed(2)}</td>
    <td id="content">${product.category}</td>
    <td id="content">$${product.taxedPrice.toFixed(2)}</td>
    <td> 
        <button class="secBtn" id='edit-${index}'>Edit</button>
        <button class="mainBtn" id='delete-${index}' >Delete</button>
    </td>
    `;
  document
    .querySelector("#productTable>tbody")
    .appendChild(newRow)
    .classList.add("othRow");
};

const clearTable = () => {
  const rows = document.querySelectorAll("#productTable>tbody tr");
  rows.forEach((row) => row.parentNode.removeChild(row));
};


const fillFields = (product) => {
  let listCategories = readCategory();
  let selectedCategory = listCategories.find((obj) => obj.name == product.category);
  let categoryId = selectedCategory.index;
  document.getElementById("prodName").value = product.name;
  document.getElementById("prodAmnt").value = product.amount;
  document.getElementById("uniPrice").value = product.uniPrice;
  document.getElementById("prodName").dataset.index = product.index;
  document.getElementById("prodCat").value = categoryId;
};

const editProduct = (index) => {
  const product = readProduct()[index];
  product.index = index;
  fillFields(product);
};

const editDelete = (event) => {
  if (event.target.type == "submit") {
    const [action, index] = event.target.id.split("-");

    if (action == "edit") {
      editProduct(index);
    } else {
      const product = readProduct()[index];
      const response = confirm(
        `Are you really sure you want to delete ${product.name} from the products table?`
      );
      if (response) {
        deleteProduct(index);
        updateTable();
      }
    }
  }
};

updateTable();

document.getElementById("saveProd").addEventListener("click", saveProduct);


document.querySelector("#productTable").addEventListener("click", editDelete);
