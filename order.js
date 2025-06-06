document.addEventListener('DOMContentLoaded', () => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartContainer = document.getElementById('grid-sec');

  function updateCartQuantity() {
    const quantity = cart.reduce((total, item) => total + item.quantity, 0);
    const quantityElements = document.querySelectorAll('.js-cart-quantity');
    quantityElements.forEach(element => {
      element.textContent = quantity;
    });
  }

  function renderCart() {
    cartContainer.innerHTML = '';

    if (cart.length === 0) return;

    const now = new Date();
    const orderDateStr = now.toLocaleDateString();
    const deliveryDate = new Date(now.getTime() + 60 * 1000); // 1-minute delivery time (for testing)
    const deliveryDateStr = deliveryDate.toLocaleDateString();

    cart.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return;

      const itemElement = document.createElement('div');
      itemElement.className = 'grid-sec';
      itemElement.innerHTML = `
        <div id="cart-section">
          <div class="order-con">
            <div class="img-con">
              <img class="order-img" src="${product.image}" alt="${product.name}">
            </div> 
          </div>

          <div class="track-con">
            <div class="tracking-con">
              <div>
                <p class="deliv-date">Order-date:</p>
                <p class="date">${orderDateStr}</p>
              </div>
              <div>
                <p class="deliv-date">Delivery-date:</p>
                <p class="date">${deliveryDateStr}</p>
              </div>
            </div>
          </div>

          <div class="track-btn-con">
            <button class="place-order-btn">Place Order</button>
            <a href="tracking.html" style="display: none;">
              <button class="track-btn">Track Package</button>
            </a>
          </div>
        </div>
      `;

      cartContainer.appendChild(itemElement);
    });
  }

  renderCart();
  updateCartQuantity();

  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('place-order-btn')) {
      const now = new Date();
      let orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];

      cart.forEach(item => {
        orderHistory.push({
          productId: item.productId,
          quantity: item.quantity,
          orderDate: now.toISOString()
        });
      });

      localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
      localStorage.removeItem('cart');

      const container = event.target.closest('.track-btn-con');
      container.innerHTML = '<p><strong>Placing order... Redirecting to tracking...</strong></p>';

      setTimeout(() => {
        window.location.href = 'tracking.html';
      }, 1500); // 1.5 sec delay
    }
  });

  window.addEventListener('storage', () => {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    renderCart();
    updateCartQuantity();
  });
});
