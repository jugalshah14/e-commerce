const queryParams = new URLSearchParams(window.location.search);
const productId = Number(queryParams.get("id"));

const products = JSON.parse(localStorage.getItem("products")) || [];

const product = products.find((p) => p.id === productId);
const discountedPrice = Math.round(
  product ? product.price * (1 - product.discount / 100) : 0
);

const productDetailContainer = document.getElementById(
  "product-detail-container"
);
if (product) {
  let imagesHtml = "";
  product.image.forEach((imageUrl, index) => {
    imagesHtml += `
                <img src="${imageUrl}" alt="${product.title}">
        `;
  });

  productDetailContainer.innerHTML = `
    <div class="container">
      <div class="product-detail-container">
        <div class="product-images">
         <div class="buttons">
              <ion-icon class="prev" data-role="none" aria-label="previous" name="chevron-back-outline"></ion-icon>
              <ion-icon class="next" data-role="none" aria-label="next" name="chevron-forward-outline"></ion-icon>
          </div>
          <div class="slider-for">
          </div>
          <div class="slider-nav">
          </div>
        </div>
        <div class="product-details">
          <div class="product-title">
            <h2 class="card-title">${product.title}</h2>
          </div>
          <p><b>${product.category}</b></p>
          <p class="desc">${product.description}</P>
          <div class="price">
          <del><p> ₹ ${product.price}</p></del>
          <p> ₹ ${discountedPrice}</p>
          </div>
          <div class="quantity">
          <p>Quantity: ${product.availableQuantity}</p>
          </div>
          <a href="#" class="btn btn-primary addToCartBtn">Add To Cart</a>
        </div>
        <div class="mob-bottom">
          <p>Price : ₹ ${discountedPrice}</p>
          <a href="#" class="btn btn-primary addToCartBtn">Add To Cart</a>
        </div>
      </div>
    </div>
    `;

  const addToCartBtn = document.querySelector(".addToCartBtn");
  addToCartBtn.addEventListener("click", () => {
    addToCart(product, addToCartBtn, "Product added to cart", discountedPrice);
  });
} else {
  productDetailContainer.innerHTML = "<p>Product not found</p>";
}

const productImagesContainer = document.querySelector(".slider-for");
const productThumbnailsContainer = document.querySelector(".slider-nav");

if (product) {
  product.image.forEach((imageUrl, index) => {
    const imageSlide = document.createElement("div");
    imageSlide.innerHTML = `<img src="${imageUrl}" alt="${product.title}">`;
    productImagesContainer.appendChild(imageSlide);

    const thumbnailSlide = document.createElement("div");
    thumbnailSlide.innerHTML = `<img src="${imageUrl}" alt="${product.title}">`;
    productThumbnailsContainer.appendChild(thumbnailSlide);
  });
}

var $jq = jQuery.noConflict();
$jq(document).ready(function () {
  $(".slider-for").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    centerMode: true,
    asNavFor: ".slider-nav",
  });

  $(".slider-nav").slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: ".slider-for",
    dots: false,
    arrows: false,
    centerMode: true,
    focusOnSelect: true,
  });
});
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");

prev.addEventListener("click", () => {
  $(".slider-for").slick("slickPrev");
});
next.addEventListener("click", () => {
  $(".slider-for").slick("slickNext");
});

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
