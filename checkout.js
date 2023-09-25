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
        <td><img src="${product.image}" alt="${product.title}" width="50" height="50"></td>
        <td>${product.title}</td>
        <td>${product.quantity}</td>
        <td>${totalItemPrice} ₹</td>
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
  }
});
