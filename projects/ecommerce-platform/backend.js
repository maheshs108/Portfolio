// E-Commerce Backend API Integration
class ECommerceAPI {
    constructor() {
        this.api = new APISimulator('/api/ecommerce');
        this.loader = new LoadingManager();
        this.loader.createLoader();
        this.cart = [];
        this.wishlist = [];
        this.orders = [];
        this.init();
    }

    async init() {
        await this.loadCart();
        await this.loadWishlist();
        await this.loadOrders();
    }

    // Cart Operations
    async loadCart() {
        try {
            const response = await this.api.get('/cart');
            this.cart = response.data || [];
            return this.cart;
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }

    async addToCart(product, quantity = 1) {
        const requestId = 'addToCart_' + Date.now();
        this.loader.start(requestId);
        
        try {
            const existingItem = this.cart.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity += quantity;
                await this.api.put('/cart', existingItem.id, existingItem);
            } else {
                const cartItem = {
                    ...product,
                    quantity,
                    addedAt: new Date().toISOString()
                };
                const response = await this.api.post('/cart', cartItem);
                this.cart.push(response.data);
            }
            
            await this.saveCart();
            this.showNotification(`${product.name} added to cart!`, 'success');
            return true;
        } catch (error) {
            this.showNotification('Failed to add to cart', 'error');
            return false;
        } finally {
            this.loader.stop(requestId);
        }
    }

    async updateCartQuantity(productId, quantity) {
        const requestId = 'updateCart_' + Date.now();
        this.loader.start(requestId);
        
        try {
            const item = this.cart.find(i => i.id === productId);
            if (item) {
                item.quantity = quantity;
                if (quantity <= 0) {
                    await this.removeFromCart(productId);
                } else {
                    await this.api.put('/cart', productId, item);
                    await this.saveCart();
                }
            }
            return true;
        } catch (error) {
            this.showNotification('Failed to update cart', 'error');
            return false;
        } finally {
            this.loader.stop(requestId);
        }
    }

    async removeFromCart(productId) {
        const requestId = 'removeFromCart_' + Date.now();
        this.loader.start(requestId);
        
        try {
            await this.api.delete('/cart', productId);
            this.cart = this.cart.filter(item => item.id !== productId);
            await this.saveCart();
            this.showNotification('Item removed from cart', 'info');
            return true;
        } catch (error) {
            this.showNotification('Failed to remove item', 'error');
            return false;
        } finally {
            this.loader.stop(requestId);
        }
    }

    async clearCart() {
        const requestId = 'clearCart_' + Date.now();
        this.loader.start(requestId);
        
        try {
            for (const item of this.cart) {
                await this.api.delete('/cart', item.id);
            }
            this.cart = [];
            await this.saveCart();
            this.showNotification('Cart cleared', 'info');
            return true;
        } catch (error) {
            this.showNotification('Failed to clear cart', 'error');
            return false;
        } finally {
            this.loader.stop(requestId);
        }
    }

    async saveCart() {
        localStorage.setItem('ecommerce_cart', JSON.stringify(this.cart));
    }

    // Wishlist Operations
    async loadWishlist() {
        try {
            const response = await this.api.get('/wishlist');
            this.wishlist = response.data || [];
            return this.wishlist;
        } catch (error) {
            console.error('Error loading wishlist:', error);
            return [];
        }
    }

    async addToWishlist(product) {
        const requestId = 'addToWishlist_' + Date.now();
        this.loader.start(requestId);
        
        try {
            if (this.wishlist.find(item => item.id === product.id)) {
                this.showNotification('Already in wishlist', 'info');
                return false;
            }
            
            const wishlistItem = {
                ...product,
                addedAt: new Date().toISOString()
            };
            
            const response = await this.api.post('/wishlist', wishlistItem);
            this.wishlist.push(response.data);
            await this.saveWishlist();
            this.showNotification(`${product.name} added to wishlist!`, 'success');
            return true;
        } catch (error) {
            this.showNotification('Failed to add to wishlist', 'error');
            return false;
        } finally {
            this.loader.stop(requestId);
        }
    }

    async removeFromWishlist(productId) {
        const requestId = 'removeFromWishlist_' + Date.now();
        this.loader.start(requestId);
        
        try {
            await this.api.delete('/wishlist', productId);
            this.wishlist = this.wishlist.filter(item => item.id !== productId);
            await this.saveWishlist();
            this.showNotification('Removed from wishlist', 'info');
            return true;
        } catch (error) {
            this.showNotification('Failed to remove from wishlist', 'error');
            return false;
        } finally {
            this.loader.stop(requestId);
        }
    }

    async saveWishlist() {
        localStorage.setItem('ecommerce_wishlist', JSON.stringify(this.wishlist));
    }

    // Order Operations
    async loadOrders() {
        try {
            const response = await this.api.get('/orders');
            this.orders = response.data || [];
            return this.orders;
        } catch (error) {
            console.error('Error loading orders:', error);
            return [];
        }
    }

    async placeOrder(orderDetails) {
        const requestId = 'placeOrder_' + Date.now();
        this.loader.start(requestId);
        
        try {
            const order = {
                id: Date.now(),
                items: [...this.cart],
                total: this.getCartTotal(),
                ...orderDetails,
                status: 'pending',
                placedAt: new Date().toISOString()
            };
            
            const response = await this.api.post('/orders', order);
            this.orders.push(response.data);
            await this.saveOrders();
            await this.clearCart();
            
            this.showNotification('Order placed successfully! 🎉', 'success');
            return response.data;
        } catch (error) {
            this.showNotification('Failed to place order', 'error');
            return null;
        } finally {
            this.loader.stop(requestId);
        }
    }

    async saveOrders() {
        localStorage.setItem('ecommerce_orders', JSON.stringify(this.orders));
    }

    // Utility Methods
    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    isInWishlist(productId) {
        return this.wishlist.some(item => item.id === productId);
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            font-weight: 600;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize backend on page load
let ecommerceBackend;
document.addEventListener('DOMContentLoaded', () => {
    ecommerceBackend = new ECommerceAPI();
});
