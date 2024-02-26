"use strict";
const getLocalStorage = () =>
  JSON.parse(localStorage.getItem("db_purchase")) ?? [];
const readPurchase = () => getLocalStorage();

const openModal = () =>
  document.getElementById("modal").classList.add("active");

const closeModal = () =>
  document.getElementById("modal").classList.remove("active");

const createRow = (purchase, index) => {
  const newRow = document.createElement("tr");
  let listItem = purchase.info;
  let taxSum = 0;
  let totalSum = 0;
  for (const item of listItem) {
    taxSum = parseFloat(taxSum) + parseFloat(item.taxPrice);
    totalSum = parseFloat(totalSum) + parseFloat(item.total);
  }
  newRow.innerHTML = `
    <td id="content">${index + 1}) ${purchase.id + 1}</td>
    <td id="content">$${taxSum.toFixed(2)}</td>
    <td id="content">$${totalSum.toFixed(2)}</td>
    <td> 
    <button class="mainBtn"  id='openModal-${JSON.stringify(
      purchase.id
    )}'>View</button>
    </td>
    `;
  document
    .querySelector("#purchaseTable>tbody")
    .appendChild(newRow)
    .classList.add("othRow");
};

const clearTable = () => {
  const rows = document.querySelectorAll("#PurchasesTable>tbody tr");
  rows.forEach((row) => row.parentNode.removeChild(row));
};

const updateTable = () => {
  const db_purchase = readPurchase();
  clearTable();
  db_purchase.forEach(createRow);
};

const openPurchase = (event) => {
  const [action, index] = event.target.id.split("-");
  let listPurchases = readPurchase();

  if (event.target.type == "submit") {
    for (const purchase of listPurchases) {
      if (JSON.stringify(purchase.id) == index) {
        createModal(purchase);
      }
    }
  }
};

const createModal = (purchase) => {
  const modalInfo = document.createElement("tbody");
  purchase.info.forEach((element) => {
    let taxPrice = parseFloat(element.price) * parseFloat(element.taxPercent);
    let taxedPrice = parseFloat(element.price) + parseFloat(taxPrice);
    let total = parseFloat(taxedPrice * element.amount);
    let taxTotal = total - parseFloat(element.price * element.amount);

    modalInfo.innerHTML += `
        <tr class="othRow">
            <td>${element.productName}</td>
            <td>${parseFloat(element.price).toFixed(2)}</td>
            <td>${taxedPrice.toFixed(2)}</td>
            <td>${element.amount}</td>
            <td>${total.toFixed(2)}</td>
            <td>${taxTotal.toFixed(2)}</td>
            
        </tr>
        `;
  });

  document
    .querySelector("#PurchasesTable")
    .appendChild(modalInfo)
    .classList.add("othRow");
};

document
  .querySelector("#purchaseTable")
  .addEventListener("click", openPurchase);

document.querySelector("#purchaseTable").addEventListener("click", openModal);

document.querySelector("#modal").addEventListener("click", closeModal);
document.querySelector("#modal").addEventListener("click", clearTable);

updateTable();
