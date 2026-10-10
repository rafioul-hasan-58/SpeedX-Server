# SpeedX API Documentation

**Base URL:** `http://localhost:5000/api` (Development) or your deployed production server URL.

All responses follow the standard JSON response structure:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Message description",
  "data": { ... }
}
```

---

## 🔐 1. Authentication APIs (`/auth`)

### 1.1 Register User
- **Method:** `POST`
- **Endpoint:** `/users/register`
- **Auth Required:** No
- **Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response (`201 Created`):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "660c1d2e...",
      "fullName": "John Doe",
      "email": "user@example.com",
      "roles": ["CUSTOMER"],
      "activeRole": "CUSTOMER",
      "isVerified": false,
      "isBlocked": false
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.2 Login User
- **Method:** `POST`
- **Endpoint:** `/auth/login`
- **Auth Required:** No
- **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response (`200 OK`):**
*(Also sets `refreshToken` in HTTP-only cookie)*
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.3 Google Login
- **Method:** `POST`
- **Endpoint:** `/auth/google-login`
- **Auth Required:** No
- **Request Body:**
```json
{
  "token": "<GOOGLE_ID_TOKEN>"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Google login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.4 Refresh Token
- **Method:** `POST`
- **Endpoint:** `/auth/refresh-token`
- **Auth Required:** Yes (via `refreshToken` Cookie)
- **Request Body:** None
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.5 Change Password
- **Method:** `PATCH`
- **Endpoint:** `/auth/change-password`
- **Auth Required:** Yes (`Bearer <accessToken>`)
- **Request Body:**
```json
{
  "oldPassword": "password123",
  "newPassword": "newPassword123"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password updated successfully",
  "data": {
    "message": "Password Changed!"
  }
}
```

---

### 1.6 Forgot Password (Send OTP)
- **Method:** `POST`
- **Endpoint:** `/auth/forgot-password`
- **Auth Required:** No
- **Request Body:**
```json
{
  "email": "user@example.com"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "OTP sent successfully",
  "data": {
    "message": "OTP sent successfully"
  }
}
```

---

### 1.7 Verify Forgot Password OTP
- **Method:** `POST`
- **Endpoint:** `/auth/verify-forgot-password-otp`
- **Auth Required:** No
- **Request Body:**
```json
{
  "email": "user@example.com",
  "otp": 123456
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "OTP verified in forgot password!",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.8 Verify OTP (Account Verification)
- **Method:** `POST`
- **Endpoint:** `/auth/verify-otp`
- **Auth Required:** No
- **Request Body:**
```json
{
  "email": "user@example.com",
  "otp": 123456
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "OTP verified successfully!",
  "data": {
    "message": "OTP Verified!"
  }
}
```

---

### 1.9 Resend OTP
- **Method:** `POST`
- **Endpoint:** `/auth/resend-otp`
- **Auth Required:** No
- **Request Body:**
```json
{
  "email": "user@example.com"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "New OTP has been sent to your email for reset password.",
  "data": {
    "message": "New OTP has been sent to your email for reset password."
  }
}
```

---

### 1.10 Reset Password
- **Method:** `POST`
- **Endpoint:** `/auth/reset-password`
- **Auth Required:** No
- **Request Body:**
```json
{
  "email": "user@example.com",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password reset successfully!",
  "data": {
    "message": "Password reset successfully!"
  }
}
```

---

## 👤 2. User Management APIs (`/users`)

### 2.1 Get My Profile
- **Method:** `GET`
- **Endpoint:** `/users/my-profile`
- **Auth Required:** Yes (`Bearer <accessToken>`)
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile retrieved successfully",
  "data": {
    "_id": "660c1d2e...",
    "fullName": "John Doe",
    "email": "user@example.com",
    "roles": ["CUSTOMER"],
    "activeRole": "CUSTOMER",
    "profileImage": "https://...",
    "location": "Dhaka, Bangladesh",
    "bio": "Bike enthusiast",
    "isBlocked": false,
    "isVerified": true
  }
}
```

---

### 2.2 Update Profile
- **Method:** `PATCH`
- **Endpoint:** `/users/update-profile`
- **Auth Required:** Yes (`Bearer <accessToken>`)
- **Content-Type:** `multipart/form-data`
- **Form Fields:**
  - `profileImage`: (File, optional)
  - `bodyData`: (JSON String, optional)
```json
{
  "fullName": "John Updated",
  "location": "Gazipur",
  "bio": "Rider"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile updated successfully",
  "data": {
    "_id": "660c1d2e...",
    "fullName": "John Updated",
    "profileImage": "https://...",
    "location": "Gazipur"
  }
}
```

---

### 2.3 Become Seller / Add Seller Role
- **Method:** `POST`
- **Endpoint:** `/users/add-role`
- **Auth Required:** Yes (`Bearer <accessToken>`, role: `CUSTOMER`)
- **Request Body:** None
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Seller role added successfully",
  "data": {
    "_id": "660c1d2e...",
    "roles": ["CUSTOMER", "SELLER"],
    "activeRole": "SELLER"
  }
}
```

---

### 2.4 Switch Active Role
- **Method:** `POST`
- **Endpoint:** `/users/switch-role`
- **Auth Required:** Yes (`Bearer <accessToken>`, role: `CUSTOMER` or `SELLER`)
- **Request Body:** None
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Role switched successfully",
  "data": {
    "_id": "660c1d2e...",
    "activeRole": "CUSTOMER"
  }
}
```

---

### 2.5 Get All Users (Admin)
- **Method:** `GET`
- **Endpoint:** `/users/get-all-users`
- **Auth Required:** No
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "All users retrieved successfully",
  "data": [
    {
      "_id": "660c1d2e...",
      "fullName": "John Doe",
      "email": "user@example.com",
      "roles": ["CUSTOMER"],
      "activeRole": "CUSTOMER"
    }
  ]
}
```

---

### 2.6 Delete User (Admin)
- **Method:** `DELETE`
- **Endpoint:** `/users/delete/:id`
- **Auth Required:** No
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User deleted successfully",
  "data": null
}
```

---

## 🏍️ 3. Products APIs (`/products`)

### 3.1 Get All Products (Filter & Pagination)
- **Method:** `GET`
- **Endpoint:** `/products/get-all-products`
- **Auth Required:** No
- **Query Parameters:**
  - `page`: Page number (default: `1`)
  - `limit`: Items per page (default: `6`)
  - `searchTerm`: Search by product name or brand
  - `filterBybrand`: e.g. `"Yamaha"`, `"Honda"`
  - `filterBycolor`: e.g. `"Black"`, `"Red"`
  - `filterBytype`: `"new"`, `"used"`, `"refurbished"`
  - `filterByBikeType`: `"bike"`, `"scooter"`
  - `minPrice`: Minimum price
  - `maxPrice`: Maximum price
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Products retrieved successfully",
  "meta": {
    "total": 12,
    "page": 1,
    "limit": 6,
    "totalPage": 2
  },
  "data": [
    {
      "_id": "660c213f...",
      "name": "Yamaha R15 V4",
      "brandName": "Yamaha",
      "price": 550000,
      "color": "Racing Blue",
      "bikeType": "bike",
      "type": "new",
      "stocks": 5,
      "inStock": true,
      "images": ["https://..."],
      "description": "<p>Description</p>"
    }
  ]
}
```

---

### 3.2 Get Single Product
- **Method:** `GET`
- **Endpoint:** `/products/get-product/:id`
- **Auth Required:** No
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Product retrieved successfully",
  "data": {
    "_id": "660c213f...",
    "name": "Yamaha R15 V4",
    "brandName": "Yamaha",
    "price": 550000,
    "color": "Racing Blue",
    "stocks": 5,
    "inStock": true,
    "description": "Full bike details"
  }
}
```

---

### 3.3 Add Product
- **Method:** `POST`
- **Endpoint:** `/products/add-product`
- **Auth Required:** No
- **Request Body:**
```json
{
  "name": "Yamaha MT-15",
  "brandName": "Yamaha",
  "price": 430000,
  "description": "155cc Naked street fighter",
  "stocks": 10,
  "color": "Dark Matte Blue",
  "bikeType": "bike",
  "type": "new"
}
```
- **Response (`201 Created`):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Product added successfully",
  "data": {
    "_id": "660c213f...",
    "name": "Yamaha MT-15",
    "price": 430000,
    "stocks": 10,
    "inStock": true
  }
}
```

---

### 3.4 Update Product
- **Method:** `PATCH`
- **Endpoint:** `/products/update-product/:id`
- **Auth Required:** Yes (`ADMIN` or `CUSTOMER`)
- **Request Body:**
```json
{
  "price": 420000,
  "stocks": 8
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Product updated successfully",
  "data": {
    "_id": "660c213f...",
    "price": 420000,
    "stocks": 8
  }
}
```

---

### 3.5 Remove Product Image
- **Method:** `PATCH`
- **Endpoint:** `/products/remove-product-image/:id`
- **Auth Required:** No
- **Request Body:**
```json
{
  "image": "https://mamamoko.s3.us-east-2.amazonaws.com/image-to-remove.jpg"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Image removed successfully",
  "data": { ... }
}
```

---

### 3.6 Get Seller Products (My Products)
- **Method:** `GET`
- **Endpoint:** `/products/get-my`
- **Auth Required:** Yes (`Bearer <accessToken>`, role: `SELLER`)
- **Query Parameters:** `page`, `limit`, `searchTerm`
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Products retrieved successfully",
  "meta": { "total": 3, "page": 1, "limit": 6, "totalPage": 1 },
  "data": [ ... ]
}
```

---

### 3.7 Get Available Stocks
- **Method:** `GET`
- **Endpoint:** `/products/get-available-stocks`
- **Auth Required:** No
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Stocks retrieved successfully",
  "data": [ ... ]
}
```

---

### 3.8 Delete Product
- **Method:** `DELETE`
- **Endpoint:** `/products/delete-product/:id`
- **Auth Required:** Yes (`ADMIN` or `CUSTOMER`)
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Product deleted successfully",
  "data": null
}
```

---

## 🛒 4. Orders & Payment APIs (`/orders`)

### 4.1 Place Order (Checkout)
- **Method:** `POST`
- **Endpoint:** `/orders/add-order`
- **Auth Required:** Yes (`Bearer <accessToken>`, role: `CUSTOMER`)
- **Request Body:**
```json
{
  "items": [
    {
      "product": "660c213f...",
      "quantity": 1
    }
  ],
  "contact": 1752966422,
  "address": "Dhaka, Bangladesh",
  "orderNote": "Please deliver in afternoon"
}
```
- **Response (`201 Created`):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Order placed successfully",
  "data": {
    "order": {
      "_id": "660d5b9a...",
      "buyer": "660c1d2e...",
      "totalPrice": 550000,
      "status": "Pending",
      "address": "Dhaka, Bangladesh"
    },
    "payment": {
      "checkout_url": "https://sandbox.shurjopayment.com/pay/...",
      "sp_order_id": "SP660d5b9a",
      "transactionStatus": "Initiated"
    }
  }
}
```

---

### 4.2 Verify Payment (ShurjoPay Callback)
- **Method:** `POST`
- **Endpoint:** `/orders/verify-order?order_id=<ORDER_ID>`
- **Auth Required:** No
- **Query Parameter:** `order_id` (ShurjoPay transaction / order id)
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Payment verified successfully",
  "data": [
    {
      "order_id": "660d5b9a...",
      "bank_status": "Success",
      "sp_code": "1000",
      "sp_message": "Success"
    }
  ]
}
```

---

### 4.3 Get My Orders
- **Method:** `GET`
- **Endpoint:** `/orders/get-my-orders`
- **Auth Required:** Yes (`Bearer <accessToken>`, role: `CUSTOMER`)
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "My orders retrieved successfully",
  "data": [
    {
      "_id": "660d5b9a...",
      "items": [ ... ],
      "totalPrice": 550000,
      "status": "Pending"
    }
  ]
}
```

---

### 4.4 Get All Orders (Admin)
- **Method:** `GET`
- **Endpoint:** `/orders/get-all-orders`
- **Auth Required:** No
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Orders retrieved successfully",
  "meta": { "total": 15, "page": 1, "limit": 10, "totalPage": 2 },
  "data": [ ... ]
}
```

---

### 4.5 Get Today's Sales (Admin)
- **Method:** `GET`
- **Endpoint:** `/orders/get-today-sale`
- **Auth Required:** No
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Today's sales retrieved successfully",
  "data": {
    "totalAmount": 1100000,
    "totalOrders": 2
  }
}
```

---

### 4.6 Get Total Sales (Admin)
- **Method:** `GET`
- **Endpoint:** `/orders/get-total-sale`
- **Auth Required:** No
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Total sales retrieved successfully",
  "data": {
    "totalRevenue": 8500000,
    "totalOrders": 18
  }
}
```

---

### 4.7 Change Order Status (Admin)
- **Method:** `PATCH`
- **Endpoint:** `/orders/change-status/:id`
- **Auth Required:** No
- **Request Body:**
```json
{
  "status": "Delivered"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Order status updated successfully",
  "data": { ... }
}
```

---

### 4.8 Delete Order (Admin)
- **Method:** `DELETE`
- **Endpoint:** `/orders/delete-order/:id`
- **Auth Required:** No
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Order deleted successfully",
  "data": null
}
```

---

## 🤖 5. Chatbot APIs (`/chatbot`)

*Powered by DeepSeek (`deepseek-chat`)*

### 5.1 Send Message to AI Chatbot
- **Method:** `POST`
- **Endpoint:** `/chatbot/chat`
- **Auth Required:** Yes (`Bearer <accessToken>`)
- **Request Body:**
```json
{
  "message": "Show me Yamaha bikes"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Chat response generated successfully",
  "data": {
    "reply": "Here are the Yamaha bikes available in our shop: 1. Yamaha R15 V4 - 550,000 BDT, 2. Yamaha MT-15 - 430,000 BDT."
  }
}
```

---

### 5.2 Get Chat History
- **Method:** `GET`
- **Endpoint:** `/chatbot/history`
- **Auth Required:** Yes (`Bearer <accessToken>`)
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Chat history retrieved successfully",
  "data": [
    {
      "role": "user",
      "content": "Show me Yamaha bikes"
    },
    {
      "role": "assistant",
      "content": "Here are the Yamaha bikes..."
    }
  ]
}
```

---

### 5.3 Clear Chat History
- **Method:** `DELETE`
- **Endpoint:** `/chatbot/clear`
- **Auth Required:** Yes (`Bearer <accessToken>`)
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Chat history cleared successfully",
  "data": null
}
```

---

## 🏬 6. Store APIs (`/store`)

### 6.1 Create Store
- **Method:** `POST`
- **Endpoint:** `/store/create`
- **Auth Required:** Yes (`Bearer <accessToken>`)
- **Request Body:**
```json
{
  "storeName": "SpeedX Motors Gazipur",
  "description": "Authorized dealer of premium bikes",
  "address": "Shaverchala, Sreepur, Gazipur",
  "phone": "01752966422"
}
```
- **Response (`201 Created`):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Store created successfully!",
  "data": {
    "_id": "660c301a...",
    "owner": "660c1d2e...",
    "storeName": "SpeedX Motors Gazipur",
    "description": "Authorized dealer of premium bikes",
    "address": "Shaverchala, Sreepur, Gazipur",
    "phone": "01752966422"
  }
}
```

---

## 💬 7. Real-Time Chat & Rooms APIs

### 7.1 Create or Get Chat Room
- **Method:** `POST`
- **Endpoint:** `/chatRooms/create-chatRoom`
- **Auth Required:** No
- **Request Body:**
```json
{
  "createdBy": "<USER_OBJECT_ID>",
  "participantId": "<PARTICIPANT_USER_OBJECT_ID>"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Chat room created successfully",
  "data": {
    "_id": "660c401b...",
    "participants": [ ... ]
  }
}
```

---

### 7.2 Join Chat Room
- **Method:** `POST`
- **Endpoint:** `/chatRooms/join-chatRoom`
- **Auth Required:** No
- **Request Body:**
```json
{
  "roomId": "<ROOM_OBJECT_ID>",
  "userId": "<USER_OBJECT_ID>"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Joined chat room successfully",
  "data": { ... }
}
```

---

### 7.3 Send Chat Message
- **Method:** `POST`
- **Endpoint:** `/chats/create-chat`
- **Auth Required:** Yes (`Bearer <accessToken>`)
- **Request Body:**
```json
{
  "receiverId": "<USER_OBJECT_ID>",
  "message": "Hello, is this bike still available?"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Chat sent successfully!",
  "data": ""
}
```
*(Note: Chat service DB insertion is currently stubbed/mocked on the server).*

---

## ⚠️ Standard Error Response Format

When any validation or server error occurs, the server returns:
```json
{
  "success": false,
  "message": "Validation Error / Error message",
  "errorSources": [
    {
      "path": "email",
      "message": "Invalid email address"
    }
  ],
  "stack": null
}
```
