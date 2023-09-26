document.addEventListener("DOMContentLoaded", () => {
  const checkoutDetails = document.getElementById("checkout-details");
  const placeOrderButton = document.getElementById("place-order-button");
  const shippingInfoForm = document.getElementById("shipping-info-form");

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    checkoutDetails.innerHTML = "<p>Your cart is empty.</p>";
  } else {
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

    let totalPrice = 0;

    cart.forEach((product) => {
      const row = document.createElement("tr");
      const totalItemPrice =
        parseFloat(product.discountedPrice) * parseInt(product.quantity);
      row.innerHTML = `
                <td><img src="${product.image}" alt="${
        product.title
      }" width="50" height="50"></td>
                <td>${product.title}</td>
                <td>${product.quantity}</td>
                <td>${totalItemPrice.toFixed(2)} ₹</td>
              `;
      tbody.appendChild(row);

      totalPrice += totalItemPrice;
    });

    const totalPriceCell = table.querySelector("#total-price");
    totalPriceCell.textContent = `${totalPrice.toFixed(2)} ₹`;

    checkoutDetails.appendChild(table);

    placeOrderButton.addEventListener("click", (event) => {
      event.preventDefault();

      const shippingInfo = {
        first_name: document.getElementById("first_name").value,
        last_name: document.getElementById("last_name").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        zip: document.getElementById("zip").value,
      };

      // Check if any of the fields are empty
      if (Object.values(shippingInfo).some((value) => value.trim() === "")) {
        alert("Please fill in all fields.");
      } else {
        // Store shipping information in local storage
        localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));

        // Create and display a dialog box with the shipping information
        const shippingInfoDialog = `
                            <div class="modal fade" id="shipping-info-dialog" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog" role="document">
                                    <div class="modal-content">
                                        <!-- Modal content here -->
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLabel">Shipping Information</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                            <p>Name : ${shippingInfo.first_name} ${shippingInfo.last_name}</p>
                                            <p>E-Mail : ${shippingInfo.email}</p>
                                            <p>Address : ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.zip}</p>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-success" data-dismiss="modal">Confirm</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;

        document.body.insertAdjacentHTML("beforeend", shippingInfoDialog);

        // Show the modal
        $("#shipping-info-dialog").modal("show");
      }
    });
  }
});
