// HEADER ELEMENTS
const searchForm = document.querySelector('.search-form');
const searchBtn = document.querySelector('#search-btn');
const cartItem = document.querySelector('.cart-items-container');
const cartBtn = document.querySelector('#cart-btn');
const navbar = document.querySelector('.navbar');
const menuBtn = document.querySelector('#menu-btn');
const themeBtn = document.querySelector('#theme-btn');

// SEARCH TOGGLE
if (searchBtn && searchForm) {
  searchBtn.addEventListener('click', () => {
    searchForm.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!e.composedPath().includes(searchBtn) && !e.composedPath().includes(searchForm)) {
      searchForm.classList.remove('active');
    }
  });
}

// CART TOGGLE
if (cartBtn && cartItem) {
  cartBtn.addEventListener('click', () => {
    cartItem.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!e.composedPath().includes(cartBtn) && !e.composedPath().includes(cartItem)) {
      cartItem.classList.remove('active');
    }
  });
}

// NAVBAR TOGGLE
if (menuBtn && navbar) {
  menuBtn.addEventListener('click', () => {
    navbar.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!e.composedPath().includes(navbar) && !e.composedPath().includes(menuBtn)) {
      navbar.classList.remove('active');
    }
  });
}

// THEME TOGGLE (DARK / LIGHT)
const applyTheme = (theme) => {
  if (theme === 'light') {
    document.body.classList.add('light-theme');
    if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
  } else {
    document.body.classList.remove('light-theme');
    if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
  }
};

const storedTheme = localStorage.getItem('juice-shop-theme') || 'dark';
applyTheme(storedTheme);

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const newTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
    localStorage.setItem('juice-shop-theme', newTheme);
    applyTheme(newTheme);
  });
}

// SIMPLE CART LOGIC WITH INR -> USD CONVERSION
const cartListEl = document.querySelector('.cart-items-list');
const cartCountEl = document.querySelector('#cart-items-count');
const cartTotalInrEl = document.querySelector('#cart-total-inr');
const cartTotalUsdEl = document.querySelector('#cart-total-usd');
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

// Approximate conversion rate (you can change this)
const INR_PER_USD = 83;

let cartItems = [];

const formatINR = (value) => `₹${value.toFixed(2)}`;
const formatUSD = (value) => `$${value.toFixed(2)}`;

const renderCart = () => {
  if (!cartListEl) return;

  cartListEl.innerHTML = '';

  let totalInr = 0;
  cartItems.forEach((item, index) => {
    totalInr += item.price;

    const row = document.createElement('div');
    row.className = 'cart-item-row';

    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatINR(item.price)}</div>
      </div>
      <div class="cart-item-remove" data-index="${index}">&times;</div>
    `;

    cartListEl.appendChild(row);
  });

  const totalUsd = totalInr / INR_PER_USD;

  if (cartCountEl) cartCountEl.textContent = cartItems.length.toString();
  if (cartTotalInrEl) cartTotalInrEl.textContent = formatINR(totalInr);
  if (cartTotalUsdEl) cartTotalUsdEl.textContent = formatUSD(totalUsd);

  const removeBtns = document.querySelectorAll('.cart-item-remove');
  removeBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const idx = Number(e.target.getAttribute('data-index'));
      cartItems.splice(idx, 1);
      renderCart();
    });
  });
};

addToCartBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const name = btn.getAttribute('data-name') || 'Juice';
    const price = Number(btn.getAttribute('data-price') || '0');
    const image = btn.getAttribute('data-image') || './image/default.png';

    cartItems.push({ name, price, image });
    renderCart();
    if (cartItem) cartItem.classList.add('active');
  });
});
