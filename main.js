const getLocalStorage = () => JSON.parse(localStorage.getItem("db_cart")) ?? [];
const getPurchase = () => JSON.parse(localStorage.getItem("db_purchase")) ?? [];
const getProducts = () => JSON.parse(localStorage.getItem("db_product")) ?? [];

const setLocalStorage = (db_cart) =>
  localStorage.setItem("db_cart", JSON.stringify(db_cart));

const setProdStorage = (db_product) =>
  localStorage.setItem("db_product", JSON.stringify(db_product));

const setPurchase = (db_purchase) =>
  localStorage.setItem("db_purchase", JSON.stringify(db_purchase));

const readProduct = () => getProducts();
const readCart = () => getLocalStorage();

const select = document.querySelector("select");

const createCart = (cart) => {
  const db_cart = getLocalStorage();
  db_cart.push(cart);
  setLocalStorage(db_cart);
};

const deleteProduct = (index) => {
  const db_product = readProduct();
  db_product.splice(index, 1);
  setLocalStorage(db_product);
};

const createProduct = (product) => {
  const db_product = getProducts();
  db_product.push(product);
  setProdStorage(db_product);
};

const createPurchase = (purchase) => {
  const db_purchase = getPurchase();
  db_purchase.push(purchase);
  setPurchase(db_purchase);
};

const updateCart = (index, cart) => {
  const db_cart = readCart();
  db_cart[index] = cart;
  setLocalStorage(db_cart);
};

const deleteCart = (index) => {
  const db_cart = readCart();
  db_cart.splice(index, 1);
  setLocalStorage(db_cart);
};

const clearFields = () => {
  const fields = document.querySelectorAll(".formInput");
  fields.forEach((field) => (field.value = ""));
};

const products = readProduct();

for (const i of products) {
  const option = document.createElement("option");
  option.textContent = i.name;
  option.value = i.id;
  select.appendChild(option);
}

const isValidFields = () => {
  return document.getElementById("cartForm").reportValidity()
};

const calcTaxSum = () => {
  let cart = readCart();
  let taxSum = 0;
  let totalSum = 0;
  for (const item of cart) {
    taxSum = parseFloat(taxSum) + parseFloat(item.taxPrice);
    totalSum = parseFloat(totalSum) + parseFloat(item.total);
  }

  const priceDisplay = document.createElement("div");
  priceDisplay.innerHTML = `
    <div class="priceWrapper">
        <p class="tLabel">Tax:</p>
        <p class="tFinish">$${taxSum.toFixed(2)}</p>
    </div>
    <div class="priceWrapper">
        <p class="tLabel">Total:</p>
        <p class="tFinish">$${totalSum.toFixed(2)}</p>
    </div>
    `;
  document
    .querySelector(".fRight>div")
    .appendChild(priceDisplay)
    .classList.add("w-30");
};

const calcInput = () => {
  let listProducts = readProduct();
  let product = document.querySelector("select").value;
  let amount = document.getElementById("inputAmnt").value;
  let selectedProduct = listProducts.find((obj) => obj.id == product);
  let price = selectedProduct.uniPrice;
  let taxPercent = selectedProduct.taxPercent;
  let taxedPrice = parseFloat(price) + parseFloat(price * taxPercent);
  let taxPrice = taxedPrice - price;

  document.getElementById("inputTax").value = (taxPrice * amount).toFixed(2);
  document.getElementById("inputUnit").value = (taxedPrice * amount).toFixed(2);
};
const saveCart = () => {
  if (isValidFields()) {
    let listProducts = readProduct();
    let product = document.querySelector("select").value;
    let selectedProduct = listProducts.find((obj) => obj.id === product);
    let CartAmnt = selectedProduct.amount;
    let amount = document.getElementById("inputAmnt").value;

    if (amount <= CartAmnt) {
      let id = Math.random().toString(24).slice(8);
      let productName = selectedProduct.name;
      let price = selectedProduct.uniPrice;
      let taxPercent = selectedProduct.taxPercent;
      let taxedPrice = parseFloat(price) + parseFloat(price * taxPercent);
      let taxPrice = (parseFloat(taxedPrice) - parseFloat(price)) * amount;
      let total = parseFloat(taxedPrice) * parseFloat(amount);
      const cart = {
        id: id,
        productName,
        price,
        amount,
        taxPercent,
        taxPrice,
        total,
      };
      const index = document.getElementById("selectProd").dataset.index;

      if (index == "new") {
        createCart(cart);
        clearFields();
      } else {
        updateCart(index, cart);
        clearFields();
        document.getElementById("selectProd").dataset.index = "new";
      }
    } else {
      alert("Selected amount of " + selectedProduct.name + " insufficient in stock")
    }

    updateTable();
  }
};

const finishPurchase = () => {
  let cart = readCart();
  let length = cart.length;

  if (length != 0) {
    savePurchase(cart);
  } else {
    alert("There are no products on the cart...");
  }
};

const savePurchase = (cart) => {
  let id = Math.random().toString(24).slice(8);
  info = [];
  for (const item of cart) {

    let listProducts = readProduct();
    let productName = item.productName;
    let CartAmnt = item.amount;
    let selectedProduct = listProducts.find((obj) => obj.name == productName);
    let StockAmnt = selectedProduct.amount
    if (CartAmnt <= StockAmnt ) {
      selectedProduct.amount -= CartAmnt;
      setProdStorage(listProducts);
      info.push(item);
      deleteCart(item.index)
    } else {
      alert("Selected amount of " + selectedProduct.name + " insufficient in stock")
    }
    
  }

  const purchase = {
    id,
    info,
  };
  createPurchase(purchase);
};

const createRow = (cart, index) => {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td id="content">${cart.productName}</td>
    <td id="content">${parseFloat(cart.price).toFixed(2)}</td>
    <td id="content">${cart.amount}</td>
    <td id="content">$${parseFloat(cart.total).toFixed(2)}</td>
    <td> 
        <button class="secBtn" id='edit-${index}'>Edit</button>
        <button class="mainBtn" id='delete-${index}'>Delete</button>
    </td>
    `;
  document
    .querySelector("#cartTable>tbody")
    .appendChild(newRow)
    .classList.add("othRow");
};

const clearTable = () => {
  const rows = document.querySelectorAll("#cartTable>tbody tr");
  rows.forEach((row) => row.parentNode.removeChild(row));
};

const deleteItems = () => {
  const db_cart = readCart();
  for (i in db_cart) {
    deleteCart(i.index);
  }
};

const clearDisplay = () => {
  const priceDisplay = document.querySelectorAll(".fRight>div div");
  priceDisplay.forEach((display) => display.parentNode.removeChild(display));
};

const updateTable = () => {
  const db_cart = readCart();
  clearTable();
  clearDisplay();
  db_cart.forEach(createRow);
  calcTaxSum();
};

const fillFields = (cart) => {
  let listProducts = readProduct();
  let selectedProduct = listProducts.find(
    (obj) => obj.name == cart.productName
  );
  let product = document.querySelector("select").value;
  let productID = selectedProduct.index;
  document.getElementById("inputAmnt").value = cart.amount;
  document.getElementById("selectProd").dataset.index = cart.index;
  document.getElementById("selectProd").value = productID;
};

const editCart = (index) => {
  const cart = readCart()[index];
  cart.index = index;
  fillFields(cart);
};

const editDelete = (event) => {
  if (event.target.type == "submit") {
    const [action, index] = event.target.id.split("-");

    if (action == "edit") {
      editCart(index);
    } else {
      const cart = readCart()[index];
      const response = confirm(
        `Are you really sure you want to delete ${cart.productName} x ${cart.amount} from your cart?`
      );
      if (response) {
        deleteCart(index);
        updateTable();
      }
    }
  }
};

updateTable();

document.getElementById("saveCart").addEventListener("click", saveCart);

document
  .getElementById("cancelPurchase")
  .addEventListener("click", deleteItems);

document
  .getElementById("finishPurchase")
  .addEventListener("click", finishPurchase);

document.querySelector("#cartTable").addEventListener("click", editDelete);

document.querySelector("select").addEventListener("change", calcInput);
document.getElementById("inputAmnt").addEventListener("change", calcInput);
