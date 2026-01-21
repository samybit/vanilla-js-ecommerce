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


// ===========================
//  DataBase Initialization
// ===========================

(function () {
    if (!localStorage.getItem(USERS_KEY)) {
        localStorage.setItem(USERS_KEY, JSON.stringify([{ id: 1, name: 'Admin', email: 'admin@test.com', password: '123456', role: ADMIN }]));
    }
    if (!localStorage.getItem(PRODUCTS_KEY)) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(CATEGORIES_KEY)) {
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify([]));
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
    if (!localStorage.getItem('reviews')) {
        localStorage.setItem('reviews', JSON.stringify([]));
    }
})();


//  oooooooo8 ooooo  ooooooo8 oooo   oooo ooooo oooo   oooo  ooooooo8   ooooo         ooooooo     ooooooo8 ooooo  oooooooo8 
// 888         888 o888    88  8888o  88   888   8888o  88 o888    88    888        o888   888o o888    88  888 o888     88 
//  888oooooo  888 888    oooo 88 888o88   888   88 888o88 888    oooo   888        888     888 888    oooo 888 888         
//         888 888 888o    88  88   8888   888   88   8888 888o    88    888      order 888o   o888 888o    88  888 888o     oo 
// o88oooo888 o888o 888ooo888 o88o    88  o888o o88o    88  888ooo888   o888ooooo88   88ooo88    888ooo888 o888o 888oooo88                                                                                                           
// ===========================
//  Login/Register UI
// ===========================

var registerBtn = document.getElementById('registerBtn');
if (registerBtn) {
    registerBtn.addEventListener('click', showRegister);
}

var loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
    loginBtn.addEventListener('click', showLogin);
}

function showRegister() {
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('registerSection').classList.remove('hidden');
}

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

// Get logout button and Add logout event listener
var logoutBtn = document.getElementById('logoutBtn');

// Check if the button actually exists on this page
if (logoutBtn) {
    logoutBtn.addEventListener('click', function (event) {
        event.preventDefault();
        logout();
    });
}

// Logout by removing current user
function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = 'index.html';
}

// ===========================
// AUTHENTICATION LOGIC
// ===========================
// Check if user is logged in
function checkAuth() {
    // 0. Get the current user
    var user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));

    // 1. Check if current user exists
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

// (For login page) Check if user already logged in. If so, redirect to the correct page.
function checkAlreadyLoggedIn() {
    if (localStorage.getItem(CURRENT_USER_KEY)) {
        var user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
        if (user.role === 'admin') {
            location.href = 'admin-dashboard.html';
        } else {
            location.href = 'products.html';
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
//  General Logic - loadAdminData() Initializes the dashboard.
//      It calls all the necessary render functions immediately upon page load to display 
//      categories, products, and orders, and populates the category dropdown menu.

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
    var categories = JSON.parse(localStorage.getItem('categories')) || [];
    // 2. Get the html container and clear it
    var container = document.getElementById('categoryList');
    container.innerHTML = "Current Categories: ";
    // 3. Loop through the categories array and display them
    for (var i = 0; i < categories.length; i++) {
        container.innerHTML += `
        <span style="background:#ddd; padding:5px; margin:5px;">${categories[i]}
            <a href="#" onclick="deleteCategory('${categories[i]}')" style="color:red; text-decoration:none;">
                x
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
    // 0. Get the new product values
    var id = document.getElementById('productId').value;
    var name = document.getElementById('productName').value;
    var image = document.getElementById('productImage').value;
    var price = document.getElementById('productPrice').value;
    var stock = document.getElementById('productStock').value;
    var category = document.getElementById('productCategory').value;
    var description = document.getElementById('productDescription').value;
    var error = document.getElementById('productError');
    // 1. Validations
    // -Numeric inputs regex patterns
    var priceRegex = /^\d+(\.\d{1,2})?$/; // Allow "10" or "10.50"
    var stockRegex = /^\d+$/;             // Allow only whole numbers
    // a. Check Empty Fields
    if (name == "" || image == "" || category == "" || description == "") {
        error.innerText = "Please fill in all fields.";
        return;
    }
    // b. Check Price
    if (!priceRegex.test(price) || parseFloat(price) <= 0) {
        error.innerText = "Price must be a valid positive number.";
        return;
    }
    // c. Check Stock
    if (!stockRegex.test(stock)) {
        error.innerText = "Stock must be a whole number.";
        return;
    }
    // 3. get the products array
    var products = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
    // 4. Update or Create a product
    if (id) {
        // UPDATE a Product
        for (var i = 0; i < products.length; i++) {
            if (products[i].id == id) {
                products[i].name = name;
                products[i].image = image;
                products[i].price = price;
                products[i].stock = stock;
                products[i].category = category;
                products[i].description = description;
            }
        }
    } else {
        // CREATE new Product
        var newProduct = {
            id: Date.now(),
            name: name,
            image: image,
            price: price,
            stock: stock,
            category: category,
            description: description
        };
        products.push(newProduct);
    }
    // 5. Save the products new array
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    // 6. Refresh
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
    // 1. Get the products array
    var products = JSON.parse(localStorage.getItem(PRODUCTS_KEY));
    // 2. Find the desired product
    var product = null;
    for (var i = 0; i < products.length; i++) {
        if (products[i].id == id) product = products[i];
    }
    // 3. If found
    if (product) {
        // Fill the form and change button and title text
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productImage').value = product.image;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productDescription').value = product.description;

        document.getElementById('saveBtn').innerText = "Update Product";
        document.getElementById('formTitle').innerText = "Edit Product ID: " + product.id;
    }
}

// Reset
function resetProdForm() {
    // Empty the form and change button and title text
    document.getElementById('productId').value = "";
    document.getElementById('productName').value = "";
    document.getElementById('productImage').value = "";
    document.getElementById('productPrice').value = "";
    document.getElementById('productStock').value = "";
    document.getElementById('productCategory').value = "";
    document.getElementById('productDescription').value = "";
    document.getElementById('productError').innerText = "";

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
    var orders = JSON.parse(localStorage.getItem(ORDERS_KEY));
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
