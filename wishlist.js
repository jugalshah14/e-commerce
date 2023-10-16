function displayWishlistItems() {
  const wishlistContainer = document.getElementById("wishlist-container");
  const noWishlistImage = document.getElementById("no-wishlist-image");
  wishlistContainer.innerHTML = "";

  const wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || [];

  if (wishlistItems.length === 0) {
    noWishlistImage.style.display = "block"; // Show the "No Wishlist Items" image
    return;
  }

  noWishlistImage.style.display = "none"; // Hide the "No Wishlist Items" image

  let row = document.createElement("div");
  row.className = "row";

  wishlistItems.forEach((item, index) => {
    if (index % 4 === 0 && index !== 0) {
      wishlistContainer.appendChild(row);
      row = document.createElement("div");
      row.className = "row";
    }

    const originalPrice = item.price;
    const discountedPrice = Math.round(item.price * (1 - item.discount / 100));

    const card = document.createElement("div");
    card.className = "col-lg-3 col-md-6 col-sm-6";

    card.setAttribute("data-product-id", item.id);

    card.innerHTML = `
      <div class="card">
        <div class="discount-badge">${item.discount}% Off</div>
        <div class="wishlist-badge">
        <ion-icon name="heart"></ion-icon>
      </div>
        <img src="${item.image[0]}" class="card-img-top">
        <div class="card-body">
          <p class="category-show">${item.category}</p>
          <div class="product-title">
            <h5 class="card-title">${item.title}</h5>
          </div>
          <p class="card-text">
            <b> ₹ ${discountedPrice}</b> &nbsp; <del style="color:rgb(191,191,191)" > ₹${originalPrice}</del>
          </p>
        </div>
      </div>
    `;
    const wishlistIcon = card.querySelector(".wishlist-badge");
    wishlistIcon.addEventListener("click", () => {
      wishlistItems.splice(index, 1);

      localStorage.setItem("wishlist", JSON.stringify(wishlistItems));

      displayWishlistItems();
    });

    row.appendChild(card);
  });

  if (row.children.length > 0) {
    wishlistContainer.appendChild(row);
  }
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

window.addEventListener("load", displayWishlistItems);
displayWishlistItems();
