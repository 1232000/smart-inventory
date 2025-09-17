// ================= Select Elements =================
const form = document.querySelector("form");
const nameInput = document.querySelector("#name");
const priceInput = document.querySelector("#price");
const categoryInput = document.querySelector("#category");
const descInput = document.querySelector("#description");
const hiddenIndex = document.createElement("input");
hiddenIndex.type = "hidden";
form.appendChild(hiddenIndex);
const submitBtn = form.querySelector("button[type='submit']");
const allCards = document.querySelector(".all-cards");
const searchInput = document.querySelector("#search");
const filterCategory = document.querySelector("#categories");
const productCountBtn = document.querySelector(".card-header button");
const toastBox = document.querySelector("#toastBox");

// ================= Theme Toggle =================
const toggleBtn = document.querySelector(".btn-outline-light i.fa-moon, .btn-outline-light i.fa-sun")?.parentElement;
const themeIcon = toggleBtn?.querySelector("i");

let savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);
if (savedTheme === "dark") {
  themeIcon.classList.remove("fa-moon");
  themeIcon.classList.add("fa-sun");
} else {
  themeIcon.classList.remove("fa-sun");
  themeIcon.classList.add("fa-moon");
}

toggleBtn?.addEventListener("click", () => {
  let currentTheme = document.documentElement.getAttribute("data-theme");
  let newTheme = currentTheme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", newTheme);
  if (newTheme === "dark") {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  } else {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
  }
  localStorage.setItem("theme", newTheme);
});

// ================= Data Store =================
let items = JSON.parse(localStorage.getItem("products")) || [];

// ================= Save & Render =================
function save() {
  localStorage.setItem("products", JSON.stringify(items));
}

function drawList() {
  allCards.innerHTML = "";
  items.forEach((product, i) => {
    const card = document.createElement("div");
    card.className = "card-info col-lg-4 col-md-6 col-12";
    card.innerHTML = `
      <div class="card">
        <div class="card-body">
          <div class="d-flex justify-content-between fw-medium">
            <div class="mb-1">${product.name}</div>
            <div class="bg-primary text-white-css rounded-5 px-3">${product.category}</div>
          </div>
          <div class="text-success fw-bold fs-2 mb-2">$${product.price.toFixed(2)}</div>
          <div class="fs-6">${product.desc}</div>
        </div>
        <div class="d-flex p-3 gap-3">
          <button class="btn btn-light btn-outline-primary w-50 mt-3" onclick="loadForEdit(${i})">
            <i class="fa-solid fa-pen-to-square"></i>
            Edit
          </button>
          <button class="btn btn-light btn-outline-danger w-50 mt-3" onclick="deleteItem(${i})">
            <i class="fa-solid fa-trash"></i>
            Delete
          </button>
        </div>
      </div>
    `;
    allCards.appendChild(card);
  });
  productCountBtn.textContent = `${items.length} Product${items.length !== 1 ? "s" : ""}`;
}

// ================= Add / Edit Product =================
form.addEventListener("submit", e => {
  e.preventDefault();

  let name = nameInput.value.trim();
  let price = parseFloat(priceInput.value);
  let category = categoryInput.value;
  let desc = descInput.value.trim();

  if (!name || isNaN(price) || !category || !desc) {
    showToast("Please fill all fields correctly", "danger");
    return;
  }

  let editIndex = hiddenIndex.value;

  if (editIndex === "") {
    // Add new product
    items.push({ name, price, category, desc });
    showToast(`<i class="fa-solid fa-circle-check"></i> Product Added`, "success");
  } else {
    // Update existing product
    items[editIndex] = { name, price, category, desc };
    hiddenIndex.value = "";
    submitBtn.textContent = "Add Product"; // Reset button text
    showToast(`<i class="fa-solid fa-pen-to-square"></i> Product Updated`, "info");
  }

  save();
  drawList();
  form.reset();
});

// ================= Load for Edit =================
window.loadForEdit = function (i) {
  const product = items[i];
  nameInput.value = product.name;
  priceInput.value = product.price;
  categoryInput.value = product.category;
  descInput.value = product.desc;
  hiddenIndex.value = i;
  submitBtn.textContent = "Edit Product"; // Change button text
};

// ================= Delete Product =================
window.deleteItem = function (i) {
  items.splice(i, 1);
  save();
  drawList();
  showToast(`<i class="fa-solid fa-trash"></i> Product Deleted`, "danger");
};

// ================= Search & Filter =================
searchInput.addEventListener("input", applyFilters);
filterCategory.addEventListener("change", applyFilters);

function applyFilters() {
  let keyword = searchInput.value.toLowerCase();
  let categoryFilter = filterCategory.value;

  const filtered = items.filter(p =>
    (p.name.toLowerCase().includes(keyword) || p.desc.toLowerCase().includes(keyword)) &&
    (categoryFilter === "All categories" || p.category === categoryFilter)
  );

  allCards.innerHTML = "";
  filtered.forEach((product, i) => {
    const card = document.createElement("div");
    card.className = "card-info col-lg-4 col-md-6 col-12";
    card.innerHTML = `
      <div class="card">
        <div class="card-body">
          <div class="d-flex justify-content-between fw-medium">
            <div class="mb-1">${product.name}</div>
            <div class="bg-primary text-white-css rounded-5 px-3">${product.category}</div>
          </div>
          <div class="text-success fw-bold fs-2 mb-2">$${product.price.toFixed(2)}</div>
          <div class="fs-6">${product.desc}</div>
        </div>
        <div class="d-flex p-3 gap-3">
          <button class="btn btn-light btn-outline-primary w-50 mt-3" onclick="loadForEdit(${i})">
            <i class="fa-solid fa-pen-to-square"></i>
            Edit
          </button>
          <button class="btn btn-light btn-outline-danger w-50 mt-3" onclick="deleteItem(${i})">
            <i class="fa-solid fa-trash"></i>
            Delete
          </button>
        </div>
      </div>
    `;
    allCards.appendChild(card);
  });

  productCountBtn.textContent = `${filtered.length} Product${filtered.length !== 1 ? "s" : ""}`;
}

// ================= Toast Notifications =================
function showToast(message, type) {
  let toast = document.createElement("div");
  toast.className = `toast align-items-center text-bg-${type} border-0 show mb-2`;
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;
  toastBox.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ================= Init =================
drawList();
