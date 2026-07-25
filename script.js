/* ===============================
   GLOBAL STANDARD VARIABLES
   (DO NOT RENAME – DO NOT MODIFY)
   =============================== */

/* USER ROLES */
var ADMIN = 'admin';
var CUSTOMER = 'customer';

/* ORDER STATUS */
var PENDING = 'pending';
var CONFIRMED = 'confirmed';
var REJECTED = 'rejected';
var RETURNED = 'returned';

/* LOCAL STORAGE KEYS */
var USERS_KEY = 'users';
var PRODUCTS_KEY = 'products';
var CATEGORIES_KEY = 'categories';
var CART_KEY = 'cart';
var ORDERS_KEY = 'orders';
var CURRENT_USER_KEY = 'currentUser';
var WISHLIST_KEY = 'wishlist';
var REVIEWS_KEY = 'reviews';

/* MAIN DATA ARRAYS */
let users = [];
let products = [];
let categories = [];
let cart = [];
let orders = [];


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
    category: '', // chaneged from categoryID
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
var ERR_REQUIRED = 'This field is required';
var ERR_EMAIL = 'Invalid email';
var ERR_PASSWORD = 'Password must be at least 6 characters';

/* ===============================
   END OF STANDARD VARIABLES
   =============================== */


/* ===============================
   HELPER FUNCTIONS & SETUP
   =============================== */

// 1. Helper to show error on specific field
function showError(inputId, errorId, message) {
    document.getElementById(errorId).innerText = message;
    document.getElementById(inputId).classList.add('input-error');
}

// 2. Helper to clear all errors
function clearErrors() {
    // Clear all error messages
    var messages = document.querySelectorAll('.error-msg');
    for (var i = 0; i < messages.length; i++) {
        messages[i].innerText = "";
    }
    // Remove red borders
    var inputs = document.querySelectorAll('input, select, textarea');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].classList.remove('input-error');
    }
}

// 3. Image File Listener (Converts uploaded file to Base64 string)
var fileInput = document.getElementById('productImageFile');
if (fileInput) {
    fileInput.addEventListener('change', function () {
        var file = this.files[0];
        if (file) {
            // Check file size (limit to 500KB to save LocalStorage space)
            if (file.size > 500000) {
                alert("File is too big! Please select an image under 500KB.");
                this.value = ""; // Clear input
                return;
            }

            var reader = new FileReader();
            reader.onload = function (e) {
                // Save the base64 string to the hidden input
                document.getElementById('productImageBase64').value = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}


// ===========================
//  DataBase Initialization
// ===========================

(function () {
    if (!localStorage.getItem(USERS_KEY)) {
        localStorage.setItem(USERS_KEY, JSON.stringify([{ id: 1, name: 'Admin', email: 'admin@test.com', password: '123456', role: ADMIN }]));
    }
    
    var defaultCategories = ['Dumbbells & Weights', 'Gym Equipment'];
    if (!localStorage.getItem(CATEGORIES_KEY) || JSON.parse(localStorage.getItem(CATEGORIES_KEY)).length === 0) {
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories));
    }

    var defaultProducts = [
        {
            id: 101,
            name: 'Purple Neoprene Dumbbells (Pair)',
            image: 'assets/purple-neoprene-dumbbells.jpg',
            category: 'Dumbbells & Weights',
            price: 24.99,
            description: 'Anti-slip neoprene coated 5 lb purple dumbbells ideal for home workouts, light cardio, and conditioning.',
            stock: 15
        },
        {
            id: 102,
            name: 'Rubber Hex Dumbbell Set',
            image: 'assets/black-hex-dumbbells.jpg',
            category: 'Dumbbells & Weights',
            price: 49.99,
            description: 'Durable solid cast iron hex dumbbells with protective rubber casing and knurled chrome handles.',
            stock: 0
        },
        {
            id: 103,
            name: 'Adjustable Hyperextension Bench',
            image: 'assets/adjustable-hyperextension-bench.jpg',
            category: 'Gym Equipment',
            price: 189.99,
            description: 'Heavy-duty adjustable hyperextension Roman chair with high-density foam padding for core and back workout.',
            stock: 6
        },
        {
            id: 104,
            name: 'Commercial Roman Chair Bench',
            image: 'assets/commercial-roman-chair.jpg',
            category: 'Gym Equipment',
            price: 229.99,
            description: 'Professional grade back extension bench with ergonomic support pads and multi-angle adjustment.',
            stock: 4
        }
    ];

    if (!localStorage.getItem(PRODUCTS_KEY) || JSON.parse(localStorage.getItem(PRODUCTS_KEY)).length === 0) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
    }

    if (!localStorage.getItem(CART_KEY)) {
        localStorage.setItem(CART_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(ORDERS_KEY)) {
        localStorage.setItem(ORDERS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(WISHLIST_KEY)) {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(REVIEWS_KEY)) {
        localStorage.setItem(REVIEWS_KEY, JSON.stringify([]));
    }
})();



//  oooooooo8 o88                           o88                            ooooo                               o88              
// 888        oooo    oooooooo8 oo oooooo   oooo  oo oooooo     oooooooo8   888          ooooooo     oooooooo8 oooo   ooooooo   
//  888oooooo  888  888    88o   888   888   888   888   888  888    88o    888        888     888 888    88o   888 888     888 
//         888 888   888oo888o   888   888   888   888   888   888oo888o    888      o 888     888  888oo888o   888 888         
// o88oooo888 o888o 888     888 o888o o888o o888o o888o o888o 888     888  o888ooooo88   88ooo88   888     888 o888o  88ooo888  
//                   888ooo888                                 888ooo888                            888ooo888                                                                                                                         
// ===========================
//  Login/Register UI
// ===========================

// 1. Get the login/register buttons
var registerBtn = document.getElementById('registerBtn');
var loginBtn = document.getElementById('loginBtn');
// 2. Add event listeners if they exist
if (registerBtn) {
    registerBtn.addEventListener('click', showRegister);
}
if (loginBtn) {
    loginBtn.addEventListener('click', showLogin);
}
// 0. Show the login/register sections Functions
function showRegister() {
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('registerSection').classList.remove('hidden');
}
function showLogin() {
    document.getElementById('registerSection').classList.add('hidden');
    document.getElementById('loginSection').classList.remove('hidden');
}


// ===========================
//  Regex Validations
// ===========================

// - Email Pattern
var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
// - Password Pattern
var passRegex = /^.{6,}$/;


// ===========================
//  REGISTER LOGIC
// ===========================
function register() {
    // 0. Clear previous errors
    clearErrors();

    var users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    var name = document.getElementById('regName').value;
    var email = document.getElementById('regEmail').value;
    var password = document.getElementById('regPass').value;

    var isValid = true;

    // 1. Validate Name
    if (name.trim() === "") {
        showError('regName', 'regNameError', 'Full Name is required');
        isValid = false;
    }

    // 2. Validate Email
    if (email.trim() === "") {
        showError('regEmail', 'regEmailError', 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        showError('regEmail', 'regEmailError', 'Please enter a valid email address');
        isValid = false;
    } else {
        // Check duplicates
        for (var i = 0; i < users.length; i++) {
            if (users[i].email === email) {
                showError('regEmail', 'regEmailError', 'Email is already registered');
                isValid = false;
                break;
            }
        }
    }

    // 3. Validate Password
    if (password === "") {
        showError('regPass', 'regPassError', 'Password is required');
        isValid = false;
    } else if (!passRegex.test(password)) {
        showError('regPass', 'regPassError', 'Password must be at least 6 characters');
        isValid = false;
    }
    // Stop if any error found
    if (!isValid) return;

    // 4. Success: Create User
    var newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        role: CUSTOMER
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert("Registration Successful! Please Login.");
    showLogin();
}


// ===========================
//  LOGIN LOGIC
// ===========================
function login() {
    // 0. Clear previous errors
    clearErrors();

    var users = JSON.parse(localStorage.getItem('users')) || [];
    var email = document.getElementById('loginEmail').value;
    var password = document.getElementById('loginPass').value;
    var mainError = document.getElementById('loginError');

    var isValid = true;

    // 1. Basic Field Validation
    if (email === "") {
        showError('loginEmail', 'loginEmailError', 'Email is required');
        isValid = false;
    }
    if (password === "") {
        showError('loginPass', 'loginPassError', 'Password is required');
        isValid = false;
    }

    if (!isValid) return;

    // 2. Check Credentials
    var foundUser = null;
    for (var i = 0; i < users.length; i++) {
        if (users[i].email === email && users[i].password === password) {
            foundUser = users[i];
            break;
        }
    }

    if (foundUser) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(foundUser));
        if (foundUser.role === ADMIN) {
            location.href = 'admin-dashboard.html';
        } else {
            location.href = 'index.html';
        }
    } else {
        mainError.innerText = "Invalid Email or Password";
    }
}


// ===========================
//  Form Submission Handlers
// ===========================

// Handle Register Form
var registerSection = document.getElementById('registerSection');
if (registerSection) {
    registerSection.addEventListener('submit', function (event) {
        event.preventDefault();
        register();
    });
}

// Handle Login Form
var loginSection = document.getElementById('loginSection');
if (loginSection) {
    loginSection.addEventListener('submit', function (event) {
        event.preventDefault();
        login();
    });
}

// ===========================
//  LOGOUT LOGIC
// ===========================

// 1. Get logout button
var logoutBtn = document.getElementById('logoutBtn');

// 2. Add logout event listener if it exists
if (logoutBtn) {
    logoutBtn.addEventListener('click', function (event) {
        event.preventDefault();
        logout();
    });
}

// 0. Logout by removing current user
function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = 'index.html';
}

// ===========================
// AUTHENTICATION LOGIC
// ===========================
// Helper to get clean current page filename (handles trailing slashes, query params, hashes)
function getCleanCurrentPage() {
    var path = location.pathname.split('/').filter(Boolean).pop() || 'index.html';
    return path.split('?')[0].split('#')[0];
}

// Check if user is logged in
function checkAuth() {
    // 0. Get the current user
    var user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    var currentPage = getCleanCurrentPage();

    if (currentPage === 'index.html' || currentPage === '') {
        return user;
    }

    // 1. Check if current user exists
    if (!user) {
        location.href = 'login.html';
        return null;
    }

    // 2. Switch based on Role to protect admin page
    switch (user.role) {
        case CUSTOMER:
            // Customer is NOT allowed on admin-dashboard.html.
            if (currentPage === 'admin-dashboard.html') {
                location.href = 'index.html';
            }
            break;
    }

    return user;
}

// (For login page) Check if user already logged in. If so, redirect to the correct page.
function checkAlreadyLoggedIn() {
    if (localStorage.getItem(CURRENT_USER_KEY)) {
        var user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
        if (user.role === ADMIN) {
            location.href = 'admin-dashboard.html';
        } else {
            location.href = 'index.html';
        }
    }
}



//      o           oooo               o88                ooooo                               o88              
//     888     ooooo888  oo ooo oooo   oooo  oo oooooo     888          ooooooo     oooooooo8 oooo   ooooooo   
//    8  88  888    888   888 888 888   888   888   888    888        888     888 888    88o   888 888     888 
//   8oooo88 888    888   888 888 888   888   888   888    888      o 888     888  888oo888o   888 888         
// o88o  o888o 88ooo888o o888o888o888o o888o o888o o888o  o888ooooo88   88ooo88   888     888 o888o  88ooo888  
//                                                                                 888ooo888                                                                                                                                         
// ===========================
// ADMIN PAGE LOGIC 
// ===========================
//  The main entry point for the Admin page. Initializes the dashboard.
//  It calls all the necessary render functions immediately upon page load to display 
//  categories, products, and orders, and populates the category dropdown menu.
function loadAdminData() {
    renderCategories();
    renderProducts();
    renderOrders();
    populateCategorySelect();
}


/**********************************\\
|        CATEGORY FUNCTIONS         |
\\**********************************/
//  renderCategories() - Retrieves the list of categories from localStorage and displays them as a list of badges.
//      It appends a small "x" link to each badge to allow deletion. 
//  addCategory() - Reads the value from the category input field. 
//      It validates that the input isn't empty, adds the new category to the stored array, saves it back to localStorage, and refreshes the page data.
//  deleteCategory(catName) - Prompts the user for confirmation, then filters the stored array to remove the specific category name.
//      It saves the updated list and refreshes the view. 
//  populateCategorySelect() - Retrieves current categories and dynamically generates HTML <option> tags
//      for the "Select Category" dropdown menu found in the product form.

// Render on page load
function renderCategories() {
    // 1. Get the categories array
    var categories = JSON.parse(localStorage.getItem(CATEGORIES_KEY)) || [];
    // 2. Get the html container and clear it
    var container = document.getElementById('categoryList');
    container.innerHTML = "Current Categories: ";
    // 3. Loop through the categories array and display them
    for (var i = 0; i < categories.length; i++) {
        container.innerHTML += `
        <span class="category-tag">
            ${categories[i]}
            <a href="#" onclick="deleteCategory('${categories[i]}')" class="delete-cat-btn">
            ×
            </a>
        </span>
        `;
    }
}

// Add
function addCategory() {
    // 1. get the input field
    var input = document.getElementById('categoryInput');
    // 2. get the category name the admin wants to add
    var categoryValue = input.value;
    // 3. warn if empty category name
    if (categoryValue === "") { alert("Enter a category name"); return; }
    // 4. get the categories array
    var categories = JSON.parse(localStorage.getItem('categories')) || [];
    // 5. add the new category to the array
    categories.push(categoryValue);
    // 6. save the array to local storage
    localStorage.setItem('categories', JSON.stringify(categories));
    // 7. clear the input field
    input.value = "";
    // 8. refresh
    loadAdminData();
}

// Delete
function deleteCategory(categoryName) {
    // 1. confirm desire for deletion 
    if (!confirm("Delete category: " + categoryName + "?")) return;
    // 2. get the categories array
    var categories = JSON.parse(localStorage.getItem('categories')) || [];
    // 3. array to hold categories except the one we want to delete
    var newCategories = [];
    // 4. add those categories
    for (var i = 0; i < categories.length; i++) { if (categories[i] !== categoryName) newCategories.push(categories[i]); }
    // 5. save the new categories to local storage
    localStorage.setItem('categories', JSON.stringify(newCategories));
    // 6. refresh
    loadAdminData();
}

// Populate Selection
function populateCategorySelect() {
    // 1. get the categories array
    var categories = JSON.parse(localStorage.getItem('categories')) || [];
    // 2. get the select element
    var select = document.getElementById('productCategory');
    // 3. clear the select element
    select.innerHTML = '<option value="">Select Category</option>';
    // 4. add the categories as option elements
    for (var i = 0; i < categories.length; i++) {
        select.innerHTML += `<option value="${categories[i]}">${categories[i]}</option>`;
    }
}


/**********************************\\
|        PRODUCT FUNCTIONS          |
\\**********************************/
// renderProducts() Fetches product data from storage and generates an HTML table row for each item. 
//     It displays details like image, name, price, and stock, and includes "Edit" and "Delete" buttons for each row.
// saveProduct() Handles both creating and updating products. It validates inputs (ensuring price and stock are numbers). 
//     If a hidden Product ID exists, it updates the existing entry.
//     If no ID exists, it generates a new unique ID (using Date.now()) and creates a new entry.
// deleteProduct(id) Asks the user to confirm, then permanently removes the product 
//     with the matching ID from localStorage and re-renders the table.
// editProduct(id) Locates a specific product by its ID and populates the form fields with its current data. 
//     It also changes the submit button text to "Update Product" to indicate editing mode.
// resetProdForm() Clears all text from the product input fields and error messages.
//     It resets the interface back to "Create New Product" mode.

// Render on page load
function renderProducts() {
    // 1. get the product array
    var products = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
    // 2. get and clear the table
    var tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = "";
    // 3. loop through the products and display each one
    for (var i = 0; i < products.length; i++) {
        var product = products[i];
        tableBody.innerHTML += `
            <tr>
                <td>${product.id}</td>
                <td><img src="${product.image}" width="50"></td>
                <td>${product.name}</td>
                <td>$${product.price}</td>
                <td>${product.category}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="edit-btn" onclick="editProduct(${product.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteProduct(${product.id})">Delete</button>
                </td>
            </tr>
        `;
    }
}

// Create or Update
function saveProduct() {
    clearErrors();

    var id = document.getElementById('productId').value;
    var name = document.getElementById('productName').value;
    var price = document.getElementById('productPrice').value;
    var stock = document.getElementById('productStock').value;
    var category = document.getElementById('productCategory').value;
    var description = document.getElementById('productDescription').value;

    // Get the base64 string from the hidden input
    var newImage = document.getElementById('productImageBase64').value;

    var isValid = true;

    // 1. Validate Name
    if (name.trim() === "") {
        showError('productName', 'nameError', 'Product Name is required');
        isValid = false;
    }

    // 2. Validate Image
    if (!id && newImage === "") {
        showError('productImageFile', 'imageError', 'Product Image is required');
        isValid = false;
    }

    // 3. Validate Category
    if (category === "") {
        showError('productCategory', 'categoryError', 'Please select a category');
        isValid = false;
    }

    // 4. Validate Price
    if (price === "" || parseFloat(price) <= 0) {
        showError('productPrice', 'priceError', 'Price must be a positive number');
        isValid = false;
    }

    // 5. Validate Stock
    if (stock === "" || parseInt(stock) < 0) { // Changed to allow 0 stock
        showError('productStock', 'stockError', 'Stock cannot be negative');
        isValid = false;
    }

    // 6. Validate Description
    if (description.trim() === "") {
        showError('productDescription', 'descError', 'Description is required');
        isValid = false;
    }

    if (!isValid) return;

    // 7. Logic to Save
    var products = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];

    if (id) {
        // UPDATE
        for (var i = 0; i < products.length; i++) {
            if (products[i].id == id) {
                products[i].name = name;
                products[i].price = price;
                products[i].stock = stock;
                products[i].category = category;
                products[i].description = description;
                // Only update image if a new one was uploaded
                if (newImage !== "") {
                    products[i].image = newImage;
                }
            }
        }
    } else {
        // CREATE New
        var newProduct = {
            id: Date.now(),
            name: name,
            image: newImage,
            price: price,
            stock: stock,
            category: category,
            description: description
        };
        products.push(newProduct);
    }

    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    resetProdForm();
    renderProducts();
}

// Delete
function deleteProduct(id) {
    // 1. Confirm desire for deletion
    if (!confirm("Are you sure?")) return;
    // 2. Get the products array
    var products = JSON.parse(localStorage.getItem(PRODUCTS_KEY));
    // 3. new Array to hold products except the one we want to delete
    var newProds = [];
    for (var i = 0; i < products.length; i++) {
        if (products[i].id != id) newProds.push(products[i]);
    }
    // 4. Save the new array to local storage
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(newProds));
    // 5. Refresh
    renderProducts();
}

// Edit
function editProduct(id) {
    clearErrors();

    var products = JSON.parse(localStorage.getItem(PRODUCTS_KEY));
    var product = null;

    for (var i = 0; i < products.length; i++) {
        if (products[i].id == id) product = products[i];
    }

    if (product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productDescription').value = product.description;

        // Reset the file input and hidden base64 field
        // (We don't fill these because we can't set file inputs programmatically for security)
        document.getElementById('productImageFile').value = "";
        document.getElementById('productImageBase64').value = "";

        document.getElementById('saveBtn').innerText = "Update Product";
        document.getElementById('formTitle').innerText = "Edit Product ID: " + product.id;
    }
}

// Reset
function resetProdForm() {
    // Empty the form and change button and title text
    document.getElementById('productId').value = "";
    document.getElementById('productName').value = "";
    var fileInput = document.getElementById('productImageFile');
    if (fileInput) fileInput.value = "";
    var base64Input = document.getElementById('productImageBase64');
    if (base64Input) base64Input.value = "";
    document.getElementById('productPrice').value = "";
    document.getElementById('productStock').value = "";
    document.getElementById('productCategory').value = "";
    document.getElementById('productDescription').value = "";
    clearErrors();

    document.getElementById('saveBtn').innerText = "Create Product";
    document.getElementById('formTitle').innerText = "Add New Product";
}


/**********************************\\
|          ORDER FUNCTIONS          |
\\**********************************/
// renderOrders() Displays a list of orders in a table. 
//     It applies color coding based on status (pending, confirmed, etc.) 
//     and dynamically shows action buttons depending on the order's current state.
// updateOrderStatus(orderId, newStatus) Finds a specific order in the database and 
//     updates its status property (e.g., changing 'pending' to 'confirmed'). 
//     It then saves the change and re-renders the order table.

// Display Orders made
function renderOrders() {
    // 1. Get the orders array
    var orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    // 2. Get the table for display and empty it
    var tableBody = document.getElementById('orderTableBody');
    tableBody.innerHTML = "";
    // 3. Display no orders if the array is empty
    if (orders.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='5'>No orders found.</td></tr>";
        return;
    }
    // 4. Loop through the orders and add them to the table
    for (var i = 0; i < orders.length; i++) {
        // a. Get the order
        var order = orders[i];
        // b. Change status color depending on status
        var statusColor = order.status === 'pending' ? 'orange' : (order.status === CONFIRMED ? 'green' : 'red');
        // c. Declare action buttons
        var actionButtons = "";
        // d. buttons when "Pending": Confirm or Reject
        if (order.status === 'pending') {
            actionButtons = `
                <button class="confirm-btn" onclick="updateOrderStatus(${order.id}, '${CONFIRMED}')">Confirm</button>
                <button class="delete-btn" onclick="updateOrderStatus(${order.id}, '${REJECTED}')">Reject</button>
            `;
        } else {
            actionButtons = "Completed";
        }
        // e. button when "Return Requested": Confirm Return
        if (order.status === 'return_requested') {
            actionButtons = `
                <button class="delete-btn" onclick="updateOrderStatus(${order.id}, '${RETURNED}')">Confirm Return</button>
            `;
        }
        // f. Display
        tableBody.innerHTML += `
            <tr>
                <td>${order.id}</td>
                <td>${order.userId}</td>
                <td>$${order.total}</td>
                <td style="color:${statusColor};">${order.status}</td>
                <td>${actionButtons}</td>
            </tr>
        `;
    }
}

// Update Order Status
function updateOrderStatus(orderId, newStatus) {
    // 1. Get the orders array
    var orders = JSON.parse(localStorage.getItem(ORDERS_KEY));
    // 2. Find the desired order and update the status
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].id == orderId) {
            orders[i].status = newStatus;
        }
    }
    // 3. Save the change
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    // 4. Refresh
    renderOrders();
}



//   oooooooo8                          o8                                                  ooooo                               o88              
// o888     88 oooo  oooo   oooooooo8 o888oo ooooooo  oo ooo oooo   ooooooooo8 oo oooooo     888          ooooooo     oooooooo8 oooo   ooooooo   
// 888          888   888  888ooooooo  888 888     888 888 888 888 888oooooo8   888    888   888        888     888 888    88o   888 888     888 
// 888o     oo  888   888          888 888 888     888 888 888 888 888          888          888      o 888     888  888oo888o   888 888         
//  888oooo88    888o88 8o 88oooooo88   888o 88ooo88  o888o888o888o  88oooo888 o888o        o888ooooo88   88ooo88   888     888 o888o  88ooo888  
//                                                                                                                   888ooo888                   
// ===========================
//  CUSTOMER HOME PAGE LOGIC
// ===========================
// The main entry point for the Home page.
// Triggers the cart count update, populates the category filter, 
// and renders the product grid immediately upon page load. 
function initHome() {
    updateCartCount();
    populateHomeCategories();
    renderHomeProducts();
}


/**********************************\\
|         DISPLAY FUNCTIONS         |
\\**********************************/
// populateHomeCategories(): Fills the filter dropdown menu.
//     Retrieves categories from localStorage, keeps the default "All" option, 
//     and dynamically appends the rest as HTML <option> elements. 
// renderHomeProducts(): displaying products based on current filters and state.
//     Clears the container and fetches products/wishlist from storage. Filters products based on the selected category.
//     Generates HTML showing the image, price, rating, stock status, and wishlist. Disables the "Add" button if no stock.

// Populate Filter Dropdown
function populateHomeCategories() {
    // 1. Get the categories array
    var categories = JSON.parse(localStorage.getItem(CATEGORIES_KEY));
    // 2. Get the select element
    var select = document.getElementById('categoryFilter');
    // 3. Keep the first "All" option, append others
    for (var i = 0; i < categories.length; i++) {
        select.innerHTML += `<option value="${categories[i]}">${categories[i]}</option>`;
    }
}

// Render Products
function renderHomeProducts() {
    // 1. Get the html container
    var container = document.getElementById('productsContainer');
    // 2. Get the desired category
    var filterValue = document.getElementById('categoryFilter').value;
    // 3. Get the products and wishlist arrays
    var products = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
    var wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    // 4. Clear the container
    container.innerHTML = "";
    // 5. Check if there are any products
    if (products.length === 0) {
        container.innerHTML = "<p align='center'>No products available yet.</p>";
        return;
    }
    // 6. Loop through the products
    for (var i = 0; i < products.length; i++) {
        // 1. Get the product
        var product = products[i];
        // 2. Get the average rating
        var averageRating = getProductRating(product.id);
        // 3. Set the star rating
        var stars = "★".repeat(Math.round(averageRating)) + "☆".repeat(5 - Math.round(averageRating));
        // 4. Apply Filtration 
        if (filterValue !== 'all' && product.category !== filterValue) {
            continue; // Skip this product
        }
        // 5. Check if is in wishlist
        var heartClass = wishlist.includes(product.id) ? 'wishlist-active' : '';

        // 6. Initialize the buttons state
        var btnState = "";
        var btnText = "Add to Cart";
        var btnClass = "";
        // 7. Check if empty stock 
        if (product.stock <= 0) {
            btnState = "disabled";
            btnText = "Out of Stock";
            btnClass = "btn-out-of-stock";
        }
        // 8. Display to the container
        var html = `
            <div class="col-3 product-card">
                <button class="wishlist-btn ${heartClass}" onclick="toggleWishlist(${product.id})">♥</button>
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="description">${product.description}</p>
                <p class="price">$${product.price}</p>
                
                <p class="product-rating">
                    ${stars} <span>(${averageRating})</span>
                    <button onclick="addReview(${product.id})" class="btn-rate">Rate</button>
                </p>

                <p class="stock">Stock: ${product.stock}</p>
                <button onclick="addToCart(${product.id})" ${btnState} class="${btnClass}" style="width:100%">${btnText}</button>
            </div>
        `;
        container.innerHTML += html;
    }
}


/**********************************\\
|        PRODUCT INTERACTION        |
\\**********************************/
// addToCart(prodId): Adds a selected item to the shopping cart.
//     Finds the product by ID, pushes it to the cart array in localStorage, and updates the navigation cart badge. 
// updateCartCount(): Keeps the UI consistent. 
//     Reads the length of the cart array and updates the badge number in the navigation bar. 
// toggleWishlist(prodId): Manages the user's favorite items. Checks if an ID is already in the wishlist array.
//     If yes, it removes it; if no, it adds it. It then re-renders the home products to update the heart icon color.

// Add to Cart
// Add to Cart with Stock Validation
function addToCart(productId) {
    var user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));

    if (!user) {
        alert("Please login to add items to your cart.");
        window.location.href = 'login.html';
        return;
    }

    // 1. Get current cart and products array
    var cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    var products = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];

    // 2. Find the product from the DB
    var product = null;
    for (var i = 0; i < products.length; i++) {
        if (products[i].id == productId) {
            product = products[i];
            break;
        }
    }

    // 3. If product exists, check stock
    if (product) {
        // a. Count how many of this item are ALREADY in the cart
        var currentQtyInCart = 0;
        for (var j = 0; j < cart.length; j++) {
            if (cart[j].id == productId) {
                currentQtyInCart++;
            }
        }

        // b. Validation: Can we add one more?
        if (currentQtyInCart + 1 > product.stock) {
            alert("Sorry, we only have " + product.stock + " of this item in stock.");
            return; // Stop here
        }

        // c. If safe, add to cart
        cart.push(product);
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCartCount();
        alert("Item added to cart!");
    }
}

// Count
function updateCartCount() {
    // 1. Get the cart arry
    var cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    // 2. Get the count element
    var badge = document.getElementById('cartCount');
    // 3. Update the count
    if (badge) badge.innerText = cart.length;
}

// Wishlist
function toggleWishlist(productId) {
    // 0. check user first
    var user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    if (!user) {
        alert("Please login to use the wishlist.");
        window.location.href = 'login.html';
        return;
    }

    var wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    var index = wishlist.indexOf(productId);

    if (index === -1) {
        wishlist.push(productId);
        alert("Added to Wishlist");
    } else {
        wishlist.splice(index, 1);
        alert("Removed from Wishlist");
    }

    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));

    // REFRESH LOGIC:
    if (document.getElementById('wishlistContainer')) {
        renderWishlist();
    }
    // If we are on the home page, re-render home products (so heart turns grey)
    else if (document.getElementById('productsContainer')) {
        renderHomeProducts();
    }
}

// Render Wishlist Page
function renderWishlist() {
    var container = document.getElementById('wishlistContainer');
    var products = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
    var wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];

    container.innerHTML = "";

    if (wishlist.length === 0) {
        container.innerHTML = "<p>Your wishlist is empty.</p>";
        // Remove the grid style so the message looks normal
        container.style.display = "block";
        return;
    }

    // Restore grid style if we have items
    container.style.display = "grid";

    // Loop through ALL products, but only show the ones in the wishlist
    for (var i = 0; i < products.length; i++) {
        var product = products[i];

        // CHECK: Is this product ID in the wishlist array?
        if (wishlist.includes(product.id)) {

            // Calculate stars (reuse logic)
            var averageRating = getProductRating(product.id);
            var stars = "★".repeat(Math.round(averageRating)) + "☆".repeat(5 - Math.round(averageRating));

            // Stock Logic (reuse logic)
            var btnState = "";
            var btnText = "Add to Cart";
            var btnClass = "";
            if (product.stock <= 0) {
                btnState = "disabled";
                btnText = "Out of Stock";
                btnClass = "btn-out-of-stock";
            }

            container.innerHTML += `
                <div class="product-card">
                    <button class="wishlist-btn wishlist-active" onclick="toggleWishlist(${product.id})">♥</button>
                    
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p class="description">${product.description}</p>
                    <p class="price">$${product.price}</p>
                    <p class="product-rating">${stars}</p>
                    
                    <button onclick="addToCart(${product.id})" ${btnState} class="${btnClass}">${btnText}</button>
                </div>
            `;
        }
    }
}


/**********************************\\
|     CART MANAGMENT & CHECKOUT     |
\\**********************************/
// loadCart(): Renders the Shopping Cart page. Loops through cart items to generate a table row for each. 
//     It calculates the total price and handles the "Empty Cart" display state. 
// removeFromCart(index): Deletes a specific item from the cart. Removes the item at the specified array index, 
//     updates localStorage, and immediately re-renders the cart view. 
// checkout(): Finalizes the purchase. Validates that the cart is not empty. Calculates the final total. 
//     Creates a new order object (with status 'pending') and saves it to the orders array. 
//     Clears the cart and redirects the user to the Order History page.

// Display
function loadCart() {
    // 1. Get the cart array
    var cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    // 2. Get the container and total $
    var container = document.getElementById('cartTableBody');
    var totalSpan = document.getElementById('cartTotal');
    // 3. Clear the container and total $
    container.innerHTML = "";
    var total = 0;
    // 4. Check if cart is empty
    if (cart.length === 0) {
        container.innerHTML = "<tr><td colspan='5' style='text-align:center'>Your cart is empty. <a href='index.html'>Go Shopping</a></td></tr>";
        totalSpan.innerText = "0";
        return;
    }
    // 5. Loop through the cart
    for (var i = 0; i < cart.length; i++) {
        // a. Get the product
        var product = cart[i];
        // b. Add the price to the total
        total += parseFloat(product.price);
        // c. Add the product to the container
        container.innerHTML += `
            <tr>
                <td><img src="${product.image}" width="50"></td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>$${product.price}</td>
                <td><button onclick="removeFromCart(${i})">Remove</button></td>
            </tr>
        `;
    }
    // 6. Update the total
    totalSpan.innerText = total;
}

// Remove
function removeFromCart(index) {
    // 1. Get the cart array
    var cart = JSON.parse(localStorage.getItem(CART_KEY));
    // 2. Remove 1 item at this desired index
    cart.splice(index, 1);
    // 3. Save to localStorage
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    // 4. Refresh
    loadCart();
    updateCartCount();
}

// Checkout
function checkout() {
    // 1. Get cart
    var cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

    // 2. Basic checks
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    if (!confirm("Are you sure you want to place this order?")) return;

    // 3. Get User and Products Data
    var user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    var products = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];

    // 4. Calculate Quantities & Deduct Stock
    for (var i = 0; i < cart.length; i++) {
        var cartItem = cart[i];

        // Find the actual product in the main DB
        for (var j = 0; j < products.length; j++) {
            if (products[j].id == cartItem.id) {
                // Deduct 1 from stock
                products[j].stock = products[j].stock - 1;
            }
        }
    }

    // 5. Save the updated stock to LocalStorage
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));

    // 6. Calculate Total Price
    var total = 0;
    for (var i = 0; i < cart.length; i++) {
        total += parseFloat(cart[i].price);
    }

    // 7. Create Order Object
    var newOrder = {
        id: Date.now(),
        userId: user.id,
        items: cart,
        total: total,
        status: 'pending',
        date: new Date().toLocaleDateString()
    };

    // 8. Save Order
    var orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    orders.push(newOrder);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

    // 9. Clear Cart and Redirect
    localStorage.setItem(CART_KEY, JSON.stringify([]));
    alert("Order Placed Successfully!");
    location.href = 'orders.html';
}


/**********************************\\
|       CUSTOMER ORDER HISTORY      |
\\**********************************/
// Filters global orders to find those matching the current User ID.
// It renders them in a table (newest first), showing status (Pending/Approved) 
// and provides a "Return Order" button if the order is approved.
function loadUserOrders() {
    // 1. Get the current user and orders info
    var user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY)) || [];
    var orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    // 2. Get the container and clear it
    var container = document.getElementById('userOrdersBody');
    container.innerHTML = "";
    // 3. Collect orders belonging to this user only
    var myOrders = [];
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].userId === user.id) {
            myOrders.push(orders[i]);
        }
    }
    // 4. clear if no orders
    if (myOrders.length === 0) {
        container.innerHTML = "<tr><td colspan='5' style='text-align:center'>No previous orders found.</td></tr>";
        return;
    }
    // 5. Render. from newest to oldest
    for (var i = myOrders.length - 1; i >= 0; i--) {
        // 1. Get the order
        var order = myOrders[i];
        // 2. Conlect all items in the order
        var itemsList = "";
        for (var j = 0; j < order.items.length; j++) {
            itemsList += order.items[j].name + ", ";
        }
        // 3. Remove trailing comma
        itemsList = itemsList.substring(0, itemsList.length - 2);
        // 4. Determine CSS class for status
        var statusClass = "status-" + order.status;
        // 5. Create Return Button if order was approved
        var returnBtn = "";
        if (order.status === CONFIRMED) {
            returnBtn = `<button onclick="requestReturn(${order.id})" class="btn-return">Return Order</button>`;
        }
        // 6. Render the order
        container.innerHTML += `
            <tr>
                <td>#${order.id}</td>
                <td>${order.date || 'Just now'}</td>
                <td>${itemsList}</td>
                <td>$${order.total}</td>
                <td class="${statusClass}">
                    ${order.status}
                    ${returnBtn}
                </td>
            </tr>
        `;
    }
}


// ===========================
// RATINGS & REVIEWS
// ===========================

// Add
function addReview(productId) {
    // 0. check user first
    var user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    if (!user) {
        alert("Please login to leave a review.");
        window.location.href = 'login.html';
        return;
    }
    // 1. prompt for a rating
    var rating = prompt("Rate this product (1-5):");
    if (rating === null) return;
    // 2. Validate rating
    rating = parseInt(rating);
    if (rating < 1 || rating > 5 || isNaN(rating)) {
        alert("Please enter a number between 1 and 5");
        return;
    }
    // 3. prompt for a comment
    var comment = prompt("Leave a comment:");
    // 4. Get the current user info
    var user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    // 5. Create a new review
    var newReview = {
        productId: productId,
        userId: user.id,
        userName: user.name,
        rating: rating,
        comment: comment || ""
    };
    // 6. get the reviews and add the new one
    var reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY)) || [];
    reviews.push(newReview);
    // 7. Save it to localStorage
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    // 8. Alert for success
    alert("Thank you for your feedback!");
}

// Get
function getProductRating(productId) {
    // 1. Get the reviews
    var reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY)) || [];
    // 2. Get the count and total
    var count = 0;
    var total = 0;
    for (var i = 0; i < reviews.length; i++) {
        if (reviews[i].productId == productId) {
            total += reviews[i].rating;
            count++;
        }
    }
    // 3. Return 0 if no reviews
    if (count === 0) return 0;
    // 4. Return the average rating
    return (total / count).toFixed(1);
}


// ===========================
// Returning Orders
// ===========================

// Request Return
function requestReturn(orderId) {
    // 1. Confirm desire for returning
    if (!confirm("Request a return for this order?")) return;
    // 2. Get the orders info
    var orders = JSON.parse(localStorage.getItem(ORDERS_KEY));
    // 3. Update the status
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].id == orderId) {
            orders[i].status = 'return_requested';
        }
    }
    // 4. Update the orders info
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    // refresh
    loadUserOrders();
}
