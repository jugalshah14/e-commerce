const paginationContainer = document.getElementById("pagination");
const itemsPerPage = 8;
let currentPage = 1;
let filteredProducts = [];

function updateCartBadge() {
  const cartBadge = document.getElementById("cart-badge");
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const numItemsInCart = cartItems.length;
  cartBadge.textContent = numItemsInCart.toString();
}

// Add this function to your addToCart function to trigger badge update
function addToCart(product, button, customMessage, discountedPrice) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const isProductInCart = cart.some((item) => item.id === product.id);

  if (isProductInCart) {
    showToast("This product is already in your cart.");
  } else {
    const cartItem = {
      ...product,
      discountedPrice: discountedPrice,
      quantity: 1,
    };

    cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));
    showToast(customMessage || "Product added to cart");

    button.disabled = true;
    // Update the cart badge after adding a product
    updateCartBadge();
  }
}
function showToast(message) {
  const toastContainer = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <div class="toast-message">${message}</div>
    <button class="toast-close-btn">&times;</button>
  `;

  const closeBtn = toast.querySelector(".toast-close-btn");
  closeBtn.addEventListener("click", () => {
    toastContainer.removeChild(toast);
  });

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 300);
  }, 2000); // Adjust the duration as needed (in milliseconds)
}

// Call the updateCartBadge function to initialize the badge
updateCartBadge();

function performSearch() {
  const searchInput = document.getElementById("search-input");
  const searchTerm = searchInput.value.toLowerCase().trim();

  filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm)
  );

  currentPage = 1;
  displayProductsOnPage(filteredProducts, productContainer, currentPage);
  updatePaginationUI(filteredProducts, paginationContainer);
}

function displayProductsOnPage(products, container, page) {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const productsToDisplay = products.slice(start, end);

  container.innerHTML = "";
  createProductCards(productsToDisplay, container, "Product added to cart");
}

const prevPageButton = document.getElementById("prev-page");
const nextPageButton = document.getElementById("next-page");

function updatePaginationUI(filteredProducts, paginationContainer) {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  paginationContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.addEventListener("click", () => {
      currentPage = i;
      displayProductsOnPage(filteredProducts, productContainer, currentPage);
      updatePaginationUI(filteredProducts, paginationContainer);
    });

    if (i === currentPage) {
      pageButton.classList.add("active");
    }

    paginationContainer.appendChild(pageButton);
  }

  prevPageButton.disabled = currentPage === 1;
  nextPageButton.disabled = currentPage === totalPages;
}

prevPageButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayProductsOnPage(filteredProducts, productContainer, currentPage);
    updatePaginationUI(filteredProducts, paginationContainer);
  }
});

nextPageButton.addEventListener("click", () => {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayProductsOnPage(filteredProducts, productContainer, currentPage);
    updatePaginationUI(filteredProducts, paginationContainer);
  }
});
6;
const products = [];

const productContainer = document.getElementById("product-container");
const sortDropdown = document.getElementById("sort-dropdown");

function sortProducts() {
  const selectedOption = sortDropdown.value;

  if (selectedOption === "low-to-high") {
    filteredProducts.sort((a, b) => {
      const discountedPriceA = Math.round(a.price * (1 - a.discount / 100));
      const discountedPriceB = Math.round(b.price * (1 - b.discount / 100));
      return discountedPriceA - discountedPriceB;
    });
  } else if (selectedOption === "high-to-low") {
    filteredProducts.sort((a, b) => {
      const discountedPriceA = Math.round(a.price * (1 - a.discount / 100));
      const discountedPriceB = Math.round(b.price * (1 - b.discount / 100));
      return discountedPriceB - discountedPriceA;
    });
  } else if (selectedOption === "defaultSort") {
    filteredProducts = [...products];
  }

  currentPage = 1;

  displayProductsOnPage(filteredProducts, productContainer, currentPage);
  updatePaginationUI(filteredProducts, paginationContainer);
}

sortDropdown.addEventListener("change", sortProducts);

sortProducts();

function createProductCards(products, container, customMessage) {
  let row = document.createElement("div");
  row.className = "row";
  let cardCount = 0;

  products.forEach((product) => {
    if (cardCount % 4 === 0) {
      container.appendChild(row);
      row = document.createElement("div");
      row.className = "row";
    }

    const cardDiv = document.createElement("div");
    cardDiv.className = "col-3";

    const originalPrice = product.price;
    const discountedPrice = Math.round(
      product.price * (1 - product.discount / 100)
    );

    cardDiv.innerHTML = `
                    <div class="card">
                    <a href="product.html?id=${product.id}">
                        <img src="${product.image[0]}" class="card-img-top">
                        <div class="card-body">
                            <h5 class="card-title">${product.title}</h5>
                            <p class="card-text">
                                <del>Price: ₹ ${originalPrice}</del><br>
                                Discounted Price: ₹ ${discountedPrice}
                            </p>
                            <p>Quantity: ${product.availableQuantity}</p>
                            <a href="#" class="btn btn-primary addToCartBtn">Add To Cart</a>
                        </div>
                    </div>
                `;

    const addToCartBtn = cardDiv.querySelector(".addToCartBtn");
    addToCartBtn.addEventListener("click", () => {
      addToCart(product, addToCartBtn, customMessage, discountedPrice);
    });

    row.appendChild(cardDiv);
    cardCount++;
  });

  container.appendChild(row);
}

const priceRangeInput = document.getElementById("price-range");
const priceRangeValue = document.getElementById("price-range-value");

let minPrice = 0;
let maxPrice = 1000;

// Update the price range display when the slider value changes
priceRangeInput.addEventListener("input", () => {
  const selectedValue = priceRangeInput.value;
  priceRangeValue.textContent = `₹ ${selectedValue}`;

  minPrice = 0;
  maxPrice = parseInt(selectedValue);

  // Filter products automatically as the user moves the slider
  filteredProducts = products.filter((product) => {
    const discountedPrice = Math.round(
      product.price * (1 - product.discount / 100)
    );
    return discountedPrice >= minPrice && discountedPrice <= maxPrice;
  });

  currentPage = 1;
  displayProductsOnPage(filteredProducts, productContainer, currentPage);
  updatePaginationUI(filteredProducts, paginationContainer);
});
function populateCategoryRadioButtons() {
  const categoryFilter = document.getElementById("CategoryFilter");
  const categories = JSON.parse(localStorage.getItem("categories")) || [];

  categoryFilter.innerHTML = "";

  // Create the "All Categories" radio button
  const allCategoriesRadio = document.createElement("input");
  allCategoriesRadio.type = "radio";
  allCategoriesRadio.name = "category";
  allCategoriesRadio.id = "allCategories";
  allCategoriesRadio.value = "";
  allCategoriesRadio.checked = true;
  const allCategoriesLabel = document.createElement("label");
  allCategoriesLabel.htmlFor = "allCategories";
  allCategoriesLabel.textContent = "All Categories";

  categoryFilter.appendChild(allCategoriesRadio);
  categoryFilter.appendChild(allCategoriesLabel);

  // Create radio buttons for each category
  categories.forEach((category) => {
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "category";
    radio.id = category.name;
    radio.value = category.name;
    const label = document.createElement("label");
    label.htmlFor = category.name;
    label.textContent = category.name;

    categoryFilter.appendChild(radio);
    categoryFilter.appendChild(label);
  });
}

function filterProductsByCategory() {
  const selectedCategory = document.querySelector(
    "input[name='category']:checked"
  ).value;

  if (selectedCategory === "") {
    filteredProducts = products;
  } else {
    filteredProducts = products.filter(
      (product) =>
        product.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }

  currentPage = 1;

  displayProductsOnPage(filteredProducts, productContainer, currentPage);
  updatePaginationUI(filteredProducts, paginationContainer);
}

const categoryFilter = document.getElementById("CategoryFilter");
categoryFilter.addEventListener("change", filterProductsByCategory);

function filterProductsByPrice() {
  minPrice = 0;
  maxPrice = 1000;
  priceRangeInput.value = 500;
  priceRangeValue.textContent = "₹ 500"; // Reset the display
}

function getFormDataFromLocalStorage() {
  const items = JSON.parse(localStorage.getItem("items")) || [];
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    image: item.img,
    price: item.price,
    discount: item.discount,
    availableQuantity: item.availableQuantity,
  }));
}

const formDataFromLocalStorage = getFormDataFromLocalStorage();
localStorage.setItem("products", JSON.stringify(formDataFromLocalStorage));

products.push(...formDataFromLocalStorage);
filteredProducts = [...products];
populateCategoryRadioButtons();
createProductCards(filteredProducts, productContainer, "Product added to cart");
displayProductsOnPage(filteredProducts, productContainer, currentPage);
updatePaginationUI(filteredProducts, paginationContainer);
