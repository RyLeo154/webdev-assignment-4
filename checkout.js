// JavaScript for Checkout Logic

// Retrieve cart from Local Storage
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

// Render the order summary (left column)
function renderOrderSummary() {
  const cart = getCart();
  const summaryDiv = document.getElementById('orderSummary');
  let html = '';
  if (cart.length === 0) {
    html = '<p>Your cart is empty.</p>';
  } else {
    html = `<table class="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price (RM)</th>
                  <th>Qty</th>
                  <th>Subtotal (RM)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>`;
    let total = 0;
    cart.forEach((item, index) => {
      const price = parseFloat(item.price);
      const quantity = parseInt(item.quantity);
      const subtotal = price * quantity;
      total += subtotal;
      html += `<tr data-index="${index}">
                <td>${item.name}</td>
                <td>${price.toFixed(2)}</td>
                <td>${quantity}</td>
                <td>${subtotal.toFixed(2)}</td>
                <td>
                  <button class="btn btn-danger btn-sm remove-item">Remove</button>
                </td>
              </tr>`;
    });
    html += `</tbody></table>`;
    document.getElementById('orderTotal').textContent = total.toFixed(2);
  }
  summaryDiv.innerHTML = html;

  // Attach event listeners for removal
  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', function() {
      const row = this.closest('tr');
      const index = parseInt(row.getAttribute('data-index'));
      removeItem(index);
    });
  });
}

function removeItem(index) {
  let cart = getCart();
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderOrderSummary();
}

// Enhanced Checkout Validation
function validateCheckout() {
  const name = document.getElementById('customerName').value.trim();
  const email = document.getElementById('customerEmail').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const address = document.getElementById('customerAddress').value.trim();
  const zip = document.getElementById('customerZip').value.trim();
  const state = document.getElementById('customerState').value;
  const cc = document.getElementById('customerCC').value.trim();

  // Basic required field validation
  if (!name || !email || !phone || !address || !zip || !state || !cc) {
    alert('Please fill in all required fields.');
    return false;
  }

  // Gender must be selected
  if (!document.querySelector('input[name="gender"]:checked')) {
    alert('Please select your gender.');
    return false;
  }

  // Email validation: "@" is not the first or last character and ends with ".com"
  if (email.indexOf('@') === 0 || email.lastIndexOf('@') === email.length - 1 || !email.endsWith('.com')) {
    alert('Please enter a valid email address that ends with ".com" and does not start or end with "@".');
    return false;
  }

  // Phone number validation: exactly 10 digits
  if (!/^\d{10}$/.test(phone)) {
    alert('Please enter a valid 10-digit phone number.');
    return false;
  }

  // Zip code validation: exactly 5 digits
  if (!/^\d{5}$/.test(zip)) {
    alert('Please enter a valid 5-digit zip code.');
    return false;
  }

  // Credit card validation: digits only, no special characters
  if (!/^\d+$/.test(cc)) {
    alert('Please enter a valid credit card number using digits only.');
    return false;
  }

  // Ensure the cart is not empty
  const cart = getCart();
  if (cart.length === 0) {
    alert('Your cart is empty. Please add items before checking out.');
    return false;
  }

  return true;
}

// Handle form submission
document.getElementById('checkoutForm').addEventListener('submit', function(e) {
  e.preventDefault();
  if (validateCheckout()) {
    const orderId = 'ORD-' + Math.floor(Math.random() * 1000000);
    document.getElementById('orderConfirmation').innerHTML = `<div class="alert alert-success">
      Order Confirmed! Your order ID is <strong>${orderId}</strong>. You will be redirected shortly.
    </div>`;
    localStorage.removeItem('cart');
    setTimeout(() => window.location.href = 'index.html', 3000);
  }
});

// Use window.onload to ensure all resources are loaded before rendering the order summary
window.onload = renderOrderSummary;

/* Inline Script to Save and Restore Checkout Data */
document.addEventListener("DOMContentLoaded", function() {
  // List of field IDs to auto-save
  const fields = ["customerName", "customerEmail", "customerPhone", "customerAddress", "customerZip", "customerState", "customerCC"];
  
  // Restore saved values from local storage
  fields.forEach(id => {
    const savedValue = localStorage.getItem("checkout_" + id);
    if (savedValue) {
      document.getElementById(id).value = savedValue;
    }
    // Save value on input event
    document.getElementById(id).addEventListener("input", function() {
      localStorage.setItem("checkout_" + id, this.value);
    });
  });
  
  // Handle gender radio buttons separately
  const genderRadios = document.querySelectorAll('input[name="gender"]');
  const savedGender = localStorage.getItem("checkout_gender");
  if (savedGender) {
    genderRadios.forEach(radio => {
      if (radio.value === savedGender) {
        radio.checked = true;
      }
    });
  }
  genderRadios.forEach(radio => {
    radio.addEventListener("change", function() {
      if (this.checked) {
        localStorage.setItem("checkout_gender", this.value);
      }
    });
  });
});
