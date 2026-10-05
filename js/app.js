/**
 * SHINNAWI BY SONA — LUXURY COSMETICS ENGINE
 * Interactive shopping bag, quick view modal, product filtering, interactive shade experience.
 */

// 1. Curated 6 Lipsticks Master Archive
const PRODUCTS = [
  {
    id: 'velvet-dahlia',
    name: 'Velvet Dahlia',
    finish: 'Velvet Matte',
    price: 34,
    shade: 'Deep Plum Berry',
    undertone: 'Cool Berry',
    hex: '#5D1D34',
    tag: 'Bestseller',
    image: 'assets/images/velvet-dahlia.jpg',
    description: 'An intensely pigmented, dramatic plum berry with a cashmere-soft matte finish. Formulated with botanical seed oils to blur lip lines while providing weightless, 12-hour comfortable wear.',
    ingredients: 'Organic Camellia Oleifera Seed Oil, Shorea Robusta Resin, Hyaluronic Micro-Spheres, Candelilla Wax, French Peony Extract, Tocopherol (Vitamin E).',
    rating: 4.9,
    reviewsCount: 148
  },
  {
    id: 'silk-petal',
    name: 'Silk Petal',
    finish: 'Satin Sheen',
    price: 32,
    shade: 'Soft Rose Nude',
    undertone: 'Neutral Rose',
    hex: '#BD7677',
    tag: 'Daily Signature',
    image: 'assets/images/silk-petal.jpg',
    description: 'The quintessential "your lips but elevated" soft rosy nude. A buttery cushion of satin luminosity that melts into lips, providing instant plumping hydration and all-day radiance.',
    ingredients: 'Cold-Pressed Apricot Kernel Oil, Shea Butter, Rosehip Seed Oil, Wild Mango Wax, Plant Squalane, Vitamin E, Botanical Fragrance.',
    rating: 5.0,
    reviewsCount: 215
  },
  {
    id: 'sienna-dusk',
    name: 'Sienna Dusk',
    finish: 'Velvet Matte',
    price: 34,
    shade: 'Spiced Terracotta',
    undertone: 'Warm Earth',
    hex: '#A3513B',
    tag: "Editor's Choice",
    image: 'assets/images/sienna-dusk.jpg',
    description: 'A warm, sun-kissed terracotta rust that flatters every skin tone. Evoking Mediterranean sunsets with velvety pigment that never settles into dry patches or feathering.',
    ingredients: 'Pomegranate Sterols, Cold-Pressed Marula Oil, Jojoba Esters, Castor Seed Wax, Rosemary Leaf Extract, Natural Mineral Pigments.',
    rating: 4.8,
    reviewsCount: 94
  },
  {
    id: 'rouge-royale',
    name: 'Rouge Royale',
    finish: 'Velvet Matte',
    price: 36,
    shade: 'Iconic Parisian Crimson',
    undertone: 'True Blue-Red',
    hex: '#9E0E25',
    tag: 'Iconic Classic',
    image: 'assets/images/rouge-royale.jpg',
    description: 'A powerhouse crimson red with blue undertones designed to brighten your complexion and whiten your smile. One swipe delivers full-coverage Parisian couture elegance.',
    ingredients: 'Sustainably Sourced Babassu Oil, Organic Argan Oil, Carnauba Wax, Tripeptide Complex, Vitamin E, Iron Oxides.',
    rating: 4.9,
    reviewsCount: 312
  },
  {
    id: 'amber-mirage',
    name: 'Amber Mirage',
    finish: 'Luminous Satin',
    price: 32,
    shade: 'Caramel Honey Nude',
    undertone: 'Warm Golden',
    hex: '#C27E58',
    tag: 'Golden Hour Glow',
    image: 'assets/images/amber-mirage.jpg',
    description: 'Warm toasted caramel infused with microscopic multidimensional golden mineral pearls. Creates a glass-smooth, luminous lip effect with nourishing moisture.',
    ingredients: 'Pure Golden Jojoba Oil, Cacao Seed Butter, Mica Minerals, Sunflower Seed Wax, Aloe Barbadensis Leaf Extract, Natural Vanilla.',
    rating: 4.9,
    reviewsCount: 167
  },
  {
    id: 'midnight-wine',
    name: 'Midnight Wine',
    finish: 'Velvet Matte',
    price: 36,
    shade: 'Blackened Cherry Burgundy',
    undertone: 'Deep Cool Plum',
    hex: '#41131E',
    tag: 'Statement Noir',
    image: 'assets/images/midnight-wine.jpg',
    description: 'A luxurious blackened cherry burgundy for high-impact presence. Built with ultra-refined micronized pigments that glide effortlessly with velvet richness.',
    ingredients: 'Blackcurrant Seed Oil, Murumuru Butter, Ascorbyl Palmitate (Vitamin C), Rice Bran Wax, Evening Primrose Oil, Natural Mineral Clays.',
    rating: 4.9,
    reviewsCount: 126
  }
];

// 2. Shopping Bag / Cart State
const FREE_SHIPPING_THRESHOLD = 75;

function getCart() {
  try {
    const raw = localStorage.getItem('shinnawi_cart');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem('shinnawi_cart', JSON.stringify(cart));
  } catch (e) {}
  updateCartUI();
}

function addToCart(productId, quantity = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      shade: product.shade,
      finish: product.finish,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
  }

  saveCart(cart);
  openCartDrawer();
  showToast(`Added "${product.name}" to your bag`, '✨');
}

function updateCartQuantity(productId, delta) {
  let cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }
  saveCart(cart);
}

function removeFromCart(productId) {
  let cart = getCart();
  const item = cart.find(i => i.id === productId);
  cart = cart.filter(i => i.id !== productId);
  saveCart(cart);
  if (item) {
    showToast(`Removed "${item.name}" from your bag`);
  }
}

function updateCartUI() {
  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Update navbar badges
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = totalCount;
    el.classList.add('bump');
    setTimeout(() => el.classList.remove('bump'), 300);
  });

  // Update Cart Drawer Items
  const itemsContainer = document.getElementById('cartItemsContainer');
  const emptyState = document.getElementById('cartEmptyState');
  const cartFooter = document.getElementById('cartFooter');
  const subtotalEl = document.getElementById('cartSubtotal');
  const totalEl = document.getElementById('cartTotal');
  const shippingMeterText = document.getElementById('shippingMeterText');
  const shippingProgressBar = document.getElementById('shippingProgressBar');

  if (itemsContainer) {
    if (cart.length === 0) {
      if (emptyState) emptyState.style.display = 'flex';
      if (cartFooter) cartFooter.style.display = 'none';
      itemsContainer.innerHTML = '';
      if (shippingProgressBar) shippingProgressBar.style.width = '0%';
      if (shippingMeterText) shippingMeterText.textContent = `Add $${FREE_SHIPPING_THRESHOLD} for complimentary signature shipping`;
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (cartFooter) cartFooter.style.display = 'block';

    // Shipping meter progress
    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      if (shippingProgressBar) shippingProgressBar.style.width = '100%';
      if (shippingMeterText) shippingMeterText.innerHTML = `<strong>✨ You've unlocked complimentary signature shipping!</strong>`;
    } else {
      const remaining = (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2);
      const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
      if (shippingProgressBar) shippingProgressBar.style.width = `${pct}%`;
      if (shippingMeterText) shippingMeterText.textContent = `Add $${remaining} more for complimentary signature shipping`;
    }

    // Render Items
    itemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img class="cart-item-img" src="${item.image}" alt="${item.name}" />
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-shade">${item.shade} • ${item.finish}</div>
          <div class="cart-item-price">$${item.price}</div>
          <div class="cart-qty-ctrl">
            <button class="qty-btn" onclick="updateCartQuantity('${item.id}', -1)" aria-label="Decrease quantity">−</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn" onclick="updateCartQuantity('${item.id}', 1)" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="Remove">✕</button>
      </div>
    `).join('');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;
  }
}

// 3. Cart Drawer open/close
function openCartDrawer() {
  const overlay = document.getElementById('cartOverlay');
  const drawer = document.getElementById('cartDrawer');
  if (overlay && drawer) {
    overlay.classList.add('open');
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeCartDrawer() {
  const overlay = document.getElementById('cartOverlay');
  const drawer = document.getElementById('cartDrawer');
  if (overlay && drawer) {
    overlay.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// 4. Quick View Modal
function openQuickView(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('quickViewModal');
  const modalBody = document.getElementById('quickViewBody');
  if (!modal || !modalBody) return;

  modalBody.innerHTML = `
    <div class="modal-grid">
      <div class="modal-gallery">
        <img src="${product.image}" alt="${product.name}" />
      </div>
      <div class="modal-info">
        <span class="eyebrow">${product.finish}</span>
        <h2 class="section-title" style="font-size: 1.8rem; margin-bottom: 0.5rem;">${product.name}</h2>
        <div style="font-size: 1.3rem; font-family: var(--font-serif); font-weight: 600; color: var(--gold-dark); margin-bottom: 1rem;">
          $${product.price}.00
        </div>
        
        <div class="modal-shade-badge">
          <div class="swatch-circle" style="background: ${product.hex}; width: 22px; height: 22px;"></div>
          <div>
            <div style="font-size: 0.85rem; font-weight: 600;">Shade: ${product.shade}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${product.undertone} undertone</div>
          </div>
        </div>

        <p class="modal-desc">${product.description}</p>

        <div style="display: flex; gap: 1rem; align-items: center; margin-top: 1rem;">
          <button class="btn btn-primary btn-full" onclick="addToCart('${product.id}'); closeQuickView();">
            Add to Bag — $${product.price}.00
          </button>
        </div>

        <div class="modal-ingredients">
          <strong>Key Botanical Ingredients:</strong><br>
          ${product.ingredients}
        </div>
      </div>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeQuickView() {
  const modal = document.getElementById('quickViewModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// 5. Toast Notifications
function showToast(message, icon = '✓') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// 6. Interactive Shade Experience (Home Page)
function initShadeExperience() {
  const selectorItems = document.querySelectorAll('.swatch-interactive-item');
  const previewImg = document.getElementById('interactiveShadeImg');
  const previewTitle = document.getElementById('interactiveShadeTitle');
  const previewSubtitle = document.getElementById('interactiveShadeSubtitle');
  const previewBtn = document.getElementById('interactiveShadeBtn');

  if (!selectorItems.length || !previewImg) return;

  selectorItems.forEach(item => {
    item.addEventListener('click', () => {
      selectorItems.forEach(el => el.classList.remove('active'));
      item.classList.add('active');

      const id = item.getAttribute('data-id');
      const product = PRODUCTS.find(p => p.id === id);
      if (!product) return;

      previewImg.style.opacity = '0';
      setTimeout(() => {
        previewImg.src = product.image;
        previewImg.alt = product.name;
        previewImg.style.opacity = '1';
      }, 200);

      if (previewTitle) previewTitle.textContent = product.name;
      if (previewSubtitle) previewSubtitle.textContent = `${product.shade} • ${product.finish}`;
      if (previewBtn) {
        previewBtn.onclick = () => addToCart(product.id);
      }
    });
  });
}

// 7. Product Catalog Filter & Sort (Products Page)
function renderProductGrid(items = PRODUCTS) {
  const grid = document.getElementById('productsCatalogGrid');
  if (!grid) return;

  grid.innerHTML = items.map(product => `
    <div class="product-card" data-finish="${product.finish}">
      <div class="product-media">
        <span class="product-tag">${product.tag}</span>
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <button class="product-quick-btn" onclick="openQuickView('${product.id}')">Quick View</button>
      </div>
      <div class="product-info">
        <div class="product-finish">${product.finish}</div>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-shade-desc">${product.description.substring(0, 85)}...</p>
        
        <div class="product-swatch-row">
          <div class="swatch-display">
            <span class="swatch-circle" style="background-color: ${product.hex};"></span>
            <span class="swatch-name">${product.shade}</span>
          </div>
          <div class="product-price">$${product.price}</div>
        </div>

        <div class="product-actions-row">
          <button class="btn btn-primary btn-full btn-sm" onclick="addToCart('${product.id}')">
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function initCatalogFilters() {
  const filterPills = document.querySelectorAll('.filter-pill');
  const sortSelect = document.getElementById('sortSelect');
  if (!filterPills.length) return;

  let currentFilter = 'all';

  function applyFiltersAndSort() {
    let result = [...PRODUCTS];

    if (currentFilter !== 'all') {
      result = result.filter(p => p.finish.toLowerCase().includes(currentFilter.toLowerCase()));
    }

    if (sortSelect) {
      const sortVal = sortSelect.value;
      if (sortVal === 'price-low') {
        result.sort((a, b) => a.price - b.price);
      } else if (sortVal === 'price-high') {
        result.sort((a, b) => b.price - a.price);
      } else if (sortVal === 'name') {
        result.sort((a, b) => a.name.localeCompare(b.name));
      }
    }

    renderProductGrid(result);
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.getAttribute('data-filter') || 'all';
      applyFiltersAndSort();
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener('change', applyFiltersAndSort);
  }
}

// 8. Contact Form Handling
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = 'Sending to Sona & Team...';

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = 'Message Sent with Love';
      btn.classList.add('btn-gold');
      showToast('Thank you! Sona’s concierge will reply within 24 hours.', '💌');
      form.reset();
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('btn-gold');
      }, 4000);
    }, 1200);
  });
}

// 9. FAQ Accordion
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        items.forEach(i => i.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });
}

// 10. Mobile Menu and Header scroll
function initNavigation() {
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  const header = document.querySelector('.site-header');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('mobile-open');
    });
  }

  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCartDrawer();
      closeQuickView();
    }
  });
}

// 11. Checkout Simulation
function simulateCheckout() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast('Your bag is currently empty.');
    return;
  }
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  closeCartDrawer();
  
  // Show VIP checkout modal / alert
  const modal = document.getElementById('quickViewModal');
  const modalBody = document.getElementById('quickViewBody');
  if (modal && modalBody) {
    modalBody.innerHTML = `
      <div style="padding: 3rem 2rem; text-align: center; max-width: 520px; margin: 0 auto;">
        <span class="eyebrow">VIP Order Simulation</span>
        <h2 class="section-title" style="font-size: 2rem; margin: 0.5rem 0 1rem;">Thank you for your order!</h2>
        <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem;">
          Your order for <strong>$${total.toFixed(2)}</strong> has been simulated. In a live environment, your lipstick collection would now be wrapped in Shinnawi’s custom gold-embossed box and prepared with personalized handwritten notes.
        </p>
        <div style="background: var(--bg-secondary); padding: 1.25rem; border-radius: 8px; margin-bottom: 2rem; text-align: left; font-size: 0.85rem;">
          <div><strong>Items Ordered:</strong> ${cart.map(i => `${i.name} (x${i.quantity})`).join(', ')}</div>
          <div style="margin-top: 0.5rem;"><strong>Shipping:</strong> Complimentary Shinnawi Signature Courier</div>
        </div>
        <button class="btn btn-primary" onclick="localStorage.removeItem('shinnawi_cart'); updateCartUI(); closeQuickView();">
          Continue Shopping
        </button>
      </div>
    `;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
  initNavigation();
  initShadeExperience();
  initCatalogFilters();
  initContactForm();
  initFAQ();

  // If on products page and grid exists, render initial grid
  const catalogGrid = document.getElementById('productsCatalogGrid');
  if (catalogGrid) {
    renderProductGrid();
  }

  // Newsletter form handlers
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      if (input && input.value) {
        showToast(`Welcome to the Shinnawi VIP Circle! Check your inbox for your 15% code.`, '🎁');
        input.value = '';
      }
    });
  });
});
