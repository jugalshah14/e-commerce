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

      const selectedImages = imgInput.files;
      const imageFiles = [];

      if (selectedImages.length > 0) {
        for (let i = 0; i < selectedImages.length; i++) {
          const imgFile = selectedImages[i];
          const reader = new FileReader();

          reader.onload = function (event) {
            const imgBase64 = event.target.result;
            imageFiles.push(imgBase64);

            if (imageFiles.length === selectedImages.length) {
              const uniqueId = new Date().getTime() + Math.random();
              const newItem = {
                id: uniqueId,
                title,
                category,
                discount,
                price,
                availableQuantity,
                img: imageFiles, // Store the array of image data
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
            }
          };

          reader.readAsDataURL(imgFile);
        }
      }
    } else {
      alert("Please fill in all fields and select one or more images.");
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

      // Create a div to hold the images
      const imgContainer = document.createElement("div");
      imgContainer.className = "img-container";

      // Iterate through the item's images and create img elements
      item.img.forEach((imgData) => {
        const img = document.createElement("img");
        img.src = imgData;
        img.alt = item.title;
        imgContainer.appendChild(img);
      });

      // Append the image container to the cell
      cell6.appendChild(imgContainer);

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
    const itemImageContainer = document.getElementById("itemImage");

    // Clear existing images in the itemImage container
    itemImageContainer.innerHTML = "";

    // Populate the itemImage container with the item's images
    itemToEdit.img.forEach((imgData) => {
      const img = document.createElement("img");
      img.src = imgData;
      img.alt = itemToEdit.title;
      img.style.maxWidth = "100px"; // Adjust the maximum width of each image as needed
      img.style.maxHeight = "100px"; // Adjust the maximum height of each image as needed
      itemImageContainer.appendChild(img);
    });

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
      img: [],
    };

    const imgInput = document.getElementById("img");
    const selectedImages = imgInput.files;

    if (selectedImages.length > 0) {
      for (let i = 0; i < selectedImages.length; i++) {
        const imgFile = selectedImages[i];
        const reader = new FileReader();

        reader.onload = function (event) {
          const imgBase64 = event.target.result;
          editedItem.img.push(imgBase64);

          if (editedItem.img.length === selectedImages.length) {
            items[index] = editedItem;
            localStorage.setItem("items", JSON.stringify(items));

            populateTable();

            // Reset individual input fields
            document.getElementById("Title").value = "";
            document.getElementById("Category").value = "";
            document.getElementById("Discount").value = "";
            document.getElementById("Price").value = "";
            document.getElementById("Quantity").value = "";

            document.getElementById("img").value = "";
            document.getElementById("itemImage").innerHTML = "";
          }
        };

        reader.readAsDataURL(imgFile);
      }
    } else {
      editedItem.img = items[index].img;
      items[index] = editedItem;
      localStorage.setItem("items", JSON.stringify(items));

      populateTable();

      // Reset individual input fields
      document.getElementById("Title").value = "";
      document.getElementById("Category").value = "";
      document.getElementById("Discount").value = "";
      document.getElementById("Price").value = "";
      document.getElementById("Quantity").value = "";

      document.getElementById("img").value = "";
      document.getElementById("itemImage").innerHTML = "";
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
