-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL,
    enabled BOOLEAN DEFAULT true
);

-- Inventory items table
CREATE TABLE IF NOT EXISTS inventory_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL,
    category VARCHAR(50) NOT NULL,
    expiry_date DATE,
    supplier_name VARCHAR(100),
    supplier_contact VARCHAR(100),
    low_stock_threshold INTEGER,
    created_at DATE NOT NULL,
    updated_at DATE NOT NULL
);

-- Stock movements table
CREATE TABLE IF NOT EXISTS stock_movements (
    id SERIAL PRIMARY KEY,
    inventory_item_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL,
    movement_date TIMESTAMP NOT NULL,
    notes TEXT,
    FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id)
); 