/**
 * API Simulator - Simulates Backend API Calls
 * This can be easily replaced with real API endpoints
 */

class APISimulator {
    constructor(baseURL = '/api') {
        this.baseURL = baseURL;
        this.requestDelay = 500; // Simulate network delay
        this.isOnline = navigator.onLine;
        this.setupNetworkListeners();
    }

    setupNetworkListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showNotification('Back online', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showNotification('No internet connection', 'error');
        });
    }

    async simulateRequest(endpoint, options = {}) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, this.requestDelay));

        if (!this.isOnline) {
            throw new Error('No internet connection');
        }

        // Simulate API response
        return {
            success: true,
            data: options.data || {},
            timestamp: new Date().toISOString(),
            endpoint: endpoint
        };
    }

    async get(endpoint, params = {}) {
        try {
            const queryString = new URLSearchParams(params).toString();
            const url = `${this.baseURL}${endpoint}${queryString ? '?' + queryString : ''}`;
            
            console.log(`[API] GET ${url}`);
            
            // Get from localStorage (simulating database)
            const key = this.getStorageKey(endpoint);
            const data = localStorage.getItem(key);
            
            return await this.simulateRequest(endpoint, {
                method: 'GET',
                data: data ? JSON.parse(data) : null
            });
        } catch (error) {
            console.error(`[API Error] GET ${endpoint}:`, error);
            throw error;
        }
    }

    async post(endpoint, body = {}) {
        try {
            console.log(`[API] POST ${this.baseURL}${endpoint}`, body);
            
            const key = this.getStorageKey(endpoint);
            const existing = localStorage.getItem(key);
            let data = existing ? JSON.parse(existing) : [];
            
            // Add new item with ID and timestamp
            const newItem = {
                ...body,
                id: body.id || Date.now(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            if (Array.isArray(data)) {
                data.push(newItem);
            } else {
                data = newItem;
            }
            
            localStorage.setItem(key, JSON.stringify(data));
            
            return await this.simulateRequest(endpoint, {
                method: 'POST',
                data: newItem
            });
        } catch (error) {
            console.error(`[API Error] POST ${endpoint}:`, error);
            throw error;
        }
    }

    async put(endpoint, id, body = {}) {
        try {
            console.log(`[API] PUT ${this.baseURL}${endpoint}/${id}`, body);
            
            const key = this.getStorageKey(endpoint);
            const existing = localStorage.getItem(key);
            let data = existing ? JSON.parse(existing) : [];
            
            if (Array.isArray(data)) {
                const index = data.findIndex(item => item.id === id);
                if (index !== -1) {
                    data[index] = {
                        ...data[index],
                        ...body,
                        updatedAt: new Date().toISOString()
                    };
                }
            } else {
                data = {
                    ...data,
                    ...body,
                    updatedAt: new Date().toISOString()
                };
            }
            
            localStorage.setItem(key, JSON.stringify(data));
            
            return await this.simulateRequest(endpoint, {
                method: 'PUT',
                data: data
            });
        } catch (error) {
            console.error(`[API Error] PUT ${endpoint}/${id}:`, error);
            throw error;
        }
    }

    async delete(endpoint, id) {
        try {
            console.log(`[API] DELETE ${this.baseURL}${endpoint}/${id}`);
            
            const key = this.getStorageKey(endpoint);
            const existing = localStorage.getItem(key);
            let data = existing ? JSON.parse(existing) : [];
            
            if (Array.isArray(data)) {
                data = data.filter(item => item.id !== id);
            } else {
                data = null;
            }
            
            if (data) {
                localStorage.setItem(key, JSON.stringify(data));
            } else {
                localStorage.removeItem(key);
            }
            
            return await this.simulateRequest(endpoint, {
                method: 'DELETE',
                data: { id, deleted: true }
            });
        } catch (error) {
            console.error(`[API Error] DELETE ${endpoint}/${id}:`, error);
            throw error;
        }
    }

    getStorageKey(endpoint) {
        return `api_${endpoint.replace(/\//g, '_')}`;
    }

    showNotification(message, type) {
        // This can be overridden by each app
        console.log(`[${type.toUpperCase()}] ${message}`);
    }

    // Simulate authentication
    async login(credentials) {
        await new Promise(resolve => setTimeout(resolve, this.requestDelay));
        
        const user = {
            id: 1,
            name: 'Mahesh Suryawanshi',
            email: credentials.email || 'surywanshim786@gmail.com',
            token: 'simulated_jwt_token_' + Date.now()
        };
        
        localStorage.setItem('user_session', JSON.stringify(user));
        
        return {
            success: true,
            data: user,
            message: 'Login successful'
        };
    }

    async logout() {
        await new Promise(resolve => setTimeout(resolve, this.requestDelay));
        
        localStorage.removeItem('user_session');
        
        return {
            success: true,
            message: 'Logout successful'
        };
    }

    getCurrentUser() {
        const session = localStorage.getItem('user_session');
        return session ? JSON.parse(session) : null;
    }

    isAuthenticated() {
        return !!this.getCurrentUser();
    }
}

// Loading state manager
class LoadingManager {
    constructor() {
        this.activeRequests = new Set();
    }

    start(requestId) {
        this.activeRequests.add(requestId);
        this.updateUI();
    }

    stop(requestId) {
        this.activeRequests.delete(requestId);
        this.updateUI();
    }

    isLoading() {
        return this.activeRequests.size > 0;
    }

    updateUI() {
        const loader = document.getElementById('globalLoader');
        if (loader) {
            if (this.isLoading()) {
                loader.classList.add('active');
            } else {
                loader.classList.remove('active');
            }
        }
    }

    createLoader() {
        if (!document.getElementById('globalLoader')) {
            const loader = document.createElement('div');
            loader.id = 'globalLoader';
            loader.innerHTML = `
                <div class="loader-backdrop">
                    <div class="loader-spinner">
                        <div class="spinner"></div>
                        <p>Loading...</p>
                    </div>
                </div>
            `;
            document.body.appendChild(loader);
            
            // Add loader styles
            const style = document.createElement('style');
            style.textContent = `
                #globalLoader {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 9999;
                }
                #globalLoader.active {
                    display: block;
                }
                .loader-backdrop {
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(5px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .loader-spinner {
                    text-align: center;
                    color: white;
                }
                .spinner {
                    width: 50px;
                    height: 50px;
                    border: 5px solid rgba(255, 255, 255, 0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .loader-spinner p {
                    font-size: 1.1rem;
                    font-weight: 600;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Export for use in apps
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APISimulator, LoadingManager };
}
