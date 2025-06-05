document.addEventListener('DOMContentLoaded', () => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartContainer = document.getElementById('grid-sec');

  function formatPrice(cents) {
    return `$${(cents / 100).toFixed(2)}`;
  }

  function updateCartQuantity() {
    const quantity = cart.reduce((total, item) => total + item.quantity, 0);
    const quantityElements = document.querySelectorAll('.js-cart-quantity');
    quantityElements.forEach(element => {
      element.textContent = quantity;
    });
  }

  function renderCart() {
    cartContainer.innerHTML = '';
    if (cart.length === 0) {
      cartContainer.innerHTML = '<p>Your cart is empty!</p>';
      return;
    }

    const orderDateRaw = localStorage.getItem('orderDate');
    const orderDate = orderDateRaw ? new Date(orderDateRaw) : null;
    const currentDate = orderDate ? orderDate.toISOString().split('T')[0] : 'Not placed';
    const deliveryDate = orderDate
      ? new Date(orderDate.getTime() + 60 * 1000).toISOString().split('T')[0]
      : 'Pending';

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
                <label>
                  <p class="deliv-date">Order-date:</p>
                  <input type="radio" name="order-date" id="option">
                  <p class="date">${currentDate}</p>
                </label>
              </div>
              <div>
                <label>
                  <p class="deliv-date">Delivery-date:</p>
                  <input type="radio" id="option" name="delivery-date">
                  <p class="date">${deliveryDate}</p>
                </label>
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

  // Handle Place Order click
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('place-order-btn')) {
      const now = new Date();
      localStorage.setItem('orderDate', now.toISOString());

      const container = event.target.closest('.track-btn-con');
      const placeBtn = container.querySelector('.place-order-btn');
      const trackBtnLink = container.querySelector('a');

      placeBtn.style.display = 'none';
      trackBtnLink.style.display = 'inline-block';

      alert('Order placed!');
    }
  });

  window.addEventListener('storage', () => {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    renderCart();
    updateCartQuantity();
  });
});
