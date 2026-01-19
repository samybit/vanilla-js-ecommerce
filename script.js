/* ===============================
   GLOBAL STANDARD VARIABLES
   (DO NOT RENAME – DO NOT MODIFY)
   =============================== */

/* USER ROLES */
var ADMIN = 'admin'; // used
var CUSTOMER = 'customer'; // used

/* ORDER STATUS */
var PENDING = 'pending';
var CONFIRMED = 'confirmed';
var REJECTED = 'rejected';

/* LOCAL STORAGE KEYS */
var USERS_KEY = 'users';
var PRODUCTS_KEY = 'products';
var CATEGORIES_KEY = 'categories';
var CART_KEY = 'cart';
var ORDERS_KEY = 'orders';
var CURRENT_USER_KEY = 'currentUser';
var WISHLIST_KEY = 'wishlist';

/* MAIN DATA ARRAYS */
let users = []; // Used
let products = []; // Used
let categories = []; // Used
let cart = []; // Used
let orders = []; // Used


/* CURRENT USER */
let currentUser = null;

/* OBJECT TEMPLATES */
let user = {
    id: '',
    name: '',
    email: '',
    password: '',
    role: CUSTOMER
};

let product = {
    id: '',
    name: '',
    image: '',
    categoryId: '',
    price: 0,
    description: '',
    stock: 0
};

let category = {
    id: '',
    name: ''
};

let cartItem = {
    productId: '',
    quantity: 1
};

let order = {
    id: '',
    userId: '',
    items: [],
    total: 0,
    status: PENDING,
    date: ''
};

/* STANDARD ERROR MESSAGES */
var ERR_REQUIRED = 'This field is required'; // Used
var ERR_EMAIL = 'Invalid email'; // Used
var ERR_PASSWORD = 'Password must be at least 6 characters'; // Used

/* ===============================
   END OF STANDARD VARIABLES
   =============================== */


// ===========================
//  DataBase Initialization
// ===========================
(function () {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([{ id: 1, name: 'Admin', email: 'admin@test.com', password: '123', role: ADMIN }]));
    }
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify([]));
    }
    if (!localStorage.getItem('categories')) {
        localStorage.setItem('categories', JSON.stringify([]));
    }
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([]));
    }
    if (!localStorage.getItem('wishlist')) {
        localStorage.setItem('wishlist', JSON.stringify([]));
    }
    if (!localStorage.getItem('reviews')) {
        localStorage.setItem('reviews', JSON.stringify([]));
    }
})();

// ===========================
//  Login/Register UI
// ===========================
document.getElementById('registerLink').addEventListener('click', showRegister);
function showRegister() {
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('registerSection').classList.remove('hidden');
}

document.getElementById('loginLink').addEventListener('click', showLogin);
function showLogin() {
    document.getElementById('registerSection').classList.add('hidden');
    document.getElementById('loginSection').classList.remove('hidden');
}

// ===========================
//  REGISTER LOGIC
// ===========================
function register() {
    // 0. Get the users array of object
    var users = JSON.parse(localStorage.getItem('users'));

    // 1. Get Inputs
    var name = document.getElementById('regName').value;
    var email = document.getElementById('regEmail').value;
    var pass = document.getElementById('regPass').value;
    var errorMsg = document.getElementById('regError');

    // 2. Regex Validation
    // - Email Pattern
    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    // - Password Pattern
    var passRegex = /^.{6,}$/;

    // a. All fields are required
    if (name.trim() === "" || email.trim() === "" || pass.trim() === "") {
        errorMsg.innerText = ERR_REQUIRED;
        return;
    }
    // b. Email must be valid
    if (!emailRegex.test(email)) {
        errorMsg.innerText = ERR_EMAIL;
        return;
    }
    // c. Password must be at least 6 characters
    if (!passRegex.test(pass)) {
        errorMsg.innerText = ERR_PASSWORD;
        return;
    }

    // 3. Check if email already exists
    for (var i = 0; i < users.length; i++) {
        if (users[i].email === email) {
            errorMsg.innerText = "Email already registered!";
            return;
        }
    }

    // 4. Create new User Object
    var newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: pass,
        role: CUSTOMER
    };
    // add to users array & add to localStorage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // 5. Show Success Message & Switch to Login UI
    alert("Registration Successful! Please Login.");
    showLogin();
}