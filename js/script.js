// Modern Inventory Management System Script

// Interactive UI Enhancements
class UIEnhancements {
  constructor() {
    this.init();
  }

  init() {
    this.setupSmoothScrolling();
    this.setupKeyboardShortcuts();
    this.setupFormEnhancements();
    this.setupLoadingStates();
    this.setupToastNotifications();
    this.setupAutoSave();
    this.setupAnimations();
  }

  // Smooth scrolling for anchor links
  setupSmoothScrolling() {
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  // Keyboard shortcuts
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + S to save forms
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        this.saveCurrentForm();
      }

      // Ctrl/Cmd + / to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        const searchInput = $('.search-bar input');
        if (searchInput) searchInput.focus();
      }

      // Escape to close modals or clear focus
      if (e.key === 'Escape') {
        this.closeActiveModal();
        document.activeElement.blur();
      }
    });
  }

  // Enhanced form interactions
  setupFormEnhancements() {
    // Auto-resize textareas
    $all('textarea').forEach(textarea => {
      textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
      });
    });

    // Form validation feedback
    $all('form').forEach(form => {
      $all('input, select, textarea', form).forEach(field => {
        field.addEventListener('blur', () => {
          this.validateField(field);
        });

        field.addEventListener('input', () => {
          if (field.classList.contains('invalid')) {
            this.validateField(field);
          }
        });
      });
    });

    // Enhanced select dropdowns
    $all('select').forEach(select => {
      select.addEventListener('change', () => {
        this.animateSelectChange(select);
      });
    });
  }

  // Loading states for async operations
  setupLoadingStates() {
    // Add loading class to buttons during form submission
    document.addEventListener('submit', (e) => {
      const submitBtn = e.target.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading"></span> Processing...';

        // Remove loading state after 3 seconds (fallback)
        setTimeout(() => {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
          submitBtn.innerHTML = submitBtn.getAttribute('data-original-text') || 'Submit';
        }, 3000);
      }
    });
  }

  // Toast notification system
  setupToastNotifications() {
    this.toastContainer = document.createElement('div');
    this.toastContainer.className = 'toast-container';
    this.toastContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      pointer-events: none;
    `;
    document.body.appendChild(this.toastContainer);
  }

  // Auto-save functionality
  setupAutoSave() {
    let autoSaveTimer;
    const autoSaveDelay = 2000; // 2 seconds

    $all('input, textarea, select').forEach(field => {
      field.addEventListener('input', () => {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(() => {
          if (localStorage.getItem('autoSaveEnabled') !== 'false') {
            this.showToast('Draft saved automatically', 'info');
          }
        }, autoSaveDelay);
      });
    });
  }

  // Page animations
  setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    }, observerOptions);

    // Observe elements with animation classes
    $all('.card, .section, .stat-card').forEach(el => {
      el.style.animationPlayState = 'paused';
      observer.observe(el);
    });
  }

  // Utility methods
  validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');

    field.classList.remove('invalid', 'valid');

    if (isRequired && !value) {
      field.classList.add('invalid');
      this.showFieldError(field, 'This field is required');
    } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
      field.classList.add('invalid');
      this.showFieldError(field, 'Please enter a valid email');
    } else if (field.type === 'number' && value && isNaN(value)) {
      field.classList.add('invalid');
      this.showFieldError(field, 'Please enter a valid number');
    } else if (value) {
      field.classList.add('valid');
      this.clearFieldError(field);
    }
  }

  showFieldError(field, message) {
    let errorEl = field.parentNode.querySelector('.field-error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'field-error';
      errorEl.style.cssText = `
        color: var(--danger-color);
        font-size: 12px;
        margin-top: 4px;
        animation: fadeIn 0.3s ease;
      `;
      field.parentNode.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }

  clearFieldError(field) {
    const errorEl = field.parentNode.querySelector('.field-error');
    if (errorEl) {
      errorEl.remove();
    }
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  animateSelectChange(select) {
    select.style.transform = 'scale(0.98)';
    setTimeout(() => {
      select.style.transform = 'scale(1)';
    }, 150);
  }

  saveCurrentForm() {
    const activeForm = document.activeElement.closest('form');
    if (activeForm) {
      // Trigger form validation
      const isValid = activeForm.checkValidity();
      if (isValid) {
        this.showToast('Form data saved successfully!', 'success');
      } else {
        this.showToast('Please fill in all required fields', 'error');
      }
    }
  }

  closeActiveModal() {
    // Close any open modals (if implemented)
    const modals = $all('.modal.active');
    modals.forEach(modal => modal.classList.remove('active'));
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
      background: white;
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border-left: 4px solid var(--${type}-color);
      animation: slideInRight 0.3s ease;
      pointer-events: auto;
      cursor: pointer;
      max-width: 300px;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    `;

    const icon = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    }[type] || 'ℹ️';

    toast.innerHTML = `${icon} ${message}`;

    this.toastContainer.appendChild(toast);

    // Auto remove after 4 seconds
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);

    // Click to dismiss
    toast.addEventListener('click', () => {
      toast.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    });
  }
}

// Initialize UI enhancements
const uiEnhancements = new UIEnhancements();

// DOM Helpers
function $(selector) {
  return document.querySelector(selector);
}

function $all(selector) {
  return Array.from(document.querySelectorAll(selector));
}

// LocalStorage Helpers
function parseJSON(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function getStorage(key, fallback) {
  return parseJSON(localStorage.getItem(key), fallback);
}

function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Data Generation
function generateId() {
  return 'id_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
}

function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleString();
}

// Authentication
function isLoggedIn() {
  return localStorage.getItem('loggedIn') === 'true';
}

function setLoggedIn(value) {
  localStorage.setItem('loggedIn', value ? 'true' : 'false');
}

function logout() {
  setLoggedIn(false);
  window.location.href = 'login.html';
}

// Sidebar Management
function initSidebar(page) {
  const sidebar = $('#sidebar');
  const sidebarToggle = $('#sidebarToggle');
  const sidebarToggleMobile = $('#sidebarToggleMobile');

  // Set active page
  $all('.sidebar a').forEach((link) => {
    if (link.dataset.page === page) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Toggle sidebar
  function toggleSidebar() {
    sidebar.classList.toggle('collapsed');
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', toggleSidebar);
  }

  if (sidebarToggleMobile) {
    sidebarToggleMobile.addEventListener('click', toggleSidebar);
  }
}

// Header Management
function initHeader() {
  $all('[data-logout]').forEach((btn) => {
    btn.addEventListener('click', logout);
  });
}

// Data Management
function getProducts() {
  return getStorage('products', []);
}

function saveProducts(products) {
  setStorage('products', products);
}

function getCategories() {
  return getStorage('categories', []);
}

function saveCategories(categories) {
  setStorage('categories', categories);
}

function getSuppliers() {
  return getStorage('suppliers', []);
}

function saveSuppliers(suppliers) {
  setStorage('suppliers', suppliers);
}

function getCustomers() {
  return getStorage('customers', []);
}

function saveCustomers(customers) {
  setStorage('customers', customers);
}

function getPurchases() {
  return getStorage('purchases', []);
}

function savePurchases(purchases) {
  setStorage('purchases', purchases);
}

function getSales() {
  return getStorage('sales', []);
}

function saveSales(sales) {
  setStorage('sales', sales);
}

function getWarehouses() {
  return getStorage('warehouses', []);
}

function saveWarehouses(warehouses) {
  setStorage('warehouses', warehouses);
}

function getHistory() {
  return getStorage('history', []);
}

function saveHistory(history) {
  setStorage('history', history);
}

function addHistory(entry) {
  const history = getHistory();
  // Add previous and new stock if not provided
  if (entry.productId && !entry.hasOwnProperty('previousStock')) {
    const product = getProducts().find(p => p.id === entry.productId);
    if (product) {
      entry.previousStock = Number(product.quantity || 0) - (entry.action === 'Received' ? entry.quantity : entry.action === 'Sold' ? -entry.quantity : 0);
      entry.newStock = Number(product.quantity || 0);
    }
  }
  history.unshift(entry);
  saveHistory(history);
}

function getOperations() {
  return getStorage('operations', []);
}

function saveOperations(operations) {
  setStorage('operations', operations);
}

function getSettings() {
  return getStorage('settings', {});
}

function saveSettings(settings) {
  setStorage('settings', settings);
}

// Page Initializations
function initLoginPage() {
  const loginIdInput = $('#loginId');
  const passwordInput = $('#password');
  const passwordFeedback = $('#passwordFeedback');
  const signInBtn = $('#signInBtn');
  const errorMessages = $('#errorMessages');
  const togglePassword = $('#togglePassword');

  function updatePasswordState() {
    const password = passwordInput.value;

    passwordInput.classList.remove('invalid');
    passwordFeedback.classList.remove('invalid');
    passwordFeedback.textContent = '';
    passwordFeedback.style.color = '';

    if (!password) {
      signInBtn.disabled = true;
      return;
    }

    if (password.length < 6) {
      passwordInput.classList.add('invalid');
      passwordFeedback.classList.add('invalid');
      passwordFeedback.textContent = 'Password must be at least 6 characters.';
      signInBtn.disabled = true;
      return;
    }

    if (password.length > 12) {
      passwordInput.classList.add('invalid');
      passwordFeedback.classList.add('invalid');
      passwordFeedback.textContent = 'Password must be no more than 12 characters.';
      signInBtn.disabled = true;
      return;
    }

    passwordFeedback.textContent = 'Password length is valid.';
    passwordFeedback.style.color = 'green';
    signInBtn.disabled = false;
  }

  if (togglePassword) {
    togglePassword.addEventListener('click', () => {
      const type = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = type;
      togglePassword.textContent = type === 'password' ? 'Show' : 'Hide';
    });
  }

  passwordInput.addEventListener('input', updatePasswordState);

  $('#loginForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const loginId = loginIdInput.value.trim();
    const password = passwordInput.value;

    errorMessages.textContent = '';

    if (!loginId) {
      errorMessages.textContent = 'Login ID is required.';
      return;
    }

    if (password.length < 6 || password.length > 12) {
      errorMessages.textContent = 'Password must be between 6 and 12 characters.';
      return;
    }

    setLoggedIn(true);
    window.location.href = 'dashboard.html';
  });

  updatePasswordState();
}

function initDashboardPage() {
  initSidebar('dashboard');
  initHeader();

  // Allow toggling a highlight state for the header (click headline)
  const header = document.querySelector('header');
  const highlightKey = 'dashboardHeaderHighlighted';
  if (localStorage.getItem(highlightKey) === 'true') {
    header.classList.add('highlighted');
  }
  header.addEventListener('click', () => {
    header.classList.toggle('highlighted');
    localStorage.setItem(highlightKey, header.classList.contains('highlighted') ? 'true' : 'false');
  });

  const totalProductsEl = $('#totalProducts');
  const totalSuppliersEl = $('#totalSuppliers');
  const totalCustomersEl = $('#totalCustomers');
  const totalStockEl = $('#totalStock');
  const totalPurchasesEl = $('#totalPurchases');
  const totalSalesEl = $('#totalSales');
  const recentActivitiesEl = $('#recentActivities');
  const alertsEl = $('#alertsList');

  const products = getProducts();
  const suppliers = getSuppliers();
  const customers = getCustomers();
  const purchases = getPurchases();
  const sales = getSales();
  const history = getHistory();

  const totalProducts = products.length;
  const totalSuppliers = suppliers.length;
  const totalCustomers = customers.length;
  const totalStock = products.reduce((sum, p) => sum + Number(p.quantity || 0), 0);
  const totalPurchases = purchases.length;
  const totalSales = sales.length;

  totalProductsEl.textContent = totalProducts;
  totalSuppliersEl.textContent = totalSuppliers;
  totalCustomersEl.textContent = totalCustomers;
  totalStockEl.textContent = totalStock;
  totalPurchasesEl.textContent = totalPurchases;
  totalSalesEl.textContent = totalSales;

  // Recent Activities
  recentActivitiesEl.innerHTML = '';
  history.slice(0, 5).forEach((entry) => {
    const li = document.createElement('li');
    const iconClass = entry.action.toLowerCase().includes('received') ? 'receipt' :
                     entry.action.toLowerCase().includes('delivered') ? 'delivery' : 'adjustment';
    li.innerHTML = `
      <div class="activity-icon ${iconClass}">${entry.action.charAt(0)}</div>
      <div>
        <strong>${entry.productName}</strong><br>
        <small>${entry.action} - Quantity: ${entry.quantity} - ${formatDate(entry.date)}</small>
      </div>
    `;
    recentActivitiesEl.appendChild(li);
  });

  // Stock Alerts
  alertsEl.innerHTML = '';
  const outOfStock = products.filter((p) => Number(p.quantity || 0) === 0);
  const lowStock = products.filter((p) => Number(p.quantity || 0) > 0 && Number(p.quantity || 0) < 10);

  if (outOfStock.length === 0 && lowStock.length === 0) {
    const li = document.createElement('li');
    li.innerHTML = '<div class="alert">No alerts – all stock levels are healthy.</div>';
    alertsEl.appendChild(li);
  } else {
    outOfStock.slice(0, 3).forEach((p) => {
      const li = document.createElement('li');
      li.innerHTML = `<div class="alert alert-danger">Out of stock: ${p.name}</div>`;
      alertsEl.appendChild(li);
    });

    lowStock.slice(0, 3).forEach((p) => {
      const li = document.createElement('li');
      li.innerHTML = `<div class="alert alert-warning">Low stock: ${p.name} (${p.quantity} left)</div>`;
      alertsEl.appendChild(li);
    });
  }
}

function initProductsPage() {
  initSidebar('products');
  initHeader();

  const form = $('#productForm');
  const productTableBody = $('#productTableBody');
  const categorySelect = $('#category');
  const saveButton = $('#saveProduct');
  const cancelButton = $('#cancelEdit');

  let editingId = null;

  function loadCategories() {
    const categories = getCategories();
    categorySelect.innerHTML = '<option value="">Select Category</option>';
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.name;
      categorySelect.appendChild(option);
    });
  }

  function renderProductTable() {
    const products = getProducts();
    productTableBody.innerHTML = '';

    if (products.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 7;
      td.textContent = 'No products yet. Add a product to begin.';
      td.style.textAlign = 'center';
      td.style.padding = '40px';
      tr.appendChild(td);
      productTableBody.appendChild(tr);
      return;
    }

    products.forEach((product) => {
      const tr = document.createElement('tr');

      const quantity = Number(product.quantity || 0);
      let statusClass = 'status-in-stock';
      let statusText = 'In Stock';

      if (quantity === 0) {
        statusClass = 'status-out-of-stock';
        statusText = 'Out of Stock';
      } else if (quantity < 10) {
        statusClass = 'status-low-stock';
        statusText = 'Low Stock';
      }

      const category = getCategories().find(c => c.id === product.category)?.name || 'N/A';

      tr.innerHTML = `
        <td>${product.name}</td>
        <td>${product.id}</td>
        <td>${category}</td>
        <td>$${Number(product.price || 0).toFixed(2)}</td>
        <td class="editable-quantity" data-id="${product.id}" data-field="quantity">${quantity}</td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td class="actions">
          <button class="action-btn edit" data-id="${product.id}">Edit</button>
          <button class="action-btn delete" data-id="${product.id}">Delete</button>
        </td>
      `;

      productTableBody.appendChild(tr);
    });
  }

  function resetForm() {
    form.reset();
    editingId = null;
    saveButton.textContent = 'Add Product';
    cancelButton.style.display = 'none';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const productData = {
      id: editingId || generateId(),
      name: $('#productName').value.trim(),
      productId: $('#productId').value.trim(),
      category: $('#category').value,
      price: Number($('#price').value),
      quantity: Number($('#quantity').value),
      description: $('#description').value.trim()
    };

    if (!productData.name || !productData.productId || !productData.category) {
      uiEnhancements.showToast('Please fill in all required fields.', 'error');
      return;
    }

    const products = getProducts();

    if (editingId) {
      const index = products.findIndex(p => p.id === editingId);
      if (index !== -1) {
        products[index] = productData;
      }
    } else {
      products.push(productData);
    }

    saveProducts(products);
    renderProductTable();
    resetForm();
  });

  cancelButton.addEventListener('click', resetForm);

  productTableBody.addEventListener('click', (e) => {
    const target = e.target;
    const id = target.dataset.id;

    if (target.classList.contains('edit')) {
      const product = getProducts().find(p => p.id === id);
      if (product) {
        editingId = id;
        $('#productName').value = product.name;
        $('#productId').value = product.productId;
        $('#category').value = product.category;
        $('#price').value = product.price;
        $('#quantity').value = product.quantity;
        $('#description').value = product.description || '';
        saveButton.textContent = 'Update Product';
        cancelButton.style.display = 'inline-block';
      }
    } else if (target.classList.contains('delete')) {
      if (confirm('Are you sure you want to delete this product?')) {
        const products = getProducts().filter(p => p.id !== id);
        saveProducts(products);
        renderProductTable();
      }
    }
  });

  loadCategories();
  renderProductTable();

  // Allow quick inline editing of product quantity
  productTableBody.addEventListener('click', (e) => {
    const cell = e.target.closest('.editable-quantity');
    if (!cell) return;

    const productId = cell.dataset.id;
    const currentQty = Number(cell.textContent.trim()) || 0;

    const input = document.createElement('input');
    input.type = 'number';
    input.min = 0;
    input.value = currentQty;
    input.className = 'inline-quantity-input';
    input.style.width = '80px';

    const saveQuantity = () => {
      const newQty = Number(input.value);
      if (Number.isNaN(newQty) || newQty < 0) {
        uiEnhancements.showToast('Quantity must be a non-negative number.', 'error');
        input.focus();
        return;
      }

      const products = getProducts();
      const productIndex = products.findIndex(p => p.id === productId);
      if (productIndex !== -1) {
        products[productIndex].quantity = newQty;
        products[productIndex].updatedAt = new Date().toISOString();
        saveProducts(products);
        renderProductTable();
        uiEnhancements.showToast('Product quantity updated.', 'success');
      }
    };

    cell.innerHTML = '';
    cell.appendChild(input);
    input.focus();
    input.select();

    input.addEventListener('blur', saveQuantity);
    input.addEventListener('keydown', (keyEvent) => {
      if (keyEvent.key === 'Enter') {
        saveQuantity();
      }
      if (keyEvent.key === 'Escape') {
        renderProductTable();
      }
    });
  });
}

function initCategoriesPage() {
  initSidebar('categories');
  initHeader();

  const form = $('#categoryForm');
  const categoryTableBody = $('#categoryTableBody');
  const cancelButton = $('#cancelEdit');
  const categoryProductsSelect = $('#categoryProducts');

  let editingId = null;

  function loadProductsForCategory() {
    const products = getProducts();
    categoryProductsSelect.innerHTML = '';
    products.forEach((product) => {
      const option = document.createElement('option');
      option.value = product.id;
      option.textContent = `${product.name} (${product.quantity || 0})`;
      categoryProductsSelect.appendChild(option);
    });
  }

  function renderCategoryTable() {
    const categories = getCategories();
    categoryTableBody.innerHTML = '';

    if (categories.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 4;
      td.textContent = 'No categories yet. Add a category to begin.';
      td.style.textAlign = 'center';
      td.style.padding = '40px';
      tr.appendChild(td);
      categoryTableBody.appendChild(tr);
      return;
    }

    categories.forEach((category) => {
      const productIds = category.productIds || [];
      const productNames = productIds
        .map(id => getProducts().find(p => p.id === id)?.name)
        .filter(Boolean)
        .slice(0, 3);
      const productDisplay = productNames.length
        ? `${productNames.join(', ')}${productIds.length > 3 ? ` +${productIds.length - 3} more` : ''}`
        : 'No products';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${category.name}</td>
        <td>${category.description || 'N/A'}</td>
        <td>${productDisplay}</td>
        <td class="actions">
          <button class="action-btn edit" data-id="${category.id}">Edit</button>
          <button class="action-btn delete" data-id="${category.id}">Delete</button>
        </td>
      `;
      categoryTableBody.appendChild(tr);
    });
  }

  function resetForm() {
    form.reset();
    editingId = null;
    cancelButton.style.display = 'none';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const selectedProducts = Array.from($('#categoryProducts').selectedOptions).map(opt => opt.value);

    const categoryData = {
      id: editingId || generateId(),
      name: $('#categoryName').value.trim(),
      description: $('#categoryDescription').value.trim(),
      productIds: selectedProducts
    };

    if (!categoryData.name) {
      uiEnhancements.showToast('Please enter a category name.', 'error');
      return;
    }

    const categories = getCategories();

    if (editingId) {
      const index = categories.findIndex(c => c.id === editingId);
      if (index !== -1) {
        categories[index] = categoryData;
      }
    } else {
      categories.push(categoryData);
    }

    saveCategories(categories);
    renderCategoryTable();
    resetForm();
  });

  cancelButton.addEventListener('click', resetForm);

  categoryTableBody.addEventListener('click', (e) => {
    const target = e.target;
    const id = target.dataset.id;

    if (target.classList.contains('edit')) {
      const category = getCategories().find(c => c.id === id);
      if (category) {
        editingId = id;
        $('#categoryName').value = category.name;
        $('#categoryDescription').value = category.description || '';

        // Pre-select products
        if (category.productIds && category.productIds.length) {
          Array.from(categoryProductsSelect.options).forEach(option => {
            option.selected = category.productIds.includes(option.value);
          });
        } else {
          Array.from(categoryProductsSelect.options).forEach(option => {
            option.selected = false;
          });
        }

        cancelButton.style.display = 'inline-block';
      }
    } else if (target.classList.contains('delete')) {
      if (confirm('Are you sure you want to delete this category?')) {
        const categories = getCategories().filter(c => c.id !== id);
        saveCategories(categories);
        renderCategoryTable();
      }
    }
  });

  loadProductsForCategory();
  renderCategoryTable();
}

function initSuppliersPage() {
  initSidebar('suppliers');
  initHeader();

  const form = $('#supplierForm');
  const supplierTableBody = $('#supplierTableBody');
  const cancelButton = $('#cancelEdit');

  let editingId = null;

  function renderSupplierTable() {
    const suppliers = getSuppliers();
    supplierTableBody.innerHTML = '';

    if (suppliers.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 5;
      td.textContent = 'No suppliers yet. Add a supplier to begin.';
      td.style.textAlign = 'center';
      td.style.padding = '40px';
      tr.appendChild(td);
      supplierTableBody.appendChild(tr);
      return;
    }

    suppliers.forEach((supplier) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${supplier.name}</td>
        <td>${supplier.phone}</td>
        <td>${supplier.email}</td>
        <td>${supplier.address}</td>
        <td class="actions">
          <button class="action-btn edit" data-id="${supplier.id}">Edit</button>
          <button class="action-btn delete" data-id="${supplier.id}">Delete</button>
        </td>
      `;
      supplierTableBody.appendChild(tr);
    });
  }

  function resetForm() {
    form.reset();
    editingId = null;
    cancelButton.style.display = 'none';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const supplierData = {
      id: editingId || generateId(),
      name: $('#supplierName').value.trim(),
      phone: $('#supplierPhone').value.trim(),
      email: $('#supplierEmail').value.trim(),
      address: $('#supplierAddress').value.trim()
    };

    if (!supplierData.name || !supplierData.phone || !supplierData.email || !supplierData.address) {
      uiEnhancements.showToast('Please fill in all required fields.', 'error');
      return;
    }

    const suppliers = getSuppliers();

    if (editingId) {
      const index = suppliers.findIndex(s => s.id === editingId);
      if (index !== -1) {
        suppliers[index] = supplierData;
      }
    } else {
      suppliers.push(supplierData);
    }

    saveSuppliers(suppliers);
    renderSupplierTable();
    resetForm();
  });

  cancelButton.addEventListener('click', resetForm);

  supplierTableBody.addEventListener('click', (e) => {
    const target = e.target;
    const id = target.dataset.id;

    if (target.classList.contains('edit')) {
      const supplier = getSuppliers().find(s => s.id === id);
      if (supplier) {
        editingId = id;
        $('#supplierName').value = supplier.name;
        $('#supplierPhone').value = supplier.phone;
        $('#supplierEmail').value = supplier.email;
        $('#supplierAddress').value = supplier.address;
        cancelButton.style.display = 'inline-block';
      }
    } else if (target.classList.contains('delete')) {
      if (confirm('Are you sure you want to delete this supplier?')) {
        const suppliers = getSuppliers().filter(s => s.id !== id);
        saveSuppliers(suppliers);
        renderSupplierTable();
      }
    }
  });

  renderSupplierTable();
}

function initCustomersPage() {
  initSidebar('customers');
  initHeader();

  const form = $('#customerForm');
  const customerTableBody = $('#customerTableBody');
  const cancelButton = $('#cancelEdit');

  let editingId = null;

  function renderCustomerTable() {
    const customers = getCustomers();
    customerTableBody.innerHTML = '';

    if (customers.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 5;
      td.textContent = 'No customers yet. Add a customer to begin.';
      td.style.textAlign = 'center';
      td.style.padding = '40px';
      tr.appendChild(td);
      customerTableBody.appendChild(tr);
      return;
    }

    customers.forEach((customer) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${customer.code || 'N/A'}</td>
        <td>${customer.name}</td>
        <td>${customer.phone}</td>
        <td>${customer.email}</td>
        <td>${customer.address}</td>
        <td class="actions">
          <button class="action-btn edit" data-id="${customer.id}">Edit</button>
          <button class="action-btn delete" data-id="${customer.id}">Delete</button>
        </td>
      `;
      customerTableBody.appendChild(tr);
    });
  }

  function resetForm() {
    form.reset();
    editingId = null;
    cancelButton.style.display = 'none';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const customerData = {
      id: editingId || generateId(),
      code: $('#customerCode').value.trim(),
      name: $('#customerName').value.trim(),
      phone: $('#customerPhone').value.trim(),
      email: $('#customerEmail').value.trim(),
      address: $('#customerAddress').value.trim()
    };

    if (!customerData.code || !customerData.name || !customerData.phone || !customerData.email || !customerData.address) {
      uiEnhancements.showToast('Please fill in all required customer fields.', 'error');
      return;
    }

    if (!uiEnhancements.isValidEmail(customerData.email)) {
      uiEnhancements.showToast('Please enter a valid email address.', 'error');
      return;
    }

    const customers = getCustomers();

    if (editingId) {
      const index = customers.findIndex(c => c.id === editingId);
      if (index !== -1) {
        customers[index] = customerData;
      }
    } else {
      customers.push(customerData);
    }

    saveCustomers(customers);
    renderCustomerTable();
    resetForm();
  });

  cancelButton.addEventListener('click', resetForm);

  customerTableBody.addEventListener('click', (e) => {
    const target = e.target;
    const id = target.dataset.id;

    if (target.classList.contains('edit')) {
      const customer = getCustomers().find(c => c.id === id);
      if (customer) {
        editingId = id;
        $('#customerCode').value = customer.code;
        $('#customerName').value = customer.name;
        $('#customerPhone').value = customer.phone;
        $('#customerEmail').value = customer.email;
        $('#customerAddress').value = customer.address;
        cancelButton.style.display = 'inline-block';
      }
    } else if (target.classList.contains('delete')) {
      if (confirm('Are you sure you want to delete this customer?')) {
        const customers = getCustomers().filter(c => c.id !== id);
        saveCustomers(customers);
        renderCustomerTable();
      }
    }
  });

  renderCustomerTable();
}

function initPurchasePage() {
  initSidebar('purchase');
  initHeader();

  const form = $('#purchaseForm');
  const purchaseTableBody = $('#purchaseTableBody');
  const supplierSelect = $('#supplier');
  const productSelect = $('#product');

  function loadSuppliers() {
    const suppliers = getSuppliers();
    supplierSelect.innerHTML = '<option value="">Select Supplier</option>';
    suppliers.forEach(supplier => {
      const option = document.createElement('option');
      option.value = supplier.id;
      option.textContent = supplier.name;
      supplierSelect.appendChild(option);
    });
  }

  function loadProducts() {
    const products = getProducts();
    productSelect.innerHTML = '<option value="">Select Product</option>';
    products.forEach(product => {
      const option = document.createElement('option');
      option.value = product.id;
      option.textContent = product.name;
      productSelect.appendChild(option);
    });
  }

  function renderPurchaseTable() {
    const purchases = getPurchases();
    purchaseTableBody.innerHTML = '';

    if (purchases.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 5;
      td.textContent = 'No purchase orders yet.';
      td.style.textAlign = 'center';
      td.style.padding = '40px';
      tr.appendChild(td);
      purchaseTableBody.appendChild(tr);
      return;
    }

    purchases.forEach((purchase) => {
      const supplier = getSuppliers().find(s => s.id === purchase.supplierId);
      const product = getProducts().find(p => p.id === purchase.productId);

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${formatDate(purchase.date)}</td>
        <td>${supplier ? supplier.name : 'N/A'}</td>
        <td>${product ? product.name : 'N/A'}</td>
        <td>${purchase.quantity}</td>
        <td>${purchase.notes || 'N/A'}</td>
      `;
      purchaseTableBody.appendChild(tr);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const purchaseData = {
      id: generateId(),
      supplierId: supplierSelect.value,
      productId: productSelect.value,
      quantity: Number($('#quantity').value),
      date: $('#date').value,
      notes: $('#notes').value.trim()
    };

    if (!purchaseData.supplierId || !purchaseData.productId || !purchaseData.quantity || !purchaseData.date) {
      uiEnhancements.showToast('Please fill in all required fields.', 'error');
      return;
    }

    // Increase product stock
    const products = getProducts();
    const productIndex = products.findIndex(p => p.id === purchaseData.productId);
    if (productIndex !== -1) {
      products[productIndex].quantity = Number(products[productIndex].quantity || 0) + purchaseData.quantity;
      saveProducts(products);
    }

    // Save purchase order
    const purchases = getPurchases();
    purchases.push(purchaseData);
    savePurchases(purchases);

    // Add to history
    const product = getProducts().find(p => p.id === purchaseData.productId);
    const previousStock = Number(product.quantity || 0) - purchaseData.quantity;
    addHistory({
      date: new Date().toISOString(),
      productName: product?.name || 'Unknown',
      quantity: purchaseData.quantity,
      action: 'Received',
      previousStock: previousStock,
      newStock: Number(product.quantity || 0)
    });

    renderPurchaseTable();
    form.reset();
  });

  loadSuppliers();
  loadProducts();
  renderPurchaseTable();
}

function initSalesPage() {
  initSidebar('sales');
  initHeader();

  const form = $('#salesForm');
  const salesTableBody = $('#salesTableBody');
  const customerSelect = $('#customer');
  const productSelect = $('#product');

  function loadCustomers() {
    const customers = getCustomers();
    customerSelect.innerHTML = '<option value="">Select Customer</option>';
    customers.forEach(customer => {
      const option = document.createElement('option');
      option.value = customer.id;
      option.textContent = customer.name;
      customerSelect.appendChild(option);
    });
  }

  function loadProducts() {
    const products = getProducts();
    productSelect.innerHTML = '<option value="">Select Product</option>';
    products.forEach(product => {
      const option = document.createElement('option');
      option.value = product.id;
      option.textContent = product.name;
      productSelect.appendChild(option);
    });
  }

  function renderSalesTable() {
    const sales = getSales();
    salesTableBody.innerHTML = '';

    if (sales.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 5;
      td.textContent = 'No sales orders yet.';
      td.style.textAlign = 'center';
      td.style.padding = '40px';
      tr.appendChild(td);
      salesTableBody.appendChild(tr);
      return;
    }

    sales.forEach((sale) => {
      const customer = getCustomers().find(c => c.id === sale.customerId);
      const product = getProducts().find(p => p.id === sale.productId);

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${formatDate(sale.date)}</td>
        <td>${customer ? customer.name : 'N/A'}</td>
        <td>${product ? product.name : 'N/A'}</td>
        <td>${sale.quantity}</td>
        <td>${sale.notes || 'N/A'}</td>
      `;
      salesTableBody.appendChild(tr);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const saleData = {
      id: generateId(),
      customerId: customerSelect.value,
      productId: productSelect.value,
      quantity: Number($('#quantity').value),
      date: $('#date').value,
      notes: $('#notes').value.trim()
    };

    if (!saleData.customerId || !saleData.productId || !saleData.quantity || !saleData.date) {
      uiEnhancements.showToast('Please fill in all required fields.', 'error');
      return;
    }

    // Check if sufficient stock is available
    const products = getProducts();
    const productIndex = products.findIndex(p => p.id === saleData.productId);
    if (productIndex !== -1) {
      const currentStock = Number(products[productIndex].quantity || 0);
      if (currentStock < saleData.quantity) {
        uiEnhancements.showToast('Insufficient stock available. Current stock: ' + currentStock, 'warning');
        return;
      }
      // Decrease product stock
      products[productIndex].quantity = currentStock - saleData.quantity;
      saveProducts(products);
    }

    // Save sales order
    const sales = getSales();
    sales.push(saleData);
    saveSales(sales);

    // Add to history
    const product = getProducts().find(p => p.id === saleData.productId);
    const newStock = Number(product.quantity || 0);
    addHistory({
      date: new Date().toISOString(),
      productName: product?.name || 'Unknown',
      quantity: saleData.quantity,
      action: 'Sold',
      previousStock: newStock + saleData.quantity,
      newStock: newStock
    });

    renderSalesTable();
    form.reset();
  });

  loadCustomers();
  loadProducts();
  renderSalesTable();
}

function initOperationsPage() {
  initSidebar('operations');
  initHeader();

  const form = $('#operationsForm');
  const operationsTableBody = $('#operationsTableBody');
  const productSelect = $('#operationProduct');
  const messageDiv = $('#operationMessage');

  function loadProducts() {
    const products = getProducts();
    productSelect.innerHTML = '<option value="">Select Product</option>';
    products.forEach(product => {
      const option = document.createElement('option');
      option.value = product.id;
      option.textContent = product.name;
      productSelect.appendChild(option);
    });
  }

  function renderOperationsTable() {
    const operations = getOperations();
    operationsTableBody.innerHTML = '';

    if (operations.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 5;
      td.textContent = 'No operations yet.';
      td.style.textAlign = 'center';
      td.style.padding = '40px';
      tr.appendChild(td);
      operationsTableBody.appendChild(tr);
      return;
    }

    operations.forEach((operation) => {
      const product = getProducts().find(p => p.id === operation.productId);

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${formatDate(operation.date)}</td>
        <td>${product ? product.name : 'N/A'}</td>
        <td>${operation.type}</td>
        <td>${operation.type === 'receipt' ? '+' : operation.type === 'delivery' ? '-' : ''}${operation.quantity}</td>
        <td>${operation.notes || 'N/A'}</td>
      `;
      operationsTableBody.appendChild(tr);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const operationData = {
      id: generateId(),
      productId: productSelect.value,
      type: $('#operationType').value,
      quantity: Number($('#operationQty').value),
      notes: $('#operationNotes').value.trim(),
      date: new Date().toISOString()
    };

    if (!operationData.productId || !operationData.type || operationData.quantity < 0) {
      messageDiv.textContent = 'Please fill in all required fields.';
      messageDiv.className = 'feedback error';
      return;
    }

    // Update product stock based on operation type
    const products = getProducts();
    const productIndex = products.findIndex(p => p.id === operationData.productId);
    if (productIndex !== -1) {
      const currentStock = Number(products[productIndex].quantity || 0);

      if (operationData.type === 'receipt') {
        products[productIndex].quantity = currentStock + operationData.quantity;
      } else if (operationData.type === 'delivery') {
        if (currentStock < operationData.quantity) {
          messageDiv.textContent = 'Insufficient stock for delivery operation.';
          messageDiv.className = 'feedback error';
          return;
        }
        products[productIndex].quantity = currentStock - operationData.quantity;
      } else if (operationData.type === 'adjustment') {
        products[productIndex].quantity = operationData.quantity;
      }

      saveProducts(products);
    }

    // Save operation
    const operations = getOperations();
    operations.push(operationData);
    saveOperations(operations);

    // Add to history
    const actionMap = {
      'receipt': 'Received',
      'delivery': 'Delivered',
      'adjustment': 'Adjusted'
    };
    addHistory({
      date: operationData.date,
      productName: getProducts().find(p => p.id === operationData.productId)?.name || 'Unknown',
      quantity: operationData.quantity,
      action: actionMap[operationData.type] || 'Adjusted'
    });

    messageDiv.textContent = 'Operation completed successfully!';
    messageDiv.className = 'feedback success';
    renderOperationsTable();
    form.reset();
  });

  loadProducts();
  renderOperationsTable();
}

function initStockPage() {
  initSidebar('stock');
  initHeader();

  const stockTableBody = $('#stockTableBody');
  const lowStockItems = $('#lowStockItems');
  const outOfStockItems = $('#outOfStockItems');

  function renderStockTable() {
    const products = getProducts();
    stockTableBody.innerHTML = '';

    if (products.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 5;
      td.textContent = 'No products found.';
      td.style.textAlign = 'center';
      td.style.padding = '40px';
      tr.appendChild(td);
      stockTableBody.appendChild(tr);
      return;
    }

    products.forEach((product) => {
      const category = getCategories().find(c => c.id === product.categoryId);
      const stock = Number(product.quantity || 0);
      const status = stock === 0 ? 'Out of Stock' : stock <= 10 ? 'Low Stock' : 'In Stock';
      const statusClass = stock === 0 ? 'status-out' : stock <= 10 ? 'status-low' : 'status-good';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${product.name}</td>
        <td>${category ? category.name : 'N/A'}</td>
        <td>${stock}</td>
        <td><span class="status ${statusClass}">${status}</span></td>
        <td>${product.updatedAt ? formatDate(product.updatedAt) : 'N/A'}</td>
      `;
      stockTableBody.appendChild(tr);
    });
  }

  function renderStockAlerts() {
    const products = getProducts();
    const lowStock = products.filter(p => Number(p.quantity || 0) > 0 && Number(p.quantity || 0) <= 10);
    const outOfStock = products.filter(p => Number(p.quantity || 0) === 0);

    lowStockItems.innerHTML = lowStock.length > 0
      ? lowStock.map(p => `<div class="alert-item">${p.name} (${p.quantity})</div>`).join('')
      : '<p>No low stock items</p>';

    outOfStockItems.innerHTML = outOfStock.length > 0
      ? outOfStock.map(p => `<div class="alert-item">${p.name}</div>`).join('')
      : '<p>No out of stock items</p>';
  }

  renderStockTable();
  renderStockAlerts();
}

function initHistoryPage() {
  initSidebar('history');
  initHeader();

  const historyTableBody = $('#historyTableBody');
  const filterAction = $('#filterAction');
  const filterDate = $('#filterDate');
  const clearFilters = $('#clearFilters');
  const totalMovements = $('#totalMovements');
  const totalReceived = $('#totalReceived');
  const totalSold = $('#totalSold');
  const totalAdjusted = $('#totalAdjusted');

  function renderHistoryTable(filter = {}) {
    const history = getHistory();
    let filteredHistory = history;

    if (filter.action) {
      filteredHistory = filteredHistory.filter(h => h.action === filter.action);
    }

    if (filter.date) {
      filteredHistory = filteredHistory.filter(h => {
        const historyDate = new Date(h.date).toISOString().split('T')[0];
        return historyDate === filter.date;
      });
    }

    // Sort by date descending
    filteredHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

    historyTableBody.innerHTML = '';

    if (filteredHistory.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 6;
      td.textContent = 'No history records found.';
      td.style.textAlign = 'center';
      td.style.padding = '40px';
      tr.appendChild(td);
      historyTableBody.appendChild(tr);
      return;
    }

    filteredHistory.forEach((record) => {
      const tr = document.createElement('tr');
      const quantityDisplay = record.action === 'Received' ? `+${record.quantity}` :
                             record.action === 'Sold' ? `-${record.quantity}` :
                             record.quantity;

      tr.innerHTML = `
        <td>${formatDate(record.date)}</td>
        <td>${record.productName}</td>
        <td>${record.action}</td>
        <td>${quantityDisplay}</td>
        <td>${record.previousStock || 'N/A'}</td>
        <td>${record.newStock || 'N/A'}</td>
      `;
      historyTableBody.appendChild(tr);
    });
  }

  function updateStatistics() {
    const history = getHistory();
    totalMovements.textContent = history.length;
    totalReceived.textContent = history.filter(h => h.action === 'Received').length;
    totalSold.textContent = history.filter(h => h.action === 'Sold').length;
    totalAdjusted.textContent = history.filter(h => h.action === 'Adjusted').length;
  }

  filterAction.addEventListener('change', () => {
    renderHistoryTable({
      action: filterAction.value,
      date: filterDate.value
    });
  });

  filterDate.addEventListener('change', () => {
    renderHistoryTable({
      action: filterAction.value,
      date: filterDate.value
    });
  });

  clearFilters.addEventListener('click', () => {
    filterAction.value = '';
    filterDate.value = '';
    renderHistoryTable();
  });

  renderHistoryTable();
  updateStatistics();
}

function initSettingsPage() {
  initSidebar('settings');
  initHeader();

  const form = $('#settingsForm');
  const exportData = $('#exportData');
  const clearData = $('#clearData');
  const backupData = $('#backupData');

  // Load saved settings
  function loadSettings() {
    const settings = getSettings();
    $('#companyName').value = settings.companyName || 'Your Company';
    $('#lowStockThreshold').value = settings.lowStockThreshold || 10;
    $('#currency').value = settings.currency || '₹';
    $('#dateFormat').value = settings.dateFormat || 'DD/MM/YYYY';
    $('#theme').value = settings.theme || 'light';
    $('#language').value = settings.language || 'en';
    $('#itemsPerPage').value = settings.itemsPerPage || 25;
    $('#emailNotifications').checked = settings.emailNotifications !== false;
    $('#autoSave').checked = settings.autoSave !== false;
    $('#showTooltips').checked = settings.showTooltips || false;
  }

  // Save settings
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const settings = {
      companyName: $('#companyName').value,
      lowStockThreshold: Number($('#lowStockThreshold').value),
      currency: $('#currency').value,
      dateFormat: $('#dateFormat').value,
      theme: $('#theme').value,
      language: $('#language').value,
      itemsPerPage: Number($('#itemsPerPage').value),
      emailNotifications: $('#emailNotifications').checked,
      autoSave: $('#autoSave').checked,
      showTooltips: $('#showTooltips').checked
    };

    saveSettings(settings);
    uiEnhancements.showToast('Settings saved successfully!', 'success');
  });

  // Export data
  exportData.addEventListener('click', () => {
    const data = {
      products: getProducts(),
      categories: getCategories(),
      suppliers: getSuppliers(),
      customers: getCustomers(),
      purchases: getPurchases(),
      sales: getSales(),
      operations: getOperations(),
      history: getHistory(),
      settings: getSettings()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Clear all data
  clearData.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      uiEnhancements.showToast('All data has been cleared. Reloading...', 'info');
      location.reload();
    }
  });

  // Create backup
  backupData.addEventListener('click', () => {
    const data = {
      products: getProducts(),
      categories: getCategories(),
      suppliers: getSuppliers(),
      customers: getCustomers(),
      purchases: getPurchases(),
      sales: getSales(),
      operations: getOperations(),
      history: getHistory(),
      settings: getSettings()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    uiEnhancements.showToast('Backup created successfully!', 'success');
  });

  loadSettings();
}

// Initialize page based on current page
function initPage() {
  const body = document.body;
  const page = body.dataset.page;

  if (!isLoggedIn() && page !== 'login') {
    window.location.href = 'dashboard.html';
    return;
  }

  switch (page) {
    case 'login':
      initLoginPage();
      break;
    case 'dashboard':
      initDashboardPage();
      break;
    case 'products':
      initProductsPage();
      break;
    case 'categories':
      initCategoriesPage();
      break;
    case 'suppliers':
      initSuppliersPage();
      break;
    case 'customers':
      initCustomersPage();
      break;
    case 'purchase':
      initPurchasePage();
      break;
    case 'sales':
      initSalesPage();
      break;
    case 'operations':
      initOperationsPage();
      break;
    case 'stock':
      initStockPage();
      break;
    case 'history':
      initHistoryPage();
      break;
    case 'settings':
      initSettingsPage();
      break;
    // Add other page initializations here
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initPage);