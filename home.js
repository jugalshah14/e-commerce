const paginationContainer = document.getElementById("pagination");
let itemsPerPage = 8;
let currentPage = 1;
let filteredProducts = [];
let filteredProducts1 = [];

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

window.addEventListener("resize", updateItemsPerPage);

// function updateCartBadge() {
//   const cartBadge = document.getElementById("cart-badge");
//   const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
//   const numItemsInCart = cartItems.length;
//   cartBadge.textContent = numItemsInCart.toString();
// }

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
    // updateCartBadge();
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

  if (searchTerm === "") {
    const searchResultMessage = document.getElementById(
      "search-result-message"
    );
    searchResultMessage.style.display = "none";
    filteredProducts = products; // Reset filteredProducts to the original array
  } else {
    filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm)
    );
  }

  currentPage = 1;

  const searchResultMessage = document.getElementById("search-result-message");
  searchResultMessage.textContent = `Showing ${filteredProducts.length} items for "${searchTerm}" on the website`;

  if (filteredProducts.length === 0) {
    searchResultMessage.style.display = "none"; // Hide the message if there are no matching products
  } else {
    searchResultMessage.style.display = "block";
  }

  displayProductsOnPage(filteredProducts, productContainer, currentPage);
  updatePaginationUI(filteredProducts, paginationContainer);
}

function performSearch1() {
  const searchInput = document.getElementById("search-input1");
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

  if (totalPages <= 1 || filteredProducts.length === 0) {
    prevPageButton.style.display = "none";
    nextPageButton.style.display = "none";
  } else {
    prevPageButton.style.display = "block"; // Set to "block" to display the buttons
    nextPageButton.style.display = "block"; // Set to "block" to display the buttons
  }

  paginationContainer.appendChild(prevPageButton);

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

  paginationContainer.appendChild(nextPageButton);
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

const icon = document.querySelector(".menu-icon");
const menu = document.getElementById("right-menu");
const closeButton = document.getElementById("close-button");

function openMenu() {
  menu.classList.add("show");
}

function closeMenu() {
  menu.classList.remove("show");
}

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
    cardDiv.className = "col-lg-3 col-sm-6 ";

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
          <h6 class="card-title">${product.title}</h6>
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

noUiSlider.create(priceRangeSlider, {
  start: [0, findMaxPriceInLocalStorage()],
  connect: true,
  range: {
    min: 0,
    max: findMaxPriceInLocalStorage(),
  },
});

priceRangeSlider.noUiSlider.on("update", (values) => {
  const [minValue, maxValue] = values;
  priceRangeValue.textContent = `₹ ${minValue} - ₹ ${maxValue}`;

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

const priceRangeSlider1 = document.getElementById("price-range-slider1");
const priceRangeValue1 = document.getElementById("price-range-value1");

noUiSlider.create(priceRangeSlider1, {
  start: [0, findMaxPriceInLocalStorage()],
  connect: true,
  range: {
    min: 0,
    max: findMaxPriceInLocalStorage(),
  },
});

priceRangeSlider1.noUiSlider.on("update", (values) => {
  const [minValue, maxValue] = values;
  priceRangeValue1.textContent = `₹ ${minValue} - ₹ ${maxValue}`;

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

function findMaxPriceInLocalStorage() {
  const productsJSON = localStorage.getItem("products");

  if (productsJSON) {
    const products = JSON.parse(productsJSON);

    if (Array.isArray(products) && products.length > 0) {
      let maxPrice = products[0].price;

      for (const product of products) {
        if (product.price > maxPrice) {
          maxPrice = product.price;
        }
      }

      return maxPrice;
    }
  }
  return 100;
}

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

const categoryFilter = document.getElementById("CategoryFilter");
categoryFilter.addEventListener("change", filterProductsByCategory);

function populateCategoryCheckboxes1() {
  const categoryFilter1 = document.getElementById("CategoryFilter1");
  const categories = JSON.parse(localStorage.getItem("categories")) || [];

  categoryFilter1.innerHTML = "";

  categories.forEach((category) => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = category.name;
    checkbox.value = category.name;
    const label = document.createElement("label");
    label.htmlFor = category.name;
    label.textContent = category.name;

    categoryFilter1.appendChild(checkbox);
    categoryFilter1.appendChild(label);
  });
}

function filterProductsByCategory1() {
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
const categoryFilter1 = document.getElementById("CategoryFilter1");
categoryFilter1.addEventListener("change", filterProductsByCategory1);

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
populateCategoryCheckboxes1();
createProductCards(filteredProducts, productContainer, "Product added to cart");
displayProductsOnPage(filteredProducts, productContainer, currentPage);
updatePaginationUI(filteredProducts, paginationContainer);
