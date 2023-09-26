let editingCategoryId = null;

function displayImage(input) {
  const selectedImage = document.getElementById("selectedImage");
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      selectedImage.src = e.target.result;
      selectedImage.style.display = "block";
    };
    reader.readAsDataURL(input.files[0]);
  }
}

document
  .getElementById("categoryForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const categoryNameInput = document.getElementById("categoryName");
    const selectedImage = document.getElementById("selectedImage");
    const categoryName = categoryNameInput.value.trim();
    const imageSrc = selectedImage.src;

    if (categoryName !== "" && imageSrc !== "") {
      if (editingCategoryId !== null) {
        // Editing an existing category
        editCategory(editingCategoryId, categoryName, imageSrc);
        editingCategoryId = null; // Reset editing state
      } else {
        // Adding a new category
        addCategory(categoryName, imageSrc);
      }

      // Clear form inputs
      categoryNameInput.value = "";
      selectedImage.style.display = "none";

      // Display the updated category list
      displayCategories();
    }
  });

function addCategory(categoryName, imageSrc) {
  const categoryData = {
    id: Date.now().toString(), // Generate a unique ID
    name: categoryName,
    image: imageSrc,
  };

  // Store the category data in local storage
  const categories = JSON.parse(localStorage.getItem("categories")) || [];
  categories.push(categoryData);
  localStorage.setItem("categories", JSON.stringify(categories));
}

function editCategory(categoryId, categoryName, imageSrc) {
  const categories = JSON.parse(localStorage.getItem("categories")) || [];
  const editedCategoryIndex = categories.findIndex(
    (category) => category.id === categoryId
  );

  if (editedCategoryIndex !== -1) {
    // Update the category with the new data
    categories[editedCategoryIndex] = {
      id: categoryId,
      name: categoryName,
      image: imageSrc,
    };

    // Update the local storage
    localStorage.setItem("categories", JSON.stringify(categories));
  }
}

function deleteCategory(categoryId) {
  const categories = JSON.parse(localStorage.getItem("categories")) || [];
  const updatedCategories = categories.filter(
    (category) => category.id !== categoryId
  );

  // Update the local storage
  localStorage.setItem("categories", JSON.stringify(updatedCategories));

  // Display the updated category list
  displayCategories();
}

function displayCategories() {
  const categories = JSON.parse(localStorage.getItem("categories")) || [];
  const categoryTableBody = document.getElementById("categoryTableBody");
  categoryTableBody.innerHTML = "";

  categories.forEach((categoryData) => {
    const row = categoryTableBody.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    cell1.innerHTML = categoryData.name;
    cell2.innerHTML = `<img src="${categoryData.image}" alt="${categoryData.name}" style="max-width: 100px;">`;
    cell3.innerHTML = `<button class="btn btn-warning" onclick="editCategoryHandler('${categoryData.id}', '${categoryData.name}', '${categoryData.image}')">Edit</button> <button class="btn btn-danger" onclick="deleteCategoryHandler('${categoryData.id}')">Delete</button>`;
  });
}

function editCategoryHandler(categoryId, categoryName, imageSrc) {
  editingCategoryId = categoryId;
  const categoryNameInput = document.getElementById("categoryName");
  const selectedImage = document.getElementById("selectedImage");
  categoryNameInput.value = categoryName;
  selectedImage.src = imageSrc;
  selectedImage.style.display = "block";
}

function deleteCategoryHandler(categoryId) {
  deleteCategory(categoryId);
}

// Display the initial categories on page load
displayCategories();
