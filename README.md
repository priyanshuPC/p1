# Smart Inventory Management System (SIMS)

A web-based application for managing pantry inventory with real-time tracking, alerts, and reporting capabilities.

## Features

- User Management (Registration, Login, Logout)
- Inventory Management (CRUD operations)
- Real-time Stock Tracking
- Low Stock and Expiry Alerts
- Report Generation
- Supplier Management

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Java 17 with Spring Boot
- Database: PostgreSQL
- Version Control: GitHub

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- PostgreSQL 12 or higher
- Git

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd smart-inventory-management
   ```

2. Create a PostgreSQL database:

   ```sql
   CREATE DATABASE pantry_db;
   ```

3. Update the database configuration in `src/main/resources/application.properties`:

   - Set your database username and password
   - Update the database URL if needed

4. Build the project:

   ```bash
   mvn clean install
   ```

5. Run the application:
   ```bash
   mvn spring-boot:run
   ```

The application will be available at `http://localhost:8080`

## API Endpoints

### User Management

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/logout` - Logout user

### Inventory Management

- GET `/api/inventory` - Get all inventory items
- POST `/api/inventory` - Add new inventory item
- PUT `/api/inventory/{id}` - Update inventory item
- DELETE `/api/inventory/{id}` - Delete inventory item

### Alerts

- GET `/api/alerts/low-stock` - Get low stock alerts
- GET `/api/alerts/expiry` - Get expiry alerts

### Reports

- GET `/api/reports/daily` - Generate daily report
- GET `/api/reports/weekly` - Generate weekly report

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
