const API_BASE_URL = 'http://localhost:8080/api';

// Authentication API
const authApi = {
    register: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        return handleResponse(response);
    },

    login: async (credentials) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: credentials.username,
                password: credentials.password
            })
        });
        return handleResponse(response);
    },

    logout: () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    }
};

// Inventory API
const inventoryApi = {
    getAllItems: async () => {
        const response = await fetch(`${API_BASE_URL}/inventory`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    getItem: async (id) => {
        const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    createItem: async (itemData) => {
        const response = await fetch(`${API_BASE_URL}/inventory`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemData)
        });
        return handleResponse(response);
    },

    updateItem: async (id, itemData) => {
        const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
            method: 'PUT',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemData)
        });
        return handleResponse(response);
    },

    deleteItem: async (id) => {
        const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    getLowStockItems: async () => {
        const response = await fetch(`${API_BASE_URL}/inventory/low-stock`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    getExpiringItems: async (daysThreshold = 7) => {
        const response = await fetch(`${API_BASE_URL}/inventory/expiring?daysThreshold=${daysThreshold}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    }
};

// Stock Movement API
const stockMovementApi = {
    createMovement: async (movementData) => {
        const response = await fetch(`${API_BASE_URL}/movements`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movementData)
        });
        return handleResponse(response);
    },

    getMovementsByItem: async (itemId) => {
        const response = await fetch(`${API_BASE_URL}/movements/item/${itemId}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    getMovementsByDateRange: async (startDate, endDate) => {
        const response = await fetch(`${API_BASE_URL}/movements/date-range`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ startDate, endDate })
        });
        return handleResponse(response);
    }
};

// Helper functions
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`
    };
}

async function handleResponse(response) {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'An error occurred');
    }
    return response.json();
}

export { authApi, inventoryApi, stockMovementApi }; 