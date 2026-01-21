// Product Data
const products = [
    {
        id: 1,
        name: 'Wireless Headphones',
        category: 'electronics',
        price: 2999,
        oldPrice: 4999,
        icon: 'fa-headphones',
        description: 'Premium noise-cancelling wireless headphones',
        badge: 'Sale'
    },
    {
        id: 2,
        name: 'Smart Watch',
        category: 'electronics',
        price: 5999,
        oldPrice: 8999,
        icon: 'fa-clock',
        description: 'Fitness tracking smart watch with heart rate monitor',
        badge: '33% OFF'
    },
    {
        id: 3,
        name: 'Laptop Backpack',
        category: 'fashion',
        price: 1299,
        oldPrice: 1999,
        icon: 'fa-backpack',
        description: 'Durable waterproof laptop backpack',
        badge: 'New'
    },
    {
        id: 4,
        name: 'Coffee Maker',
        category: 'home',
        price: 3499,
        oldPrice: 4999,
        icon: 'fa-mug-hot',
        description: 'Automatic drip coffee maker with timer',
        badge: 'Sale'
    },
    {
        id: 5,
        name: 'Bluetooth Speaker',
        category: 'electronics',
        price: 1999,
        oldPrice: 2999,
        icon: 'fa-volume-high',
        description: 'Portable waterproof Bluetooth speaker',
        badge: 'Hot'
    },
    {
        id: 6,
        name: 'Running Shoes',
        category: 'fashion',
        price: 2499,
        oldPrice: 3999,
        icon: 'fa-shoe-prints',
        description: 'Comfortable lightweight running shoes',
        badge: 'Sale'
    },
    {
        id: 7,
        name: 'LED Desk Lamp',
        category: 'home',
        price: 899,
        oldPrice: 1499,
        icon: 'fa-lightbulb',
        description: 'Adjustable LED desk lamp with USB charging',
        badge: '40% OFF'
    },
    {
        id: 8,
        name: 'Wireless Mouse',
        category: 'electronics',
        price: 599,
        oldPrice: 999,
        icon: 'fa-computer-mouse',
        description: 'Ergonomic wireless mouse with long battery life',
        badge: 'New'
    },
    {
        id: 9,
        name: 'Cotton T-Shirt',
        category: 'fashion',
        price: 499,
        oldPrice: 799,
        icon: 'fa-shirt',
        description: 'Premium 100% cotton t-shirt',
        badge: 'Sale'
    },
    {
        id: 10,
        name: 'Air Purifier',
        category: 'home',
        price: 4999,
        oldPrice: 6999,
        icon: 'fa-wind',
        description: 'HEPA filter air purifier for clean air',
        badge: 'Hot'
    },
    {
        id: 11,
        name: 'Smartphone',
        category: 'electronics',
        price: 15999,
        oldPrice: 19999,
        icon: 'fa-mobile-screen',
        description: '5G smartphone with 128GB storage',
        badge: '20% OFF'
    },
    {
        id: 12,
        name: 'Wall Clock',
        category: 'home',
        price: 699,
        oldPrice: 1199,
        icon: 'fa-clock',
        description: 'Modern silent wall clock',
        badge: 'New'
    }
];

let cart = [];
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupFilters();
    setupCart();
    loadCartFromStorage();
});

// Load Products
function loadProducts(filter = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(p => p.category === filter);
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <i class="fas ${product.icon}"></i>
                <div class="product-badge">${product.badge}</div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <div>
                        <span class="product-price">₹${product.price}</span>
                        <span class="product-price-old">₹${product.oldPrice}</span>
                    </div>
                </div>
                <button class="btn btn-add-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Setup Filters
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            currentFilter = filter;
            loadProducts(filter);
        });
    });
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart();
    saveCartToStorage();
    showNotification('Product added to cart!');
}

// Update Cart
function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty"><i class="fas fa-shopping-cart" style="font-size: 4rem; opacity: 0.3;"></i><p>Your cart is empty</p></div>';
        cartTotal.textContent = '0';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <i class="fas ${item.icon}"></i>
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price}</div>
                <div class="cart-item-quantity">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <i class="fas fa-trash remove-item" onclick="removeFromCart(${item.id})"></i>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
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
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveCartToStorage();
    showNotification('Product removed from cart');
}

// Setup Cart Modal
function setupCart() {
    const modal = document.getElementById('cartModal');
    const cartLink = document.querySelector('[href="#cart"]');
    const closeBtn = document.querySelector('.close');
    const checkoutBtn = document.querySelector('.btn-checkout');
    
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
    });
    
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }
        showNotification('Checkout feature coming soon! Total: ₹' + document.getElementById('cartTotal').textContent);
        modal.classList.remove('show');
    });
}

// Local Storage
function saveCartToStorage() {
    localStorage.setItem('ecommerce_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('ecommerce_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
