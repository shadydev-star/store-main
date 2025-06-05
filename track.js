document.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('.js-main');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const orderDateRaw = localStorage.getItem('orderDate');

  main.innerHTML = '';

  if (!orderDateRaw) {
    main.innerHTML = '<p>No order placed yet.</p>';
    return;
  }

  const orderDate = new Date(orderDateRaw);
  const deliveryDate = new Date(orderDate.getTime() + 60 * 1000); // 1 minute delivery for test
  const today = new Date();

  if (!cart.length) {
    main.innerHTML = '<p>No products to track.</p>';
    return;
  }

  const elapsedMs = today - orderDate;
  const totalMs = 60 * 1000; // 1 minute
  const progressPercent = Math.min((elapsedMs / totalMs) * 100, 100);

  let status = 'Preparing';
  if (progressPercent >= 100) status = 'Delivered';
  else if (progressPercent >= 50) status = 'Shipped';

  cart.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return;

    const progressLabels = `
      <div class="progress-labels-container">
        <div class="progress-label ${status === 'Preparing' ? 'current-status' : ''}">Preparing</div>
        <div class="progress-label ${status === 'Shipped' ? 'current-status' : ''}">Shipped</div>
        <div class="progress-label ${status === 'Delivered' ? 'current-status' : ''}">Delivered</div>
      </div>
    `;

    const productHTML = `
      <div class="prod-con">
        <div class="delivery-date">Arriving at ${deliveryDate.toLocaleTimeString()}</div>
        <div class="prod-name">${product.name}</div>
        <div class="prod-quantity">Quantity: ${item.quantity}</div>
        <div class="prod-img-con">
          <img class="prod-img" src="${product.image}" alt="${product.name}">
        </div>
        ${progressLabels}
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${progressPercent}%;"></div>
        </div>
        <p class="delivery-eta">
          ${progressPercent >= 100
            ? '<strong>Arriving now</strong>'
            : `Estimated delivery in <strong>${Math.ceil((totalMs - elapsedMs) / 1000)} second(s)</strong>`}
        </p>
      </div>
    `;

    main.insertAdjacentHTML('beforeend', productHTML);
  });
});
