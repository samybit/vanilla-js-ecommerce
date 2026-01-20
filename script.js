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
        localStorage.setItem('users', JSON.stringify([{ id: 1, name: 'Admin', email: 'admin@test.com', password: '123456', role: ADMIN }]));
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
//  Regex Validation LOGIC
// ===========================

// - Email Pattern
var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
// - Password Pattern
var passRegex = /^.{6,}$/;


// ===========================
//  REGISTER LOGIC
// ===========================

function register() {
    // 0. Get the users array of object
    var users = JSON.parse(localStorage.getItem('users'));

    // 1. Get Inputs
    var name = document.getElementById('regName').value;
    var email = document.getElementById('regEmail').value;
    var password = document.getElementById('regPass').value;
    var errorMsg = document.getElementById('regError');

    // 2. Regex Validation
    // a. All fields are required
    if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
        errorMsg.innerText = ERR_REQUIRED;
        return;
    }
    // b. Email must be valid
    if (!emailRegex.test(email)) {
        errorMsg.innerText = ERR_EMAIL;
        return;
    }
    // c. Password must be at least 6 characters
    if (!passRegex.test(password)) {
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
        password: password,
        role: CUSTOMER
    };
    // add to users array then add to localStorage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // 5. Show Success Message & Switch to Login UI
    alert("Registration Successful! Please Login.");
    showLogin();
}


// ===========================
//  LOGIN LOGIC
// ===========================

function login() {
    // 0. Get the users array of object
    var users = JSON.parse(localStorage.getItem('users'));

    // 1. Get Inputs
    var email = document.getElementById('loginEmail').value;
    var password = document.getElementById('loginPass').value;
    var errorMsg = document.getElementById('loginError');

    // 2. Regex Validation
    // a. All fields are required
    if (email === "" || password === "") {
        errorMsg.innerText = ERR_REQUIRED;
        return;
    }
    // b. Email must be valid
    if (!emailRegex.test(email)) {
        errorMsg.innerText = ERR_EMAIL;
        return;
    }
    // c. Password must be at least 6 characters
    if (!passRegex.test(password)) {
        errorMsg.innerText = ERR_PASSWORD;
        return;
    }

    // 3. Loop to find user
    var foundUser = null;
    for (var i = 0; i < users.length; i++) {
        if (users[i].email === email && users[i].password === password) {
            foundUser = users[i];
            break;
        }
    }

    // 4. If user was found: save as current user and redirect to his page
    if (foundUser) {
        // Save him as current user to session 
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(foundUser));

        // Redirect based on Role Admin OR Customer
        if (foundUser.role === ADMIN) {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'home.html';
        }
    } else {
        errorMsg.innerText = "Invalid Email or Password";
    }
}


// ===========================
//  Form Submission Handlers
// ===========================

// Handle Register Form
document.getElementById('registerSection').addEventListener('submit', function (event) {
    event.preventDefault();
    register();
});

// Handle Login Form
document.getElementById('loginSection').addEventListener('submit', function (event) {
    event.preventDefault();
    login();
});


// ===========================
//  LOGOUT & AUTHENTICATION LOGIC
// ===========================

// Remove the current user if Logout is clicked
function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    location.href = 'index.html';
}

// Check if user is logged in
function checkAuth() {
    var user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));

    // 1. Check if user exists
    if (!user) {
        location.href = 'index.html';
        return null;
    }

    // 2. Get the current page name (e.g., "admin.html", "home.html")
    var currentPage = location.pathname.split('/').pop();

    // 3. Switch based on Role to protect pages
    switch (user.role) {
        case ADMIN:
            // Admin is ONLY allowed on admin.html. 
            if (currentPage !== 'admin.html') {
                location.href = 'admin.html';
            }
            break;

        case CUSTOMER:
            // Customer is NOT allowed on admin.html.
            if (currentPage === 'admin.html') {
                location.href = 'home.html';
            }
            break;
    }

    return user;
}