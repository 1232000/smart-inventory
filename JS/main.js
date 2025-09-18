// ================= Select Elements =================
const form = document.getElementById("productForm");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const categoryInput = document.getElementById("category");
const descInput = document.getElementById("description");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formTitle = document.getElementById("formTitle");
const allCards = document.getElementById("productsContainer");
const searchInput = document.getElementById("search");
const filterCategory = document.getElementById("categories");
const productCountBtn = document.getElementById("productCount");
const toastBox = document.getElementById("toastBox");
const themeToggle = document.getElementById("themeToggle");

// ================= Theme Toggle =================
const themeIcon = themeToggle?.querySelector("i");
let savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);
updateThemeIcon(savedTheme);

themeToggle?.addEventListener("click", () => {
  let currentTheme = document.documentElement.getAttribute("data-theme");
  let newTheme = currentTheme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", newTheme);
  updateThemeIcon(newTheme);
  localStorage.setItem("theme", newTheme);
});

function updateThemeIcon(theme) {
  if (!themeIcon) return;
  if (theme === "dark") {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  } else {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
  }
}

// ================= Data Store =================
let items = JSON.parse(localStorage.getItem("products")) || [];
const hiddenIndex = document.createElement("input");
hiddenIndex.type = "hidden";
hiddenIndex.id = "editIndex";
form.appendChild(hiddenIndex);

// ================= Save & Render =================
function save() {
  localStorage.setItem("products", JSON.stringify(items));
}

function createCard(product, index) {
  const cardInfo = document.createElement("div");
  cardInfo.className = "card-info col-lg-4 col-md-6 col-12";

  const card = document.createElement("div");
  card.className = "card";

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  const headerDiv = document.createElement("div");
  headerDiv.className = "d-flex justify-content-between fw-medium";

  const nameDiv = document.createElement("div");
  nameDiv.className = "mb-1";
  nameDiv.textContent = product.name;

  const categoryDiv = document.createElement("div");
  categoryDiv.className = "bg-primary text-white-css rounded-5 px-3";
  categoryDiv.textContent = product.category;

  headerDiv.appendChild(nameDiv);
  headerDiv.appendChild(categoryDiv);

  const priceDiv = document.createElement("div");
  priceDiv.className = "text-success fw-bold fs-2 mb-2";
  priceDiv.textContent = `$${product.price.toFixed(2)}`;

  const descDiv = document.createElement("div");
  descDiv.className = "fs-6";
  descDiv.textContent = product.desc;

  cardBody.appendChild(headerDiv);
  cardBody.appendChild(priceDiv);
  cardBody.appendChild(descDiv);

  const actionsDiv = document.createElement("div");
  actionsDiv.className = "d-flex p-3 gap-3";

  const editBtn = document.createElement("button");
  editBtn.className = "btn btn-light btn-outline-primary w-50 mt-3";
  editBtn.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Edit`;
  editBtn.addEventListener("click", () => loadForEdit(index));

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-light btn-outline-danger w-50 mt-3";
  deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i> Delete`;
  deleteBtn.addEventListener("click", () => deleteItem(index));

  actionsDiv.appendChild(editBtn);
  actionsDiv.appendChild(deleteBtn);

  card.appendChild(cardBody);
  card.appendChild(actionsDiv);
  cardInfo.appendChild(card);

  return cardInfo;
}

function drawList(list = items) {
  allCards.innerHTML = "";
  list.forEach((product, i) => {
    allCards.appendChild(createCard(product, i));
  });
  productCountBtn.textContent = `${list.length} Product${list.length !== 1 ? "s" : ""}`;
}

// ================= Add / Edit Product =================
form.addEventListener("submit", e => {
  e.preventDefault();

  let name = nameInput.value.trim();
  let price = parseFloat(priceInput.value);
  let category = categoryInput.value;
  let desc = descInput.value.trim();

  if (!name || isNaN(price) || price <= 0 || !category || category === "Select a category" || !desc) {
    showToast("Please fill all fields correctly", "danger");
    return;
  }

  let editIndex = hiddenIndex.value;

  if (!editIndex) {
    items.push({ name, price, category, desc });
    showToast(`<i class="fa-solid fa-circle-check"></i> Product Added`, "success");
  } else {
    items[editIndex] = { name, price, category, desc };
    hiddenIndex.value = "";

    formTitle.innerHTML = `<i class="fa-solid fa-circle-plus"></i> Add New Product`;
    submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Product';
    cancelBtn.classList.add("d-none");

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

  formTitle.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Edit Product`;
  submitBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Update Product';
  cancelBtn.classList.remove("d-none");
};

// ================= Cancel Edit =================
cancelBtn.addEventListener("click", () => {
  hiddenIndex.value = "";
  form.reset();

  formTitle.innerHTML = `<i class="fa-solid fa-circle-plus"></i> Add New Product`;
  submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Product';
  cancelBtn.classList.add("d-none");
});

// ================= Delete Product =================
window.deleteItem = function (i) {
  if (confirm("Are you sure you want to delete this product?")) {
    items.splice(i, 1);
    save();
    drawList();
    showToast(`<i class="fa-solid fa-trash"></i> Product Deleted`, "danger");
  }
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

  drawList(filtered);
}

// ================= Toast Notifications =================
function showToast(message, type) {
  let toast = document.createElement("div");
  toast.className = `toast align-items-center text-bg-${type} border-0 show mb-2`;

  const flex = document.createElement("div");
  flex.className = "d-flex";

  const body = document.createElement("div");
  body.className = "toast-body";
  body.innerHTML = message;

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "btn-close btn-close-white me-2 m-auto";
  closeBtn.setAttribute("data-bs-dismiss", "toast");

  flex.appendChild(body);
  flex.appendChild(closeBtn);
  toast.appendChild(flex);
  toastBox.appendChild(toast);

  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();

  setTimeout(() => toast.remove(), 3000);
}

// ================= Init =================
drawList();
// ================keyboard Shortcuts =================
document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        //addItem();
    }

    if (event.ctrlKey && event.key.toLowerCase() === "s") {
        event.preventDefault();
        //updateItem();
    }

    if (event.key === "Delete") {
        event.preventDefault();
        deleteItem();
    }

    if (event.ctrlKey && event.key.toLowerCase() === "y") {
        event.preventDefault();
        // cancelAdd(); 
    }

    if (event.ctrlKey && event.key.toLowerCase() === "f") {
        event.preventDefault();
        searchInput();
    }
});
