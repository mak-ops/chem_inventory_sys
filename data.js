const table = document.getElementById("chemical-table");
const tbody = table.querySelector("tbody");
const addBtn = document.querySelector(".add-btn");
const upBtn = document.querySelector(".up-btn");
const downBtn = document.querySelector(".down-btn");
const deleteBtn = document.querySelector(".delete-btn");
const refreshBtn = document.querySelector(".refresh-btn");
const saveBtn = document.querySelector(".save-btn");

let data = [
  {
    id: 1,
    chemicalName: "Ammonium Persulfate",
    vendor: "LG Chem",
    density: 3525.92,
    viscosity: 60.631,
    packaging: "Bag",
    packSize: 180.0,
    unit: "kg",
    quantity: 6495.18,
  },
  {
    id: 2,
    chemicalName: "Caustic Potash",
    vendor: "Formosa",
    density: 3172.15,
    viscosity: 48.22,
    packaging: "Bag",
    packSize: 100.0,
    unit: "kg",
    quantity: 8751.9,
  },
  {
    id: 3,
    chemicalName: "Dimethylaminopropylamino",
    vendor: "LG Chem",
    density: 8435.37,
    viscosity: 12.62,
    packaging: "Barrel",
    packSize: 75.88,
    unit: "l",
    quantity: 5964.61,
  },
];

function saveData() {
  const rows = tbody.querySelectorAll("tr");
  data = [];
  rows.forEach((row) => {
    const [
      id,
      chemicalName,
      vendor,
      density,
      viscosity,
      packaging,
      packSize,
      unit,
      quantity,
    ] = row.querySelectorAll("td");
    data.push({
      id: id.textContent,
      chemicalName: chemicalName.textContent,
      vendor: vendor.textContent,
      density: density.textContent,
      viscosity: viscosity.textContent,
      packaging: packaging.textContent,
      packSize: packSize.textContent,
      unit: unit.textContent,
      quantity: quantity.textContent,
    });
  });
  localStorage.setItem("myData", JSON.stringify(data));
  console.log("Data saved:", data);
  alert("Data saved successfully!");
}

function loadData() {
  const savedData = localStorage.getItem("myData");
  if (savedData) {
    data = JSON.parse(savedData);
  }
  generateRows();
}

function generateRows() {
  tbody.innerHTML = "";
  data.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td contenteditable="true">${row.id}</td>
      <td contenteditable="true">${row.chemicalName}</td>
      <td contenteditable="true">${row.vendor}</td>
      <td contenteditable="true">${row.density}</td>
      <td contenteditable="true">${row.viscosity}</td>
      <td contenteditable="true">${row.packaging}</td>
      <td contenteditable="true">${row.packSize}</td>
      <td contenteditable="true">${row.unit}</td>
      <td contenteditable="true">${row.quantity}</td>
    `;
    tbody.appendChild(tr);
  });
}

function sortData(column, order) {
  data.sort((a, b) => {
    if (order === "asc") {
      return a[column] > b[column] ? 1 : -1;
    } else {
      return a[column] < b[column] ? 1 : -1;
    }
  });
  generateRows();
}

refreshBtn.addEventListener("click", () => {
  loadData(data);
});

saveBtn.addEventListener("click", () => {
  saveData();
});

table.querySelectorAll("th").forEach((th) => {
  th.addEventListener("click", () => {
    const column = th.getAttribute("data-column");
    const order = th.getAttribute("data-order") === "asc" ? "desc" : "asc";
    th.setAttribute("data-order", order);
    sortData(column, order);
  });
});

addBtn.addEventListener("click", () => {
  const id = data.length + 1;
  const newRow = {
    id: id,
    chemicalName: "",
    vendor: "",
    density: "",
    viscosity: "",
    packaging: "",
    packSize: "",
    unit: "",
    quantity: "",
  };
  data.push(newRow);
  generateRows(data);
});

upBtn.addEventListener("click", () => {
  const selectedRow = table.querySelector(".selected");
  if (selectedRow) {
    const index = selectedRow.rowIndex;
    if (index > 1) {
      const prevRow = tbody.rows[index - 2];
      tbody.insertBefore(selectedRow, prevRow);
      [data[index - 1], data[index - 2]] = [data[index - 2], data[index - 1]];
    }
  }
});

downBtn.addEventListener("click", () => {
  const selectedRow = table.querySelector(".selected");
  if (selectedRow) {
    const index = selectedRow.rowIndex;
    if (index < tbody.rows.length) {
      const nextRow = selectedRow.nextElementSibling;
      tbody.insertBefore(nextRow, selectedRow);
      [data[index], data[index + 1]] = [data[index + 1], data[index]];
    }
  }
});

deleteBtn.addEventListener("click", () => {
  const selectedRow = table.querySelector(".selected");
  if (selectedRow) {
    const index = [...tbody.children].indexOf(selectedRow);
    if (confirm("Are you sure you want to delete the data?")) {
      tbody.removeChild(selectedRow);
      data.splice(index, 1);
      // Update the id of the remaining rows
      for (let i = index; i < data.length; i++) {
        data[i].id = i + 1;
      }
    }
  }
});

tbody.addEventListener("click", (event) => {
  if (event.target.tagName === "TD") {
    const selectedRow = table.querySelector(".selected");
    if (selectedRow) {
      selectedRow.classList.remove("selected");
    }
    event.target.parentNode.classList.add("selected");
  }
});

loadData();
