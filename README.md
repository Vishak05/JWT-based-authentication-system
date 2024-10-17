# JWT Authentication System with Role-based Access Control

This is a **JWT-based authentication system** built with **Node.js** and **Express.js**. It includes **role-based access control** (Admin/User), email verification using **Nodemailer**, and features a **Forgot Password** system with email reset functionality.

## Features
- **User Authentication**: Signup and login using JWT (JSON Web Token).
- **Role-based Access Control**: Different access levels for Admin and User.
- **Email Verification**: Sends an email on user registration to verify the account.
- **Forgot/Reset Password**: Reset password functionality via email.
- **Protected Routes**: Routes that require valid JWT tokens for access.
- **Error Handling**: Centralized error handling with proper HTTP status codes.
- **Cookies**: Secure handling of JWT tokens with **httpOnly** cookies.

## Project Structure

|-- config/ | |-- db.js # MongoDB connection setup | |-- controllers/ | |-- authController.js # Auth logic (signup, login, forgot/reset password) | |-- middleware/ | |-- authMiddleware.js # JWT verification middleware | |-- errorMiddleware.js # Global error handler | |-- models/ | |-- User.js # User model schema (Mongoose) | |-- routes/ | |-- authRoutes.js # Authentication routes (signup, login, etc.) | |-- utils/ | |-- sendEmail.js # Nodemailer setup for email handling | |-- app.js # Main application entry point |-- package.json # Dependencies and scripts |-- README.md # Documentation |-- .env # Environment variables (not shared in repo)


## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/jwt-auth-system.git
    cd jwt-auth-system
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up environment variables**:
   Create a `.env` file in the root of your project and add the following:
    ```plaintext
    PORT=5000
    MONGO_URI=<your_mongo_connection_string>
    JWT_SECRET=<your_jwt_secret_key>
    EMAIL_USER=<your_nodemailer_email>
    EMAIL_PASS=<your_nodemailer_password>
    CLIENT_URL=<your_frontend_url>
    ```

4. **Start the development server**:
    ```bash
    npm run dev
    ```

## API Endpoints

### Authentication Routes

- **Signup** - `POST /api/auth/signup`
    - Request Body:
      ```json
      {
          "name": "John Doe",
          "email": "john@example.com",
          "password": "Password123!"
      }
      ```
    - Response: Sends verification email, and prompts to verify the email.
  
- **Login** - `POST /api/auth/login`
    - Request Body:
      ```json
      {
          "email": "john@example.com",
          "password": "Password123!"
      }
      ```
    - Response: Returns JWT token in `httpOnly` cookie.

- **Forgot Password** - `POST /api/auth/forgot-password`
    - Request Body:
      ```json
      {
          "email": "john@example.com"
      }
      ```
    - Response: Sends password reset email.

- **Reset Password** - `POST /api/auth/reset-password`
    - Request Body:
      ```json
      {
          "token": "reset-token-received-via-email",
          "newPassword": "NewPassword123!"
      }
      ```

### Protected Routes

- **Profile** - `GET /api/auth/profile`
    - Headers:
      ```json
      {
          "Authorization": "Bearer <jwt-token>"
      }
      ```
    - Response: User's profile details.

- **Admin Access** - `GET /api/auth/admin`
    - Headers:
      ```json
      {
          "Authorization": "Bearer <jwt-token>"
      }
      ```
    - Response: Accessible only by Admin users.

## Testing

- **Postman Collection**: Use Postman to test the API routes. Create requests for the Signup, Login, Profile, Admin access, Forgot Password, and Reset Password endpoints.
  
## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Fast and minimalist web framework for Node.js.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: MongoDB object modeling for Node.js.
- **JWT (JSON Web Tokens)**: For secure token-based authentication.
- **Nodemailer**: Sending emails for verification and password reset.
- **bcrypt.js**: Hashing passwords for security.
- **cookie-parser**: Parsing cookies to manage JWT tokens.

## Error Handling

All errors are centrally handled using custom middleware (`errorMiddleware.js`). Errors are caught and returned as JSON responses with appropriate HTTP status codes.

## Security Considerations

- **JWT Tokens**: Tokens are stored in **httpOnly** cookies to prevent XSS attacks.
- **Password Hashing**: User passwords are securely hashed using `bcryptjs` before being stored in the database.
- **CORS**: Proper CORS settings allow the frontend to communicate securely with the backend.
