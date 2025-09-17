document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const form = document.querySelector("form.card");
  const nameInput = document.getElementById("name");
  const priceInput = document.getElementById("price");
  const categoryInput = document.getElementById("category");
  const descInput = document.getElementById("description");
  const listContainer = document.querySelector(".all-cards");
  const counterBtn = document.querySelector(".card-header button");
  const searchBox = document.getElementById("search");
  const filterSelect = document.getElementById("categories");

  // hidden input for edit
  const hiddenIndex = document.createElement("input");
  hiddenIndex.type = "hidden";
  hiddenIndex.id = "editIndex";
  form.appendChild(hiddenIndex);

  // Bootstrap toast
  function showToast(msg, type = "success") {
    const toastArea = document.getElementById("toastBox");
    const toastEl = document.createElement("div");
    toastEl.className = `toast text-bg-${type} border-0 align-items-center`;
    toastEl.setAttribute("role", "alert");
    toastEl.setAttribute("aria-live", "assertive");
    toastEl.setAttribute("aria-atomic", "true");

    toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${msg}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    `;

    toastArea.appendChild(toastEl);

    const bsToast = new bootstrap.Toast(toastEl, { delay: 2500 });
    bsToast.show();

    toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
  }

  // Local storage
  let items = JSON.parse(localStorage.getItem("products")) || [];

  const save = () => localStorage.setItem("products", JSON.stringify(items));

  function drawList() {
    const term = searchBox.value.toLowerCase();
    const chosenCategory = filterSelect.value;

    const visible = items.filter(it => {
      const okName = it.name.toLowerCase().includes(term);
      const okCategory =
        chosenCategory === "" || chosenCategory === "All categories" || it.category === chosenCategory;
      return okName && okCategory;
    });

    listContainer.innerHTML = "";

    visible.forEach((prod, i) => {
      const card = document.createElement("div");
      card.className = "card-info col-lg-4 col-md-6 col-12";

      card.innerHTML = `
        <div class="card shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between fw-medium">
              <span>${prod.name}</span>
              <span class="badge bg-primary">${prod.category}</span>
            </div>
            <div class="text-success fw-bold fs-5">$${prod.price}</div>
            <p>${prod.description}</p>
          </div>
          <div class="d-flex p-3 gap-2">
            <button class="btn btn-outline-warning w-50 edit-btn" data-id="${i}">
              <i class="fa-solid fa-pen"></i> Edit
            </button>
            <button class="btn btn-outline-danger w-50 delete-btn" data-id="${i}">
              <i class="fa-solid fa-trash"></i> Delete
            </button>
          </div>
        </div>
      `;

      listContainer.appendChild(card);
    });

    counterBtn.textContent = `${visible.length} Products`;

    // attach handlers
    document.querySelectorAll(".delete-btn").forEach(btn =>
      btn.addEventListener("click", e => removeItem(e.target.closest("button").dataset.id))
    );

    document.querySelectorAll(".edit-btn").forEach(btn =>
      btn.addEventListener("click", e => loadForEdit(e.target.closest("button").dataset.id))
    );
  }

  // Submit form
  form.addEventListener("submit", e => {
    e.preventDefault();
    const idx = hiddenIndex.value;

    if (idx === "") {
      items.push({
        name: nameInput.value,
        price: priceInput.value,
        category: categoryInput.value,
        description: descInput.value,
      });
      showToast("✅ Product added", "success");
    } else {
      items[idx] = {
        name: nameInput.value,
        price: priceInput.value,
        category: categoryInput.value,
        description: descInput.value,
      };
      hiddenIndex.value = "";
      showToast("✏️ Product updated", "warning");
    }

    save();
    drawList();
    form.reset();
  });

  // Delete
  function removeItem(i) {
    items.splice(i, 1);
    save();
    drawList();
    showToast("🗑️ Deleted", "danger");
  }

  // Edit
  function loadForEdit(i) {
    const item = items[i];
    nameInput.value = item.name;
    priceInput.value = item.price;
    categoryInput.value = item.category;
    descInput.value = item.description;
    hiddenIndex.value = i;
  }

  // Filters
  searchBox.addEventListener("input", drawList);
  filterSelect.addEventListener("change", drawList);

  drawList();
});
