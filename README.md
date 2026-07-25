# Vanilla JS E-Commerce Application

A lightweight, multi-page e-commerce web application built using standard HTML5, CSS3, and modern Vanilla JavaScript. The entire application runs client-side and relies on browser `localStorage` for data persistence and state management.

---

## 🌟 Key Features

### 🛍️ Customer Features
- **Product Storefront**: Browse products with live dynamic star ratings, stock availability, and category filtering.
- **User Authentication**: Register new accounts or log in with client-side form validation.
- **Shopping Cart**: Add items with real-time stock validation, subtotal calculation, item removal, and checkout processing.
- **Wishlist**: Save favorite items to a personalized wishlist.
- **Order History & Returns**: Track order progress (`pending`, `confirmed`, `rejected`) and submit return requests for confirmed purchases.
- **Ratings & Reviews**: Rate products (1–5 stars) and leave comments to update average product ratings dynamically.

### 🛠️ Admin Dashboard Features
- **Product Management (CRUD)**: Create, edit, and delete products. Includes image uploads via `FileReader` (converted to Base64).
- **Category Management**: Dynamically add and remove product categories.
- **Order Processing**: Manage incoming customer orders and change order statuses (`Confirmed`, `Rejected`, `Confirm Return`).

---

## 🚀 Getting Started

Since this is a client-side application with no external dependencies or build step required, you can run it directly in your browser.

### Prerequisites
- Any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).

### Running Locally
1. Clone or download this repository:
   ```bash
   git clone https://github.com/samybit/vanilla-js-ecommerce
   cd vanilla-js-ecommerce
   ```
2. Open `index.html` directly in your browser, or serve it using a local static server (e.g., Live Server extension in VS Code, `pnpm dlx serve .`, or `npx serve .`).

---

## 🔐 Default Credentials

The application seeds a default admin account in the client's `localStorage` upon first load:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@test.com` | `123456` |

> [!NOTE]
> **Security & Architecture Notice**: This application operates purely client-side using browser `localStorage`. Logging in as Admin only affects mock data isolated within your own browser session. No centralized backend server or shared database is used.

---

## 📁 Project Structure

```
vanilla-js-ecommerce/
├── index.html           # Main customer product catalog
├── login.html           # Login & Registration page
├── cart.html            # Shopping cart & checkout
├── orders.html          # Customer order history
├── wishlist.html        # Saved wishlist items
├── admin-dashboard.html # Admin catalog & order management dashboard
├── script.js            # Core logic, auth checks, DOM rendering, & localStorage state
├── styles.css           # Custom styling & dynamic CSS layout tokens
├── LICENSE              # License file
└── README.md            # Project documentation
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
