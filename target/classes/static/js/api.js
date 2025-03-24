// API Service
const API = {
    // Authentication
    login: async (username, password) => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        return handleResponse(response);
    },

    register: async (userData) => {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        return handleResponse(response);
    },

    // Inventory
    getAllItems: async () => {
        const response = await fetch('/api/inventory');
        return handleResponse(response);
    },

    getItemById: async (id) => {
        const response = await fetch(`/api/inventory/${id}`);
        return handleResponse(response);
    },

    createItem: async (itemData) => {
        const response = await fetch('/api/inventory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemData)
        });
        return handleResponse(response);
    },

    updateItem: async (id, itemData) => {
        const response = await fetch(`/api/inventory/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemData)
        });
        return handleResponse(response);
    },

    deleteItem: async (id) => {
        const response = await fetch(`/api/inventory/${id}`, {
            method: 'DELETE'
        });
        return handleResponse(response);
    },

    getLowStockItems: async () => {
        const response = await fetch('/api/inventory/low-stock');
        return handleResponse(response);
    },

    getExpiringItems: async (daysThreshold = 7) => {
        const response = await fetch(`/api/inventory/expiring?daysThreshold=${daysThreshold}`);
        return handleResponse(response);
    },

    // Stock Movements
    createMovement: async (movementData) => {
        const response = await fetch('/api/movements', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movementData)
        });
        return handleResponse(response);
    },

    getMovementsByItemId: async (itemId) => {
        const response = await fetch(`/api/movements/item/${itemId}`);
        return handleResponse(response);
    },

    getMovementsByDateRange: async (startDate, endDate) => {
        const response = await fetch(`/api/movements/date-range?startDate=${startDate}&endDate=${endDate}`);
        return handleResponse(response);
    }
};

// Helper function to handle API responses
async function handleResponse(response) {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'An error occurred');
    }
    return response.json();
}

// Export the API object
window.API = API; 