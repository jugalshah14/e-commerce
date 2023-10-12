// Retrieve the product ID from the URL
const queryParams = new URLSearchParams(window.location.search);
const productId = Number(queryParams.get("id"));

// Retrieve the products array from local storage
const products = JSON.parse(localStorage.getItem("products")) || [];
// Find the product with the matching ID from the products array

const product = products.find((p) => p.id === productId);
const discountedPrice = Math.round(
  product ? product.price * (1 - product.discount / 100) : 0
);

// Display the product details on the page
const productDetailContainer = document.getElementById(
  "product-detail-container"
);
if (product) {
  let imagesHtml = "";
  product.image.forEach((imageUrl, index) => {
    imagesHtml += `
            <div class="carousel-item ${index === 0 ? "active" : ""}">
                <img src="${imageUrl}" alt="${product.title}">
            </div>
        `;
  });

  productDetailContainer.innerHTML = `
        <div class="container">
            <div id="product-detail-container" class="carousel slide btns" data-ride="carousel">
                <i class="fa fa-arrow-left" id="prevButton" aria-hidden="true"></i>
                <div class="carousel-inner">
                    ${imagesHtml}
                </div>
                <i class="fa fa-arrow-right" id="nextButton" aria-hidden="true"></i>
            </div>
            <div class="product-details">
            <div class="product-title">
                          <h2 class="card-title">${product.title}</h2>
                        </div>
                <del><p>Price: ₹ ${product.price}</p></del>
                <p>Discount: ₹ ${discountedPrice}</p>
                <p>Quantity: ${product.availableQuantity}</p>
                </div>
            <div class="mob-bottom">
                <p>Price : ₹ ${discountedPrice}</p>
                <a href="#" class="btn btn-primary addToCartBtn">Add To Cart</a>
            </div>
        </div>
    `;
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");

  // Add event listeners to the buttons
  prevButton.addEventListener("click", () => {
    const carousel = new bootstrap.Carousel(
      document.getElementById("product-detail-container")
    );
    carousel.prev();
  });

  nextButton.addEventListener("click", () => {
    // Trigger the carousel to move to the next image
    const carousel = new bootstrap.Carousel(
      document.getElementById("product-detail-container")
    );
    carousel.next();
  });
  const addToCartBtn = document.querySelector(".addToCartBtn");
  addToCartBtn.addEventListener("click", () => {
    addToCart(product, addToCartBtn, "Product added to cart", discountedPrice);
  });
} else {
  productDetailContainer.innerHTML = "<p>Product not found</p>";
}

function addToCart(product, button, customMessage, discountedPrice) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const isProductInCart = cart.some((item) => item.id === product.id);

  if (isProductInCart) {
    alert("This product is already in your cart.");
  } else {
    const cartItem = {
      ...product,
      discountedPrice: discountedPrice,
      quantity: 1,
    };

    cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(customMessage || "Product added to cart");

    button.disabled = true;
  }
}
