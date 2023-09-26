document.addEventListener("DOMContentLoaded", function () {
  function addToLocalStorage() {
    const title = document.getElementById("Title").value;
    const category = document.getElementById("Category").value;
    const price = parseFloat(document.getElementById("Price").value);
    const imgInput = document.getElementById("img");
    const discountInput = document.getElementById("Discount");
    const discount = parseFloat(discountInput.value);
    const availableQuantity = document.getElementById("Quantity").value;
    if (
      title &&
      category &&
      !isNaN(price) &&
      !isNaN(discount) &&
      availableQuantity &&
      imgInput.files.length > 0
    ) {
      // Validate that discount is not greater than 100%
      if (discount > 100) {
        alert("Discount percentage cannot be greater than 100%");
        return;
      }

      const discountedPrice = price - (price * discount) / 100;

      const imgFile = imgInput.files[0];
      const reader = new FileReader();

      reader.onload = function (event) {
        const imgBase64 = event.target.result;
        const uniqueId = new Date().getTime() + Math.random();
        const newItem = {
          id: uniqueId,
          title,
          category,
          discount,
          price,
          discountedPrice,
          availableQuantity,
          img: imgBase64,
        };

        let items = JSON.parse(localStorage.getItem("items")) || [];
        items.push(newItem);
        localStorage.setItem("items", JSON.stringify(items));

        document.getElementById("Title").value = "";
        document.getElementById("Category").value = "";
        document.getElementById("Discount").value = "";
        document.getElementById("Price").value = "";
        document.getElementById("img").value = "";
        document.getElementById("Quantity").value = "";

        populateTable();
      };

      reader.readAsDataURL(imgFile);
    } else {
      alert("Please fill in all fields and select an image.");
    }
  }

  // Add an input event listener to the Discount input field
  document
    .getElementById("Discount")
    .addEventListener("input", updateDiscountedPrice);

  function updateDiscountedPrice() {
    const price = parseFloat(document.getElementById("Price").value);
    const discountInput = document.getElementById("Discount");
    const discount = parseFloat(discountInput.value);

    if (!isNaN(price) && !isNaN(discount)) {
      // Validate that discount is not greater than 100%
      if (discount > 100) {
        alert("Discount percentage cannot be greater than 100%");
        discountInput.value = 100; // Set the discount to 100% if it's greater
      }
    }
  }

  // Call updateDiscountedPrice initially to calculate and display the initial discounted price
  updateDiscountedPrice();

  // Function to populate the category dropdown
  function populateCategoryDropdown() {
    const categoryDropdown = document.getElementById("Category");
    const categories = JSON.parse(localStorage.getItem("categories")) || [];

    // Clear existing options
    categoryDropdown.innerHTML = "";

    // Add a default "Select Category" option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select Category";
    categoryDropdown.appendChild(defaultOption);

    // Add category options
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.name;
      option.textContent = category.name;
      categoryDropdown.appendChild(option);
    });
  }

  // Call the function to populate the category dropdown
  populateCategoryDropdown();

  function populateTable() {
    const itemTableBody = document.getElementById("itemTableBody");
    itemTableBody.innerHTML = "";

    const items = JSON.parse(localStorage.getItem("items")) || [];

    items.forEach((item, index) => {
      const row = itemTableBody.insertRow();
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      const cell4 = row.insertCell(3);
      const cell5 = row.insertCell(4);
      const cell6 = row.insertCell(5);
      const cell7 = row.insertCell(6);
      const cell8 = row.insertCell(7);

      cell1.innerHTML = item.title;
      cell2.innerHTML = item.category;
      cell3.innerHTML = item.price;
      cell4.innerHTML = item.discount;
      cell5.innerHTML = item.availableQuantity;
      cell6.innerHTML = `<img src="${item.img}" alt="${item.title}" width="50" height="50" />`;
      cell7.innerHTML = `<button class="btn btn-primary" onclick="editItem(${index})">Edit</button>`;
      cell8.innerHTML = `<button class="btn btn-primary" onclick="deleteItem(${index})">Delete</button>`;
    });
  }

  function editItem(index) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    const itemToEdit = items[index];

    document.getElementById("Title").value = itemToEdit.title;
    document.getElementById("Category").value = itemToEdit.category;
    document.getElementById("Price").value = itemToEdit.price;
    document.getElementById("Discount").value = itemToEdit.discount;
    document.getElementById("Quantity").value = itemToEdit.availableQuantity;
    const itemImage = document.getElementById("itemImage");
    itemImage.src = itemToEdit.img;

    const submitButton = document.querySelector(".btn-primary");
    submitButton.textContent = "Save Edit";
    submitButton.onclick = function () {
      saveEditedItem(index);
    };
  }

  function saveEditedItem(index) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    const editedItem = {
      title: document.getElementById("Title").value,
      category: document.getElementById("Category").value,
      price: document.getElementById("Price").value,
      discount: document.getElementById("Discount").value,
      availableQuantity: document.getElementById("Quantity").value,
      img: "",
    };

    const imgInput = document.getElementById("img");
    if (imgInput.files.length > 0) {
      const imgFile = imgInput.files[0];
      const reader = new FileReader();

      reader.onload = function (event) {
        editedItem.img = event.target.result;
        items[index] = editedItem;
        localStorage.setItem("items", JSON.stringify(items));

        populateTable();

        document.getElementById("addItemForm").reset();
        const submitButton = document.querySelector(".btn-primary");
        submitButton.textContent = "Submit";
        submitButton.onclick = addToLocalStorage;

        document.getElementById("img").value = "";
        document.getElementById("itemImage").src = "";
      };

      reader.readAsDataURL(imgFile);
    } else {
      editedItem.img = items[index].img;
      items[index] = editedItem;
      localStorage.setItem("items", JSON.stringify(items));

      populateTable();

      // document.getElementById("addItemForm").reset();
      const submitButton = document.querySelector(".btn-primary");
      submitButton.textContent = "Submit";
      submitButton.onclick = addToLocalStorage;

      document.getElementById("img").value = "";
      document.getElementById("itemImage").src = "";
    }
  }

  function deleteItem(index) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    items.splice(index, 1);
    localStorage.setItem("items", JSON.stringify(items));
    populateTable();
  }
  window.addToLocalStorage = addToLocalStorage;
  window.editItem = editItem;
  window.saveEditedItem = saveEditedItem;
  window.deleteItem = deleteItem;

  // Add an input event listener to the Discount input field
  document
    .getElementById("Discount")
    .addEventListener("input", updateDiscountedPrice);

  populateTable();
});
