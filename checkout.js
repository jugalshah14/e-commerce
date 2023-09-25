document.addEventListener("DOMContentLoaded", () => {
  const checkoutDetails = document.getElementById("checkout-details");

  // Retrieve cart data from local storage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if the cart is empty
  if (cart.length === 0) {
    checkoutDetails.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    // Create a table to display cart items
    const table = document.createElement("table");
    table.className = "table";
    table.innerHTML = `
              <thead>
                <tr>
                  <th>Product Image</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
             
              </tbody>
              <tfoot>
                <tr>
                  <td></td>
                  <td></td>
                  <td><b>Total Price:</b></td>
                  <td id="total-price"><b> ₹</b></td>
                </tr>
              </tfoot>
            `;

    const tbody = table.querySelector("tbody");

    // Initialize total price to 0
    let totalPrice = 0;

    // Populate the table with cart items and calculate the total price
    cart.forEach((product) => {
      const row = document.createElement("tr");
      const totalItemPrice = product.discountedPrice * product.quantity;
      row.innerHTML = `
                <td><img src="${product.image}" alt="${
        product.title
      }" width="50" height="50"></td>
                <td>${product.title}</td>
                <td>${product.quantity}</td>
                <td>${totalItemPrice.toFixed(2)} ₹</td>
              `;
      tbody.appendChild(row);

      // Add the total price for this item to the overall total price
      totalPrice += totalItemPrice;
    });

    // Display the total price in the table footer
    const totalPriceCell = table.querySelector("#total-price");
    totalPriceCell.textContent = `${totalPrice.toFixed(2)} ₹`;

    // Append the table to the checkout-details div
    checkoutDetails.appendChild(table);

    // Add an event listener to the "Place Order" button
    const placeOrderButton = document.getElementById("place-order-button");
    placeOrderButton.addEventListener("click", () => {
      // Retrieve and display shipping information from the form
      const shippingInfo = {
        first_name: document.getElementById("first_name").value,
        last_name: document.getElementById("last_name").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        zip: document.getElementById("zip").value,
      };

      // Store shipping information in local storage
      localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));

      // Create and display a dialog box with the shipping information
      const shippingInfoDialog = `
                <div class="modal fade" id="shipping-info-dialog" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Shipping Information</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        <p>Name : ${shippingInfo.first_name} ${shippingInfo.last_name}</p>
                        <p>E-Mail : ${shippingInfo.email}</p>
                        <p>Address : ${shippingInfo.address} , ${shippingInfo.city} , ${shippingInfo.zip}</p>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Conform</button>
                      </div>
                    </div>
                  </div>
                </div>
              `;
      document.body.insertAdjacentHTML("beforeend", shippingInfoDialog);
      $("#shipping-info-dialog").modal("show");
    });
  }
});
