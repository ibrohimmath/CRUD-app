const formCreate = document.querySelector(".form__create").querySelector("form");
const nameCreate = document.querySelector("input[name='name__create']");
const emailCreate = document.querySelector("input[name='email__create']");

const formUpdate = document.querySelector(".form__update").querySelector("form");
const nameUpdate = document.querySelector("input[name='name__update']");
const emailUpdate = document.querySelector("input[name='email__update']");


const tableBody = document.querySelector("tbody");
const buttonAdd = document.querySelector(".add");

// Delete key(users) from localStorage (for refreshing localStorage)
// localStorage.removeItem("users");

let users = [];

const getUsers = function() {
  users = JSON.parse(localStorage.getItem("users")) || [];
}

const setUsers = function() {
  localStorage.setItem("users", JSON.stringify(users));
}

// Get users from localStorage
getUsers();

// Add New Data to table, if ind == -1 then add new row data to database too.
const addNewRowData = function(name, email, ind = -1) {
  if (ind == -1) {
    users.push({name, email});
    // After adding new row data, update local Storage
    setUsers();

    ind = users.length - 1;
  }
  const rowDataNew = `
  <tr data-ind="${ind}">
    <td>${name}</td>
    <td>${email}</td>
    <td>
      <button class="update">Update</button>
      <button class="delete">Delete</button>
    </td>
  </tr>
  `;
  tableBody.insertAdjacentHTML("beforeend", rowDataNew);
};

// Visualizing all users from datas 
const showTable = function() {
  if (!users) return;
  users.forEach(({name, email}, ind) => addNewRowData(name, email, ind));
};
showTable();

// Checking whether name is valid
const checkName = function(name) {
  return name !== "" || (name.trim()) !== "";
}

// Checking whether email is valid
const checkEmail = function(email) {
  if (!email || !email.includes("@") || !email.includes(".")) return false;
  const atInd = email.indexOf("@");
  const dotInd = email.indexOf(".");
  return atInd !== 0 &&  atInd + 1 <= dotInd && 
  atInd !== email.length && dotInd !== email.length;
}

// Opening create form when clicking add
buttonAdd.addEventListener("click", function(e) {
  e.preventDefault();
  if (!buttonAdd.classList.contains("hidden"))
    buttonAdd.classList.add("hidden");
  if (formCreate.parentElement.classList.contains("hidden"))
    formCreate.parentElement.classList.remove("hidden");
});

// Creating new user
formCreate.addEventListener("submit", function(e) {
  e.preventDefault();

  const nameValue = nameCreate.value;
  const emailValue = emailCreate.value;

  if (!checkName(nameValue) || !checkEmail(emailValue)) return;

  // After creating new user, update showing function
  addNewRowData(nameValue, emailValue, -1);

  nameCreate.value = "";
  emailCreate.value = "";

  // Close Add form and Open Add button
  if (buttonAdd.classList.contains("hidden"))
    buttonAdd.classList.remove("hidden");
  if (!formCreate.parentElement.classList.contains("hidden"))
    formCreate.parentElement.classList.add("hidden");
});


let indUpdating = -1;
// Using event delegation to catch update and delete buttons
tableBody.addEventListener("click", function(e) {
  const el = e.target;
  indUpdating = el.closest("tr").dataset.ind;
  const rowObj = users[indUpdating];

  // Update row data
  if (el.classList.contains("update")) {
    if (formUpdate.parentElement.classList.contains("hidden")) {
      formUpdate.parentElement.classList.remove("hidden");
      buttonAdd.classList.add("hidden");
      nameUpdate.value = rowObj.name;
      emailUpdate.value = rowObj.email;
    }
  }

  // Delete row data
  if (el.classList.contains("delete")) {
    if (!formUpdate.parentElement.classList.contains("hidden")) {
      // console.log("Delete should not work when update form is open");
      return;
    }
    deleteRowData(indUpdating);
    indUpdating = -1;
  }

});

// Updating existing user data
formUpdate.addEventListener("submit", function(e) {
  e.preventDefault();

  const nameValue = nameUpdate.value;
  const emailValue = emailUpdate.value;

  if (!checkName(nameValue) || !checkEmail(emailValue)) return;
  users[indUpdating] = {name: nameValue, email: emailValue};
  const oldRowData = tableBody.querySelector(`tr[data-ind='${indUpdating}']`);
  const newRowData = `
  <tr data-ind="${indUpdating}">
    <td>${nameValue}</td>
    <td>${emailValue}</td>
    <td>
      <button class="update">Update</button>
      <button class="delete">Delete</button>
    </td>
  </tr>
  `;
  // Replacing new data with older data
  oldRowData.outerHTML = newRowData;

  // After changing specific row data, update localStorage
  setUsers();

  indUpdating = -1;
  if (!formUpdate.parentElement.classList.contains("hidden")) {
    formUpdate.parentElement.classList.add("hidden");
    buttonAdd.classList.remove("hidden");
    nameUpdate.value = "";
    emailUpdate.value = "";
  }
});

// Delete proper given ind row data
const deleteRowData = function(indDeleting) {
  const currRowData = tableBody.querySelector(`tr[data-ind='${indDeleting}']`);
  currRowData.remove();
  users.splice(indDeleting, 1);

  // After deleting specific row data, update localStorage
  setUsers();
};