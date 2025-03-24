import { authApi, inventoryApi, stockMovementApi } from './api.js';

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const inventoryTable = document.getElementById('inventoryTable');
const stockMovementsTable = document.getElementById('stockMovementsTable');
const addItemForm = document.getElementById('addItemForm');
const addMovementForm = document.getElementById('addMovementForm');
const reportForm = document.getElementById('reportForm');
const reportResults = document.getElementById('reportResults');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
});

function setupEventListeners() {
    // Login button click
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const modal = new bootstrap.Modal(loginModal);
            modal.show();
        });
    }

    // Register button click
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            const modal = new bootstrap.Modal(registerModal);
            modal.show();
        });
    }

    // Logout button click
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            authApi.logout();
        });
    }

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            
            try {
                const response = await authApi.login({ username, password });
                localStorage.setItem('token', response.token);
                bootstrap.Modal.getInstance(loginModal).hide();
                showSuccess('Login successful!');
                loadInitialData();
            } catch (error) {
                showError(error.message);
            }
        });
    }

    // Register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;
            const email = document.getElementById('registerEmail').value;
            
            try {
                await authApi.register({ username, password, email });
                bootstrap.Modal.getInstance(registerModal).hide();
                showSuccess('Registration successful! Please login.');
                bootstrap.Modal.getInstance(loginModal).show();
            } catch (error) {
                showError(error.message);
            }
        });
    }

    // Add Item form submission
    if (addItemForm) {
        addItemForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(addItemForm);
            const itemData = {
                name: formData.get('name'),
                quantity: parseInt(formData.get('quantity')),
                category: formData.get('category'),
                expiryDate: formData.get('expiryDate'),
                supplierName: formData.get('supplierName'),
                supplierContact: formData.get('supplierContact'),
                lowStockThreshold: parseInt(formData.get('lowStockThreshold'))
            };
            
            try {
                await inventoryApi.createItem(itemData);
                bootstrap.Modal.getInstance(document.getElementById('addItemModal')).hide();
                showSuccess('Item added successfully!');
                loadInitialData();
            } catch (error) {
                showError(error.message);
            }
        });
    }

    // Add Movement form submission
    if (addMovementForm) {
        addMovementForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(addMovementForm);
            const movementData = {
                inventoryItemId: parseInt(formData.get('inventoryItemId')),
                quantity: parseInt(formData.get('quantity')),
                type: formData.get('type'),
                notes: formData.get('notes')
            };
            
            try {
                await stockMovementApi.createMovement(movementData);
                bootstrap.Modal.getInstance(document.getElementById('addMovementModal')).hide();
                showSuccess('Movement recorded successfully!');
                loadStockMovements();
            } catch (error) {
                showError(error.message);
            }
        });
    }

    // Report form submission
    if (reportForm) {
        reportForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;
            
            try {
                const movements = await stockMovementApi.getMovementsByDateRange(startDate, endDate);
                displayReportResults(movements);
            } catch (error) {
                showError(error.message);
            }
        });
    }

    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.getAttribute('data-page');
            showPage(page);
        });
    });
}

function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
}

async function initializeApp() {
    const token = localStorage.getItem('token');
    if (!token) {
        showLoginModal();
        return;
    }
    
    try {
        await loadInitialData();
    } catch (error) {
        if (error.message.includes('401') || error.message.includes('403')) {
            localStorage.removeItem('token');
            showLoginModal();
        } else {
            showError(error.message);
        }
    }
}

async function loadInitialData() {
    try {
        const [items, lowStockItems, expiringItems] = await Promise.all([
            inventoryApi.getAllItems(),
            inventoryApi.getLowStockItems(),
            inventoryApi.getExpiringItems()
        ]);
        
        displayInventoryItems(items);
        updateDashboard(lowStockItems, expiringItems);
    } catch (error) {
        throw error;
    }
}

function displayInventoryItems(items) {
    if (!inventoryTable) return;
    
    const tbody = inventoryTable.querySelector('tbody');
    tbody.innerHTML = '';
    
    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.category}</td>
            <td>${new Date(item.expiryDate).toLocaleDateString()}</td>
            <td>${item.supplierName}</td>
            <td>${item.supplierContact}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editItem(${item.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteItem(${item.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateDashboard(lowStockItems, expiringItems) {
    const lowStockCount = document.getElementById('lowStockCount');
    const expiringCount = document.getElementById('expiringCount');
    const totalItems = document.getElementById('totalItems');
    
    if (lowStockCount) lowStockCount.textContent = lowStockItems.length;
    if (expiringCount) expiringCount.textContent = expiringItems.length;
    if (totalItems) totalItems.textContent = lowStockItems.length + expiringItems.length;
}

async function loadStockMovements() {
    try {
        const movements = await stockMovementApi.getMovementsByDateRange(
            new Date().toISOString().split('T')[0],
            new Date().toISOString().split('T')[0]
        );
        displayStockMovements(movements);
    } catch (error) {
        showError(error.message);
    }
}

function displayStockMovements(movements) {
    if (!stockMovementsTable) return;
    
    const tbody = stockMovementsTable.querySelector('tbody');
    tbody.innerHTML = '';
    
    movements.forEach(movement => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${movement.inventoryItem.name}</td>
            <td>${movement.quantity}</td>
            <td>${movement.type}</td>
            <td>${new Date(movement.movementDate).toLocaleString()}</td>
            <td>${movement.notes || ''}</td>
        `;
        tbody.appendChild(row);
    });
}

function displayReportResults(movements) {
    if (!reportResults) return;
    
    reportResults.innerHTML = `
        <h3>Report Results</h3>
        <table class="table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>
                ${movements.map(movement => `
                    <tr>
                        <td>${movement.inventoryItem.name}</td>
                        <td>${movement.quantity}</td>
                        <td>${movement.type}</td>
                        <td>${new Date(movement.movementDate).toLocaleString()}</td>
                        <td>${movement.notes || ''}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function showLoginModal() {
    const modal = new bootstrap.Modal(loginModal);
    modal.show();
}

function showError(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Find the first container element
    const container = document.querySelector('.container');
    if (container) {
        // Insert at the beginning of the container
        container.insertBefore(alertDiv, container.firstChild);
    }
}

function showSuccess(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Find the first container element
    const container = document.querySelector('.container');
    if (container) {
        // Insert at the beginning of the container
        container.insertBefore(alertDiv, container.firstChild);
    }
}

// Make functions available globally
window.editItem = async (id) => {
    try {
        const item = await inventoryApi.getItem(id);
        // Populate edit form and show modal
        document.getElementById('editItemId').value = item.id;
        document.getElementById('editItemName').value = item.name;
        document.getElementById('editItemQuantity').value = item.quantity;
        document.getElementById('editItemCategory').value = item.category;
        document.getElementById('editItemExpiryDate').value = item.expiryDate;
        document.getElementById('editItemSupplierName').value = item.supplierName;
        document.getElementById('editItemSupplierContact').value = item.supplierContact;
        document.getElementById('editItemLowStockThreshold').value = item.lowStockThreshold;
        
        const modal = new bootstrap.Modal(document.getElementById('editItemModal'));
        modal.show();
    } catch (error) {
        showError(error.message);
    }
};

window.deleteItem = async (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
        try {
            await inventoryApi.deleteItem(id);
            showSuccess('Item deleted successfully!');
            loadInitialData();
        } catch (error) {
            showError(error.message);
        }
    }
}; 