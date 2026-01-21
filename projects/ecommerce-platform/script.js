// Enhanced Product Data with Images
const products = [
    {
        id: 1,
        name: 'Wireless Headphones Pro',
        category: 'electronics',
        price: 2999,
        oldPrice: 4999,
        image: '🎧',
        rating: 4.5,
        reviews: 128,
        description: 'Premium noise-cancelling wireless headphones with 30hr battery life',
        badge: 'Sale',
        inStock: true
    },
    {
        id: 2,
        name: 'Smart Watch Ultra',
        category: 'electronics',
        price: 5999,
        oldPrice: 8999,
        image: '⌚',
        rating: 4.7,
        reviews: 256,
        description: 'Advanced fitness tracking smart watch with heart rate monitor and GPS',
        badge: '33% OFF',
        inStock: true
    },
    {
        id: 3,
        name: 'Premium Laptop Backpack',
        category: 'fashion',
        price: 1299,
        oldPrice: 1999,
        image: '🎒',
        rating: 4.3,
        reviews: 89,
        description: 'Durable waterproof laptop backpack with USB charging port',
        badge: 'New',
        inStock: true
    },
    {
        id: 4,
        name: 'Automatic Coffee Maker',
        category: 'home',
        price: 3499,
        oldPrice: 4999,
        image: '☕',
        rating: 4.6,
        reviews: 145,
        description: 'Programmable drip coffee maker with thermal carafe',
        badge: 'Sale',
        inStock: true
    },
    {
        id: 5,
        name: 'Portable Bluetooth Speaker',
        category: 'electronics',
        price: 1999,
        oldPrice: 2999,
        image: '🔊',
        rating: 4.4,
        reviews: 203,
        description: 'Waterproof Bluetooth speaker with 360° sound',
        badge: 'Hot',
        inStock: true
    },
    {
        id: 6,
        name: 'Premium Running Shoes',
        category: 'fashion',
        price: 2499,
        oldPrice: 3999,
        image: '👟',
        rating: 4.8,
        reviews: 312,
        description: 'Comfortable lightweight running shoes with memory foam',
        badge: 'Bestseller',
        inStock: true
    },
    {
        id: 7,
        name: 'Modern LED Desk Lamp',
        category: 'home',
        price: 899,
        oldPrice: 1499,
        image: '💡',
        rating: 4.2,
        reviews: 67,
        description: 'Adjustable LED desk lamp with USB charging port',
        badge: '40% OFF',
        inStock: true
    },
    {
        id: 8,
        name: 'Ergonomic Wireless Mouse',
        category: 'electronics',
        price: 599,
        oldPrice: 999,
        image: '🖱️',
        rating: 4.3,
        reviews: 178,
        description: 'Ergonomic design with long battery life',
        badge: 'New',
        inStock: true
    },
    {
        id: 9,
        name: 'Premium Cotton T-Shirt',
        category: 'fashion',
        price: 499,
        oldPrice: 799,
        image: '👕',
        rating: 4.1,
        reviews: 234,
        description: '100% organic cotton comfortable t-shirt',
        badge: 'Sale',
        inStock: true
    },
    {
        id: 10,
        name: 'Smart Air Purifier',
        category: 'home',
        price: 4999,
        oldPrice: 6999,
        image: '🌬️',
        rating: 4.7,
        reviews: 156,
        description: 'HEPA filter air purifier with app control',
        badge: 'Hot',
        inStock: true
    },
    {
        id: 11,
        name: '5G Smartphone',
        category: 'electronics',
        price: 15999,
        oldPrice: 19999,
        image: '📱',
        rating: 4.6,
        reviews: 445,
        description: 'Latest 5G smartphone with 128GB storage',
        badge: '20% OFF',
        inStock: true
    },
    {
        id: 12,
        name: 'Wall Clock Designer',
        category: 'home',
        price: 699,
        oldPrice: 1199,
        image: '🕐',
        rating: 4.0,
        reviews: 92,
        description: 'Modern silent wall clock with elegant design',
        badge: 'New',
        inStock: true
    }
];

let cart = [];
let wishlist = [];
let currentFilter = 'all';
let currentSort = 'default';
let allProducts = [...products];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupFilters();
    setupCart();
    loadCartFromStorage();
    loadWishlistFromStorage();
    setupSearch();
});

// Load Products with enhanced UI
function loadProducts(filter = 'all', sortBy = 'default') {
    const productsGrid = document.getElementById('productsGrid');
    let filteredProducts = filter === 'all' 
        ? allProducts
        : allProducts.filter(p => p.category === filter);
    
    // Apply sorting
    filteredProducts = sortProducts(filteredProducts, sortBy);
    
    productsGrid.innerHTML = filteredProducts.map(product => {
        const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
        const isInWishlist = wishlist.some(item => item.id === product.id);
        
        return `
        <div class="product-card" data-category="${product.category}" data-id="${product.id}">
            <div class="product-image">
                <div class="product-emoji">${product.image}</div>
                <div class="product-badge">${product.badge}</div>
                <div class="product-actions">
                    <button class="action-btn wishlist-btn ${isInWishlist ? 'active' : ''}" onclick="toggleProductWishlist(${product.id})" title="Add to Wishlist">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="action-btn" onclick="quickView(${product.id})" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
                ${product.inStock ? '<span class="stock-badge in-stock">In Stock</span>' : '<span class="stock-badge out-stock">Out of Stock</span>'}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    ${generateStars(product.rating)}
                    <span class="reviews">(${product.reviews} reviews)</span>
                </div>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <div class="price-section">
                        <span class="product-price">₹${product.price}</span>
                        <span class="product-price-old">₹${product.oldPrice}</span>
                        <span class="discount-badge">-${discount}%</span>
                    </div>
                </div>
                <button class="btn btn-add-cart" onclick="addToCart(${product.id})" ${!product.inStock ? 'disabled' : ''}>
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
    }).join('');
}

// Generate star rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return `<div class="stars">${stars}</div>`;
}

// Sort Products
function sortProducts(productsArray, sortBy) {
    const sorted = [...productsArray];
    
    switch(sortBy) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        default:
            return sorted;
    }
}

// Search Products
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        allProducts = products.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.description.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
        loadProducts(currentFilter, currentSort);
    });
}

function searchProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    if (query) {
        allProducts = products.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.description.toLowerCase().includes(query)
        );
        loadProducts(currentFilter, currentSort);
        showNotification(`Found ${allProducts.length} products for "${query}"`);
    }
}

// Setup Filters
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            loadProducts(currentFilter, currentSort);
        });
    });
}

// Quick View
function quickView(productId) {
    const product = products.find(p => p.id === productId);
    const modal = document.getElementById('quickViewModal');
    const content = document.getElementById('quickViewContent');
    
    content.innerHTML = `
        <div class="quick-view">
            <div class="quick-view-image">
                <div class="product-emoji large">${product.image}</div>
            </div>
            <div class="quick-view-details">
                <div class="product-category">${product.category}</div>
                <h2>${product.name}</h2>
                <div class="product-rating">
                    ${generateStars(product.rating)}
                    <span class="reviews">(${product.reviews} reviews)</span>
                </div>
                <p class="description">${product.description}</p>
                <div class="price-section">
                    <span class="product-price">₹${product.price}</span>
                    <span class="product-price-old">₹${product.oldPrice}</span>
                </div>
                <div class="quick-actions">
                    <button class="btn btn-primary" onclick="addToCart(${product.id}); closeQuickView();">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                    <button class="btn btn-secondary" onclick="toggleProductWishlist(${product.id})">
                        <i class="fas fa-heart"></i> Wishlist
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
}

function closeQuickView() {
    document.getElementById('quickViewModal').classList.remove('show');
}

// Wishlist Functions
function toggleWishlist() {
    showNotification(`Wishlist feature - ${wishlist.length} items in wishlist`);
}

function toggleProductWishlist(productId) {
    const product = products.find(p => p.id === productId);
    const existingIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
        showNotification(`${product.name} removed from wishlist`);
    } else {
        wishlist.push(product);
        showNotification(`${product.name} added to wishlist`);
    }
    
    saveWishlistToStorage();
    updateWishlistCount();
    loadProducts(currentFilter, currentSort); // Refresh to update heart icons
}

function updateWishlistCount() {
    document.getElementById('wishlistCount').textContent = wishlist.length;
}

// Add to Cart with animation
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
        showNotification(`${product.name} quantity updated in cart!`);
    } else {
        cart.push({ ...product, quantity: 1 });
        showNotification(`${product.name} added to cart!`);
    }
    
    updateCart();
    saveCartToStorage();
    animateCartButton();
}

function animateCartButton() {
    const cartBtn = document.querySelector('[href="#cart"]');
    cartBtn.classList.add('bounce');
    setTimeout(() => cartBtn.classList.remove('bounce'), 500);
}

// Update Cart
function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    const cartItems = document.getElementById('cartItems');
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <button class="btn btn-primary" onclick="closeCartModal(); document.getElementById('products').scrollIntoView({behavior: 'smooth'})">
                    Start Shopping
                </button>
            </div>`;
        subtotalEl.textContent = '₹0';
        shippingEl.textContent = '₹0';
        totalEl.textContent = '₹0';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <div class="product-emoji">${item.image}</div>
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price} each</div>
                <div class="cart-item-quantity">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <div class="cart-item-total">
                <div class="item-total">₹${item.price * item.quantity}</div>
                <button class="remove-item" onclick="removeFromCart(${item.id})" title="Remove">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 50 : 0;
    const total = subtotal + shipping;
    
    subtotalEl.textContent = `₹${subtotal}`;
    shippingEl.textContent = `₹${shipping}`;
    totalEl.textContent = `₹${total}`;
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
            saveCartToStorage();
        }
    }
}

// Remove from Cart
function removeFromCart(productId) {
    const product = cart.find(item => item.id === productId);
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveCartToStorage();
    showNotification(`${product.name} removed from cart`);
}

// Clear Cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        updateCart();
        saveCartToStorage();
        showNotification('Cart cleared');
    }
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    const total = document.getElementById('cartTotal').textContent;
    showNotification(`Checkout feature coming soon! Total: ${total}`, 'success');
    // In real app, redirect to checkout page
}

// Setup Cart Modal
function setupCart() {
    const modal = document.getElementById('cartModal');
    const cartLink = document.querySelector('[href="#cart"]');
    const closeBtn = modal.querySelector('.close');
    
    cartLink.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('show');
    });
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
        if (e.target === document.getElementById('quickViewModal')) {
            closeQuickView();
        }
    });
}

function closeCartModal() {
    document.getElementById('cartModal').classList.remove('show');
}

// Local Storage
function saveCartToStorage() {
    localStorage.setItem('shophub_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('shophub_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

function saveWishlistToStorage() {
    localStorage.setItem('shophub_wishlist', JSON.stringify(wishlist));
}

function loadWishlistFromStorage() {
    const savedWishlist = localStorage.getItem('shophub_wishlist');
    if (savedWishlist) {
        wishlist = JSON.parse(savedWishlist);
        updateWishlistCount();
    }
}

// Notification with better styling
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target && this.getAttribute('href') !== '#cart') {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

console.log('%c🛒 ShopHub E-Commerce', 'font-size: 20px; color: #FF6B35; font-weight: bold;');
console.log('%cFully functional shopping experience!', 'color: #004E89;');
