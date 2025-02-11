# Aureo Mall - E-commerce Node.js Application

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Installation](#installation)
  - [Step 1: Clone the Repository](#step-1-clone-the-repository)
  - [Step 2: Install Dependencies](#step-2-install-dependencies)
  - [Step 3: Configure Environment Variables](#step-3-configure-environment-variables)
  - [Step 4: Start the Application](#step-4-start-the-application)
- [API Documentation](#api-documentation)
- [Important Notes](#important-notes)
- [Support](#support)

---

## Introduction

Aureo Mall is a robust **E-commerce Node.js application** designed for managing online shopping platforms. It leverages **Express.js** for server-side operations and **Sequelize** for ORM-based database management. The project is modular, extensible, and adheres to best practices in Node.js development.

---

## Features

Aureo Mall includes a wide range of features to support a comprehensive e-commerce ecosystem:

### User Management

- **Role-based Access Control (RBAC)**: Supports roles such as admin, seller, customer, and logistics.
- JWT authentication and refresh token management.
- Default user role assignment on registration.
- Password recovery through a secure "Forgot Password" workflow.

### Product Management

- Supports product creation and association with multiple categories.
- Generates unique slugs for products using `slugify`.
- Handles SKU (Stock Keeping Unit) management for inventory.
- Supports product options and variants with dynamic configurations.
- Cloudinary integration for product image uploads.

### Category Management

- Stores categories in a flat structure for flexibility.
- Supports parent-child relationships when needed.

### Address Management

- Comprehensive support for addresses, provinces, districts, and wards.
- Integration with external APIs like GHN and GHTK for shipping.

### Shop Management

- Enables shop registration and management by sellers.
- Associates products with specific shops for better organization.

### Shipping Management

- Integration with GHN and GHTK APIs for real-time shipping calculations and order tracking.

### Payment Integration

- Configurable MoMo payment gateway integration.

### Order Management

- Manage orders with status updates for processing, shipping, and delivery.
- Integration with shipping services for seamless order tracking.

### Checkout and Cart Management

- Implements a user-friendly shopping cart system.
- Streamlined checkout process with multiple payment and shipping options.

### Authentication and Authorization

- Secure login and registration workflows.
- Middleware for token verification, permissions, and request validation.

### Logging and Security

- Environment variable management.
- Secure handling of sensitive information such as JWT secrets and API keys.

---

## Tech Stack

### Backend

- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Fast and minimalist web framework.
- **Sequelize**: Promise-based ORM for SQL databases.

### Database

- **MySQL** or **PostgreSQL**: Relational database options.

### Other Services

- **Cloudinary**: Image hosting and management.
- **MoMo Payment Gateway**: Payment processing.
- **GHN (Giao Hàng Nhanh)**: Shipping service integration for delivery management.
- **GHTK (Giao Hàng Tiết Kiệm)**: Shipping service integration for delivery management.

---

## Requirements

To run this project, ensure you have the following:

- **Node.js** v20.x or later
- **NPM** or **Yarn**
- A database such as **MySQL** or **PostgreSQL**

---

## Installation

Follow these steps to set up the project on your local machine:

### Step 1: Clone the Repository

Clone the repository to your local environment:

```bash
git clone https://github.com/NguyenTienHieu-GitHub/aureo-mall-server.git
cd aureo-mall-server
```

---

### Step 2: Install Dependencies

Install the necessary dependencies:

```bash
npm install
# Or, if using Yarn:
# yarn install
```

---

### Step 3: Configure Environment Variables

Copy the example environment file and configure your settings:

```bash
cp .env.example .env.development
cp .env.example .env.production
cp .env.example .env.test
```

Open `.env.development`, `.env.production`, or `.env.test` and update the following variables:

```plaintext
# ========================================================
# 🛠️  Environment Configuration
# ========================================================
NODE_ENV=development                       # Set the operating environment (e.g., development, production, test)
SERVER_PORT=3000                           # Server port configuration

# ========================================================
# 🚚  Shipping API Keys (GHN, GHTK)
# ========================================================
GHN_API_KEY=your_ghn_api_key               # Replace with your GHN API Key
GHN_API_URL=https://dev-online-gateway.ghn.vn/shiip/public-api  # Update URL for test/production
GHTK_API_KEY=your_ghtk_api_key             # Replace with your GHTK API Key
GHTK_API_URL=https://services-staging.ghtklab.com/services      # Update URL for test/production

# ========================================================
# 💳  MoMo Payment Gateway Configuration
# ========================================================
MOMO_ACCESS_KEY=your_momo_access_key       # Replace with MoMo Access Key
MOMO_SECRET_KEY=your_momo_secret_key       # Replace with MoMo Secret Key
MOMO_PARTNER_CODE=your_partner_code        # Replace with MoMo Partner Code
MOMO_REDIRECT_URL=http://127.0.0.1:3000    # Redirect URL after payment
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create  # Update endpoint for production

# ========================================================
# 🌐  Ngrok Configuration
# ========================================================
NGROK_AUTH_TOKEN=your_ngrok_auth_token     # Replace with Ngrok Auth Token
NGROK_REGION=ap                            # Select Ngrok server region (e.g., 'ap' for Asia)
NGROK_SUBDOMAIN=yoursubdomain              # Custom subdomain for Ngrok (optional)

# ========================================================
# 📧  Email (Nodemailer) Configuration
# ========================================================
USER_MAIL=your_email                       # Replace with your email address
PASSWORD_MAIL=your_email_password          # Replace with your email password or OAuth2 token

# ========================================================
# ☁️  Cloudinary Configuration (Image Storage)
# ========================================================
CLOUDINARY_CLOUD_NAME=your_cloud_name      # Replace with Cloud Name from Cloudinary
CLOUDINARY_API_KEY=your_api_key            # Replace with API Key from Cloudinary
CLOUDINARY_API_SECRET=your_api_secret      # Replace with API Secret from Cloudinary

# ========================================================
# 🗃️  Database Configuration
# ========================================================
DB_USERNAME=your_db_username               # Database login name
DB_PASSWORD=your_db_password               # Database password
DB_HOST=your_db_host                       # Database server address (e.g., localhost)
DB_PORT=your_db_port                       # Database connection port (e.g., 5432 for PostgreSQL)
DB_NAME=your_db_name                       # Database name
DB_DIALECT=your_db_dialect                 # Database type (e.g., mysql, postgres, sqlite)

# ========================================================
# 🔐  JWT (JSON Web Token) Configuration
# ========================================================
SECRET_KEY=your_secret_key                 # Replace with the secret key used to sign JWT
REFRESH_KEY=your_refresh_key               # Replace with the secret key for Refresh Tokens

# ========================================================
# 👑  Admin User Setup
# ========================================================
FIRST_NAME_ADMIN=your_admin_first_name     # Admin first name
LAST_NAME_ADMIN=your_admin_last_name       # Admin last name
EMAIL_ADMIN=your_admin_email               # Admin email address
PASSWORD_ADMIN=your_admin_password         # Admin password

# ========================================================
# ⏳  JWT Token Expiration Time Configuration
# ========================================================
JWT_ACCESS_EXPIRES_IN=10m                  # Access Token expiration time (e.g., 10 minutes)
JWT_REFRESH_EXPIRES_IN=7d                  # Refresh Token expiration time (e.g., 7 days)

# ========================================================
# 🔄  Sequelize Database Sync Options
# ========================================================
SYNC_FORCE=false                           # SYNC_FORCE=true : Deletes old data and table structure, recreates new table (use cautiously)
                                           # SYNC_FORCE=false : Creates table if it doesn't exist, preserves old data

```

---

### Step 4: Start the Application

Run the application with one of the following commands:

```bash
# For production environment
npm run start

# For development environment
npm run dev

# For test environment
npm run test
```

---

## API Documentation

This project uses **Swagger** for API documentation. After starting the server, navigate to the following URL to view the API documentation:

```
http://localhost:3080/api-docs
```

---

## Important Notes

- **Security**: Keep `.env` files secure and never expose them in the codebase.
- **Database Sync**: Use `SYNC_FORCE=false` to prevent accidental data loss. Backup your database before setting `SYNC_FORCE=true`.
- **Testing**: Use `npm run test` to run the test suite.
- **Node.js Version**: Ensure you are using Node.js v20.x or higher. Check your version with `node -v`.

---

## Support

For support, please contact:

- **Email**: [tienhieu2kk3@gmail.com](mailto:tienhieu2kk3@gmail.com)

Contributions are welcome! Create a pull request or raise an issue on the repository.
