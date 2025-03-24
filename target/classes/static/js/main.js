// Main JavaScript file
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    initializeApp();
});

// Application state
let currentUser = null;
let inventoryItems = [];
let stockMovements = [];

// Initialize application
async function initializeApp() {
    // Check authentication status
    checkAuthStatus();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Load initial data
    await loadInitialData();
}

// Check authentication status
async function checkAuthStatus() {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            // TODO: Implement token validation
            showPage('dashboard');
        } else {
            showPage('login');
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        showPage('login');
    }
}

// Initialize event listeners
function initializeEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.getAttribute('data-page');
            showPage(page);
        });
    });

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Add Item form
    const addItemForm = document.getElementById('addItemForm');
    if (addItemForm) {
        addItemForm.addEventListener('submit', handleAddItem);
    }

    // Add Movement form
    const addMovementForm = document.getElementById('addMovementForm');
    if (addMovementForm) {
        addMovementForm.addEventListener('submit', handleAddMovement);
    }

    // Report form
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        reportForm.addEventListener('submit', handleGenerateReport);
    }
}

// Load initial data
async function loadInitialData() {
    try {
        // Load inventory items
        inventoryItems = await API.getAllItems();
        updateInventoryTable();

        // Load low stock items
        const lowStockItems = await API.getLowStockItems();
        updateLowStockItems(lowStockItems);

        // Load expiring items
        const expiringItems = await API.getExpiringItems();
        updateExpiringItems(expiringItems);

        // Load recent stock movements
        const today = new Date();
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        stockMovements = await API.getMovementsByDateRange(
            lastWeek.toISOString(),
            today.toISOString()
        );
        updateStockMovementsTable();
    } catch (error) {
        console.error('Failed to load initial data:', error);
        showError('Failed to load data. Please try again.');
    }
}

// Show page
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
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await API.login(username, password);
        localStorage.setItem('token', response.token);
        currentUser = response.user;
        showPage('dashboard');
        await loadInitialData();
        showSuccess('Login successful!');
    } catch (error) {
        showError(error.message);
    }
}

// Handle register
async function handleRegister(e) {
    e.preventDefault();
    const userData = {
        username: document.getElementById('registerUsername').value,
        password: document.getElementById('registerPassword').value,
        email: document.getElementById('registerEmail').value
    };

    try {
        await API.register(userData);
        showSuccess('Registration successful! Please login.');
        showPage('login');
    } catch (error) {
        showError(error.message);
    }
}

// Handle add item
async function handleAddItem(e) {
    e.preventDefault();
    const itemData = {
        name: document.getElementById('itemName').value,
        quantity: parseInt(document.getElementById('itemQuantity').value),
        category: document.getElementById('itemCategory').value,
        expiryDate: document.getElementById('itemExpiryDate').value,
        supplierName: document.getElementById('itemSupplierName').value,
        supplierContact: document.getElementById('itemSupplierContact').value,
        lowStockThreshold: parseInt(document.getElementById('itemLowStockThreshold').value)
    };

    try {
        await API.createItem(itemData);
        await loadInitialData();
        $('#addItemModal').modal('hide');
        showSuccess('Item added successfully!');
    } catch (error) {
        showError(error.message);
    }
}

// Handle add movement
async function handleAddMovement(e) {
    e.preventDefault();
    const movementData = {
        itemId: parseInt(document.getElementById('movementItemId').value),
        quantity: parseInt(document.getElementById('movementQuantity').value),
        type: document.getElementById('movementType').value,
        notes: document.getElementById('movementNotes').value
    };

    try {
        await API.createMovement(movementData);
        await loadInitialData();
        $('#addMovementModal').modal('hide');
        showSuccess('Movement recorded successfully!');
    } catch (error) {
        showError(error.message);
    }
}

// Handle generate report
async function handleGenerateReport(e) {
    e.preventDefault();
    const startDate = document.getElementById('reportStartDate').value;
    const endDate = document.getElementById('reportEndDate').value;

    try {
        const movements = await API.getMovementsByDateRange(startDate, endDate);
        displayReport(movements);
    } catch (error) {
        showError(error.message);
    }
}

// Update inventory table
function updateInventoryTable() {
    const tbody = document.querySelector('#inventoryTable tbody');
    tbody.innerHTML = '';

    inventoryItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.category}</td>
            <td>${new Date(item.expiryDate).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editItem(${item.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteItem(${item.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Update low stock items
function updateLowStockItems(items) {
    const container = document.getElementById('lowStockItems');
    container.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card mb-3';
        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text">Current Stock: ${item.quantity}</p>
                <p class="card-text">Threshold: ${item.lowStockThreshold}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

// Update expiring items
function updateExpiringItems(items) {
    const container = document.getElementById('expiringItems');
    container.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card mb-3';
        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text">Expires: ${new Date(item.expiryDate).toLocaleDateString()}</p>
                <p class="card-text">Current Stock: ${item.quantity}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

// Update stock movements table
function updateStockMovementsTable() {
    const tbody = document.querySelector('#stockMovementsTable tbody');
    tbody.innerHTML = '';

    stockMovements.forEach(movement => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${movement.itemName}</td>
            <td>${movement.quantity}</td>
            <td>${movement.type}</td>
            <td>${new Date(movement.movementDate).toLocaleString()}</td>
            <td>${movement.notes || '-'}</td>
        `;
        tbody.appendChild(row);
    });
}

// Display report
function displayReport(movements) {
    const container = document.getElementById('reportResults');
    container.innerHTML = '';

    // Group movements by item
    const groupedMovements = movements.reduce((acc, movement) => {
        if (!acc[movement.itemName]) {
            acc[movement.itemName] = [];
        }
        acc[movement.itemName].push(movement);
        return acc;
    }, {});

    // Create report cards
    Object.entries(groupedMovements).forEach(([itemName, itemMovements]) => {
        const card = document.createElement('div');
        card.className = 'card mb-3';
        
        const totalIn = itemMovements
            .filter(m => m.type === 'IN')
            .reduce((sum, m) => sum + m.quantity, 0);
        
        const totalOut = itemMovements
            .filter(m => m.type === 'OUT')
            .reduce((sum, m) => sum + m.quantity, 0);

        card.innerHTML = `
            <div class="card-header">
                <h5 class="mb-0">${itemName}</h5>
            </div>
            <div class="card-body">
                <p>Total In: ${totalIn}</p>
                <p>Total Out: ${totalOut}</p>
                <p>Net Change: ${totalIn - totalOut}</p>
                <table class="table table-sm">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Quantity</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemMovements.map(m => `
                            <tr>
                                <td>${new Date(m.movementDate).toLocaleString()}</td>
                                <td>${m.type}</td>
                                <td>${m.quantity}</td>
                                <td>${m.notes || '-'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        container.appendChild(card);
    });
}

// Show success message
function showSuccess(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success alert-dismissible fade show';
    alert.innerHTML = `
        ${message}
        <button type="button" class="close" data-dismiss="alert">
            <span>&times;</span>
        </button>
    `;
    document.getElementById('alerts').appendChild(alert);
    setTimeout(() => alert.remove(), 5000);
}

// Show error message
function showError(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger alert-dismissible fade show';
    alert.innerHTML = `
        ${message}
        <button type="button" class="close" data-dismiss="alert">
            <span>&times;</span>
        </button>
    `;
    document.getElementById('alerts').appendChild(alert);
    setTimeout(() => alert.remove(), 5000);
}

// Edit item
async function editItem(id) {
    const item = inventoryItems.find(i => i.id === id);
    if (!item) return;

    document.getElementById('editItemId').value = item.id;
    document.getElementById('editItemName').value = item.name;
    document.getElementById('editItemQuantity').value = item.quantity;
    document.getElementById('editItemCategory').value = item.category;
    document.getElementById('editItemExpiryDate').value = item.expiryDate;
    document.getElementById('editItemSupplierName').value = item.supplierName;
    document.getElementById('editItemSupplierContact').value = item.supplierContact;
    document.getElementById('editItemLowStockThreshold').value = item.lowStockThreshold;

    $('#editItemModal').modal('show');
}

// Delete item
async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
        await API.deleteItem(id);
        await loadInitialData();
        showSuccess('Item deleted successfully!');
    } catch (error) {
        showError(error.message);
    }
} 