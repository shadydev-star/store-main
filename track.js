document.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('.js-main');
  const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];

  main.innerHTML = '';

  if (orderHistory.length === 0) {
    main.innerHTML = '<p>No orders to track yet.</p>';
    return;
  }

  const totalMs = 60 * 1000; // 1-minute delivery window for test

  orderHistory.forEach(order => {
    const product = products.find(p => p.id === order.productId);
    if (!product) return;

    const orderDate = new Date(order.orderDate);
    const deliveryDate = new Date(orderDate.getTime() + totalMs);
    const now = new Date();

    const elapsedMs = now - orderDate;
    const progressPercent = Math.min((elapsedMs / totalMs) * 100, 100);

    let status = 'Preparing';
    if (progressPercent >= 100) status = 'Delivered';
    else if (progressPercent >= 50) status = 'Shipped';

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
        <div class="prod-quantity">Quantity: ${order.quantity}</div>
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
