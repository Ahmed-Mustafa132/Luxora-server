# Hotel Booking App - RESTful API Documentation

This document contains all the main RESTful APIs for the Hotel Booking Application with explanations.

---

## 1. Authentication & Users

### **Register User**

POST /user/register

- Registers a new user.
- Request body: `{ "name": "John Doe", "email": "john@example.com", "password": "123456" }`
- Response: user info + JWT token

### **Login User**

POST /user/login

- Authenticates a user and returns a JWT token.
- Request body: `{ "email": "john@example.com", "password": "123456" }`
- Response: `{ "token": "<JWT_TOKEN>" }`

### **Get Current User**

GET /users/me

- Returns details of the currently logged-in user.
- Requires Authorization header with Bearer token.

### **Update User**

PUT /users/me

- Update user details.
- Request body: `{ "name": "New Name", "email": "newemail@example.com" }`

### **Delete User**

DELETE /users/me

- Deletes the current user's account.

---

## 2. Hotels

### **List Hotels**

GET /hotels

- Retrieves a list of all hotels.
- Supports filters: `?city=London&minPrice=50&maxPrice=200`

### **Get Hotel Details**

GET /hotels/{id}

- Get detailed info about a specific hotel by ID.

### **Add Hotel** _(Admin Only)_

POST /hotels

- Adds a new hotel to the system.
- Request body: `{ "name": "Hotel Lux", "location": "Paris", "description": "Nice hotel", "rating": 4.5 }`

### **Update Hotel** _(Admin Only)_

PUT /hotels/{id}

- Updates hotel information.

### **Delete Hotel** _(Admin Only)_

DELETE /hotels/{id}

- Removes a hotel.

---

## 3. Rooms

### **List Rooms in a Hotel**

GET /rooms/

- Retrieves all rooms in a specific hotel.

### **Get Room Details**

GET /rooms/{id}

- Get detailed info about a room.

### **Add Room** _(Admin Only)_

POST /hotels/{id}/rooms

- Add a new room to a hotel.
- Request body: `{ "room_number": 101, "type": "Double", "price": 120, "is_available": true }`

### **Update Room** _(Admin Only)_

PUT /rooms/{id}

- Update room details.

### **Delete Room** _(Admin Only)_

DELETE /rooms/{id}

- Remove a room.

---

## 4. Bookings

### **Create Booking**

POST /bookings

- Book a room.
- Request body: `{ "room_id": 1, "check_in": "2025-09-01", "check_out": "2025-09-05" }`

### **Get User Bookings**

GET /bookings

- Lists all bookings for the logged-in user.

### **Get Booking Details**

GET /bookings/{id}

- Get details of a specific booking.

### **Update Booking**

PUT /bookings/{id}

- Modify an existing booking (dates, etc.)

### **Cancel Booking**

DELETE /bookings/{id}

- Cancel a booking.

---

## 5. Payments (Optional, enhances portfolio)

### **Make Payment**

POST /payments

- Execute a payment for a booking.
- Request body: `{ "booking_id": 1, "amount": 500, "method": "Stripe" }`

### **Get Payment Details**

GET /payments/{id}

- Retrieve payment information.

---

## 6. Reviews

### **Add Review**

POST /hotels/{id}/reviews

- Add a review for a hotel.
- Request body: `{ "rating": 5, "comment": "Great stay!" }`

### **List Reviews**

GET /hotels/{id}/reviews

- Get all reviews for a hotel.

### **Delete Review**

DELETE /reviews/{id}

- Delete a review (user or admin).

---

> #**Note:**# 
> in room  controler  we shode make  get revew in  the 




> 