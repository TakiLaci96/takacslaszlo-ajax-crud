// Sajnos az update-delete párost nem sikerült egymás mellé helyeznem, gondolom ezért ilyen a design is.
// Esetleg a checkboxok még középrezártak lehetnének... :D 

import "./style.css";
const api_url = "https://retoolapi.dev/p0j7Ne/workers";

document.addEventListener("DOMContentLoaded", () => {
  const workerForm = document.getElementById("workerForm");
  const resetButton = document.getElementById("resetButton");
  workerForm.addEventListener("submit", handleFormSubmit);
  resetButton.addEventListener("click", resetForm);
  listWorkersTable();
});

//Sorok és hogy mit tartalmazzanak létrehozása
function createTableRow(person) {
  const tableRow = document.createElement("tr");
  const idTd = document.createElement("td");
  const nameTd = document.createElement("td");
  const emailTd = document.createElement("td");
  const phoneTd = document.createElement("td");
  const locationTd = document.createElement("td");
  const jobTd = document.createElement("td");
  const activeTd = document.createElement("td");

  const actionsTd = document.createElement("td");
  const updateButton = document.createElement("button");
  const deleteButton = document.createElement("button");
  updateButton.textContent = "Update";
  deleteButton.textContent = "Delete";
  updateButton.classList.add("updateButton", "btn", "btn-success");
  deleteButton.classList.add("updateButton", "btn", "btn-danger");

  //Konténer létrehozása a gomboknak:
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");
  buttonContainer.appendChild(updateButton);
  buttonContainer.appendChild(deleteButton);
  
  updateButton.addEventListener("click", () => fillUpdateForm(person.id));
  deleteButton.addEventListener("click", () => deletePerson(person.id));
  actionsTd.appendChild(buttonContainer);

  idTd.textContent = person.id;
  nameTd.textContent = person.name;
  emailTd.textContent = person.email;
  locationTd.textContent = person.location;
  jobTd.textContent = person.job_title;
  phoneTd.textContent = person.phone_number;

  //Checkbox létrehozása és beállítása
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = person.active_worker;
  checkbox.addEventListener("click", (event) => event.preventDefault());
  activeTd.appendChild(checkbox);

  tableRow.appendChild(idTd);
  tableRow.appendChild(nameTd);
  tableRow.appendChild(emailTd);
  tableRow.appendChild(phoneTd);
  tableRow.appendChild(locationTd);
  tableRow.appendChild(jobTd)
  tableRow.appendChild(activeTd);
  tableRow.appendChild(actionsTd);

  return tableRow;
}


function handleFormSubmit(event) {
  event.preventDefault();
  const id = document.getElementById("id").value;
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone_number = document.getElementById('phone_number').value;
  const location = document.getElementById('location').value;
  const job_title = document.getElementById('job_title').value;
  const active_worker = document.getElementById('active_worker').checked;
  const person = {
    name: name,
    email: email,
    phone_number: phone_number,
    location: location,
    job_title: job_title,
    active_worker: active_worker,
  };
  if (id == "") {
    addPerson(person);
  } else {
    updatePerson(id, person);
  }
}

//Táblázat feltöltése, listázás
function listWorkersTable() {
  const workersTable = document.getElementById("workersTable");
  fetch(api_url).then(httpResponse => httpResponse.json())
    .then(responseBody => {
      workersTable.textContent = "";
      responseBody.forEach(person => {
        const tableRow = createTableRow(person);
        workersTable.appendChild(tableRow);
      });
    });
}

// Form alaphelyzetbe
function resetForm() {
  document.getElementById("id").value = "";
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone_number").value = "";
  document.getElementById("location").value = "";
  document.getElementById("job_title").value = "";
  document.getElementById("active_worker").checked = "false";
  document.getElementById("updateButton").classList.add('hiddenButton');
  document.getElementById("submitButton").classList.remove('hiddenButton');
};

// Emberek frissítése
async function updatePerson(id, person) {
  const response = await fetch(`${api_url}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(person),
    headers: {
      "Content-Type": "application/json"
    }
  });
  if (response.ok) {
    resetForm();
    listWorkersTable();
  }
}

// Emberek hozzáadása:
async function addPerson(person) {
  const response = await fetch(api_url, {
    method: "POST",
    body: JSON.stringify(person),
    headers: {
      "Content-Type": "application/json"
    }
  });
  if (response.ok) {
    resetForm();
    listWorkersTable();
  }
};

// Emberek törlése
async function deletePerson(id) {
  const response = await fetch(`${api_url}/${id}`, { method: "DELETE" });
  if (response.ok) {
    listWorkersTable();
  }
};

// Emberek módosítása
async function fillUpdateForm(id) {
  const response = await fetch(`${api_url}/${id}`);
  if (!response.ok) {
    alert("Something went wrong!");
    return;
  } 
  const person = await response.json();
  document.getElementById("id").value = person.id;
  document.getElementById("name").value = person.name;
  document.getElementById("email").value = person.email;
  document.getElementById("phone_number").value = person.phone_number;
  document.getElementById("location").value = person.location;
  document.getElementById("job_title").value = person.job_title;
  document.getElementById("active_worker").checked = person.active_worker;
  document.getElementById("submitButton").classList.add('hiddenButton');
  document.getElementById("updateButton").classList.remove('hiddenButton');
  scrollToForm();
};

// Form-hoz ugrik
function scrollToForm() {
  const formElement = document.getElementById("workerForm");
  formElement.scrollIntoView({ behavior: 'smooth' });
}