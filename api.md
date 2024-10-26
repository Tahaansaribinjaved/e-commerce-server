Here’s a consolidated one-page API documentation file that includes all your API endpoints along with their JSON examples. This format will make it easy for frontend developers to reference all the APIs in a single document.

### API Documentation (api.txt)

```
# API Documentation

## User Authentication Routes

### 1. Register User
- **Endpoint:** `POST /api/register`
- **Description:** Register a new user.
- **Request Body:**
  ```json
  {
    "username": "exampleUser",
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User registered successfully."
  }
  ```

### 2. Login User
- **Endpoint:** `POST /api/login`
- **Description:** Log in an existing user.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "jwtToken123",
    "user": {
      "id": "userId1",
      "username": "exampleUser",
      "email": "user@example.com"
    }
  }
  ```

### 3. Forgot Password
- **Endpoint:** `POST /api/forgot-password`
- **Description:** Request a password reset link.
- **Request Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Password reset link sent."
  }
  ```

### 4. Reset Password
- **Endpoint:** `POST /api/reset-password`
- **Description:** Reset the password using a token.
- **Request Body:**
  ```json
  {
    "token": "resetToken123",
    "newPassword": "newSecurePassword123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Password has been reset successfully."
  }
  ```

---

## Product Routes

### 5. Create Product (Admin Only)
- **Endpoint:** `POST /api/admin/products`
- **Description:** Create a new product.
- **Request Body:**
  ```json
  {
    "name": "New Product",
    "price": 29.99,
    "description": "Product description",
    "category": "Category Name"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Product created successfully.",
    "product": {
      "id": "productId1",
      "name": "New Product",
      "price": 29.99,
      "description": "Product description",
      "category": "Category Name"
    }
  }
  ```

### 6. Get All Products (User View)
- **Endpoint:** `GET /api/products`
- **Description:** Get a list of all products.
- **Response:**
  ```json
  [
    {
      "id": "productId1",
      "name": "Product 1",
      "price": 19.99,
      "description": "Description of product 1",
      "category": "Category 1"
    },
    {
      "id": "productId2",
      "name": "Product 2",
      "price": 29.99,
      "description": "Description of product 2",
      "category": "Category 2"
    }
  ]
  ```

### 7. Get Product by ID
- **Endpoint:** `GET /api/products/:id`
- **Description:** Get details of a single product by ID.
- **Response:**
  ```json
  {
    "id": "productId1",
    "name": "Product 1",
    "price": 19.99,
    "description": "Description of product 1",
    "category": "Category 1"
  }
  ```

### 8. Update Product (Admin Only)
- **Endpoint:** `PUT /api/admin/products/:id`
- **Description:** Update product details.
- **Request Body:**
  ```json
  {
    "name": "Updated Product",
    "price": 24.99,
    "description": "Updated description",
    "category": "Updated Category"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Product updated successfully."
  }
  ```

### 9. Delete Product (Admin Only)
- **Endpoint:** `DELETE /api/admin/products/:id`
- **Description:** Delete a product by ID.
- **Response:**
  ```json
  {
    "message": "Product deleted successfully."
  }
  ```

---

## Order Routes

### 10. Create Order
- **Endpoint:** `POST /api/orders`
- **Description:** Create a new order.
- **Request Body:**
  ```json
  {
    "productId": "productId1",
    "quantity": 2,
    "shippingAddress": "123 Street Name, City, Country"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Order created successfully.",
    "order": {
      "id": "orderId1",
      "status": "Pending",
      "shippingAddress": "123 Street Name, City, Country"
    }
  }
  ```

### 11. Get Order by ID
- **Endpoint:** `GET /api/orders/:id`
- **Description:** Get details of an order by ID.
- **Response:**
  ```json
  {
    "id": "orderId1",
    "userId": "userId1",
    "products": [
      {
        "productId": "productId1",
        "quantity": 2
      }
    ],
    "status": "Pending",
    "shippingAddress": "123 Street Name, City, Country"
  }
  ```

### 12. Get All Orders
- **Endpoint:** `GET /api/orders`
- **Description:** Get a list of all orders. Admins see all; users see their own orders.
- **Response:**
  ```json
  [
    {
      "id": "orderId1",
      "userId": "userId1",
      "status": "Pending",
      "shippingAddress": "123 Street Name, City, Country"
    },
    {
      "id": "orderId2",
      "userId": "userId2",
      "status": "Delivered",
      "shippingAddress": "456 Another St, City, Country"
    }
  ]
  ```

### 13. Update Order Status (Admin Only)
- **Endpoint:** `PUT /api/orders/:id/status`
- **Description:** Update the status of an order.
- **Request Body:**
  ```json
  {
    "status": "Shipped"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Order status updated successfully."
  }
  ```

### 14. Cancel Order
- **Endpoint:** `PUT /api/orders/:id/cancel`
- **Description:** Cancel an order.
- **Response:**
  ```json
  {
    "message": "Order canceled successfully."
  }
  ```

### 15. Modify Order (Admin Only)
- **Endpoint:** `PUT /api/orders/:id/modify`
- **Description:** Modify an existing order.
- **Response:**
  ```json
  {
    "message": "Order modified successfully."
  }
  ```

### 16. Mark Order as Delivered (Admin Only)
- **Endpoint:** `POST /api/orders/:id/deliver`
- **Description:** Mark an order as delivered.
- **Response:**
  ```json
  {
    "message": "Order marked as delivered."
  }
  ```

---

## User Profile Routes

### 17. Get User Profile
- **Endpoint:** `GET /api/users/:id`
- **Description:** Get user profile details by ID.
- **Response:**
  ```json
  {
    "id": "userId1",
    "username": "exampleUser",
    "email": "user@example.com"
  }
  ```

### 18. Update User Profile
- **Endpoint:** `PUT /api/users/:id`
- **Description:** Update user profile details.
- **Request Body:**
  ```json
  {
    "username": "updatedUser",
    "email": "updated@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User profile updated successfully."
  }
  ```

```

### Saving the Documentation

You can save the above content as `api.txt` in your project directory. This file provides a comprehensive overview of all your API endpoints along with example JSON requests and responses, making it a valuable resource for frontend developers. If you need any modifications or additional information, feel free to ask!