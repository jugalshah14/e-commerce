const paginationContainer = document.getElementById("pagination");
let itemsPerPage = 8;
let currentPage = 1;
let filteredProducts = [];

function updateItemsPerPage() {
  if (window.innerWidth <= 768) {
    // Adjust the screen width as needed
    itemsPerPage = 4; // Change to 4 items per page for smaller screens
  } else {
    itemsPerPage = 8; // Revert to 8 items per page for larger screens
  }
  const itemsPerPageDropdown = document.getElementById("itemsPerPage");
  const selectedValue = parseInt(itemsPerPageDropdown.value);

  // Update the itemsPerPage variable
  itemsPerPage = selectedValue;

  // Redisplay the products with the updated items per page
  displayProductsOnPage(filteredProducts, productContainer, currentPage);
  updatePaginationUI(filteredProducts, paginationContainer);
}
const itemsPerPageDropdown = document.getElementById("itemsPerPage");
itemsPerPageDropdown.addEventListener("change", updateItemsPerPage);

// Call the function initially and listen for window resize events
window.addEventListener("resize", updateItemsPerPage);

// function updateCartBadge() {
//   const cartBadge = document.getElementById("cart-badge");
//   const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
//   const numItemsInCart = cartItems.length;
//   cartBadge.textContent = numItemsInCart.toString();
// }

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

// // Call the updateCartBadge function to initialize the badge
// updateCartBadge();

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
  const noProductsFound = document.getElementById("no-products-found");
  if (productsToDisplay.length === 0) {
    // Show the "No products found" placeholder
    noProductsFound.style.display = "block";
  } else {
    // Hide the "No products found" placeholder
    noProductsFound.style.display = "none";

    if (productsToDisplay.length > 0) {
      createProductCards(productsToDisplay, container, "Product added to cart");
    }
  }
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

// Get references to the icon and the right-side menu
// Get references to the icon, the close button, and the right-side menu
const icon = document.querySelector(".menu-icon");
const menu = document.getElementById("right-menu");
const closeButton = document.getElementById("close-button");

// Function to open the menu
function openMenu() {
  menu.classList.add("show");
}

// Function to close the menu
function closeMenu() {
  menu.classList.remove("show");
}

// Add click event listeners to the icon and the close button
icon.addEventListener("click", openMenu);
closeButton.addEventListener("click", closeMenu);

sortDropdown.addEventListener("change", sortProducts);

sortProducts();

function createProductCards(products, container, customMessage) {
  let row = document.createElement("div");
  row.className = "row";
  let cardCount = 0;
  container.innerHTML = "";

  products.forEach((product) => {
    if (cardCount % 4 === 0) {
      container.appendChild(row);
      row = document.createElement("div");
      row.className = "row";
    }

    const cardDiv = document.createElement("div");
    cardDiv.className = "col-lg-3 col-md-6 col-sm-6";

    const originalPrice = product.price;
    const discountedPrice = Math.round(
      product.price * (1 - product.discount / 100)
    );

    cardDiv.innerHTML = `
                   <div class="card">
      <div class="discount-badge">${product.discount}% Off</div>
      <div class="wishlist-badge">
      <ion-icon name="heart-outline" onclick="addToWishlist(${product.id})"></ion-icon>
      </div>
      <a href="product.html?id=${product.id}">
        <img src="${product.image[0]}" class="card-img-top">
      </a>
      <div class="card-body">
        <p class="category-show">${product.category}</p>
        <div class="product-title">
          <h5 class="card-title">${product.title}</h5>
        </div>
        <p class="card-text">
          <b> ₹ ${discountedPrice}</b> &nbsp; <del style="color:rgb(191,191,191)" > ₹${originalPrice}</del>
        </p>
      </div>
    </div>
  `;

    row.appendChild(cardDiv);
    cardCount++;
  });

  container.appendChild(row);
}
function addToWishlist(productId) {
  // Retrieve the product from local storage based on productId
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const product = products.find((p) => p.id === productId);

  if (product) {
    // Retrieve the current wishlist from local storage or initialize an empty array
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    // Check if the product is already in the wishlist
    const isProductInWishlist = wishlist.some((p) => p.id === productId);

    if (!isProductInWishlist) {
      // Add the product to the wishlist in local storage
      wishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));

      // Show a toast message indicating that the product has been added to the wishlist
      showToast("Product added to wishlist");
    } else {
      // Product is already in the wishlist, show a toast message indicating that
      showToast("Product is already in the wishlist");
    }
  }
}

const priceRangeSlider = document.getElementById("price-range-slider");
const priceRangeValue = document.getElementById("price-range-value");

// Initialize the dual-range slider
noUiSlider.create(priceRangeSlider, {
  start: [0, findMaxPriceInLocalStorage()], // Initial values for min and max
  connect: true, // Connect the two handles
  range: {
    min: 0,
    max: findMaxPriceInLocalStorage(), // Set the maximum value dynamically
  },
});

// Update the price range display when the slider values change
priceRangeSlider.noUiSlider.on("update", (values, handle) => {
  const [minValue, maxValue] = values;
  priceRangeValue.textContent = `₹ ${minValue} - ₹ ${maxValue}`;

  // Filter products automatically as the user moves the sliders
  const minPrice = parseFloat(minValue);
  const maxPrice = parseFloat(maxValue);
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

function populateCategoryCheckboxes() {
  const categoryFilter = document.getElementById("CategoryFilter");
  const categories = JSON.parse(localStorage.getItem("categories")) || [];

  categoryFilter.innerHTML = "";

  categories.forEach((category) => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = category.name;
    checkbox.value = category.name;
    const label = document.createElement("label");
    label.htmlFor = category.name;
    label.textContent = category.name;

    categoryFilter.appendChild(checkbox);
    categoryFilter.appendChild(label);
  });
}

function filterProductsByCategory() {
  const checkboxes = document.querySelectorAll("input[type='checkbox']");
  const selectedCategories = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  if (selectedCategories.length === 0 || selectedCategories.includes("")) {
    filteredProducts = products;
  } else {
    filteredProducts = products.filter((product) =>
      selectedCategories.includes(product.category.toLowerCase())
    );
  }

  currentPage = 1;
  displayProductsOnPage(filteredProducts, productContainer, currentPage);
  updatePaginationUI(filteredProducts, paginationContainer);
}

// Add an event listener to call the filter function
const categoryFilter = document.getElementById("CategoryFilter");
categoryFilter.addEventListener("change", filterProductsByCategory);

function findMaxPriceInLocalStorage() {
  // Get the products from local storage
  const productsJSON = localStorage.getItem("products");

  if (productsJSON) {
    // Parse the JSON data into an array
    const products = JSON.parse(productsJSON);

    if (Array.isArray(products) && products.length > 0) {
      // Initialize maxPrice with the price of the first product
      let maxPrice = products[0].price;

      // Iterate through the products and update maxPrice if a higher price is found
      for (const product of products) {
        if (product.price > maxPrice) {
          maxPrice = product.price;
        }
      }

      return maxPrice;
    }
  }

  // Return a default range if there are no products or the 'products' key is not set
  return 100; // Example default range: 0 to 100
}

document.addEventListener("DOMContentLoaded", function () {
  // Get the current URL
  var currentURL = window.location.href;

  // Find the links and set the "active" class based on the current URL
  var links = document.querySelectorAll(".nav-link");
  for (var i = 0; i < links.length; i++) {
    var href = links[i].getAttribute("href");
    if (currentURL.indexOf(href) !== -1) {
      links[i].classList.add("active");
    }
  }
});

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
populateCategoryCheckboxes();
createProductCards(filteredProducts, productContainer, "Product added to cart");
displayProductsOnPage(filteredProducts, productContainer, currentPage);
updatePaginationUI(filteredProducts, paginationContainer);
