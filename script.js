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
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'products.html';
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
// Check if user is logged in
function checkAuth() {
    // 0. Get the current user
    var user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));

    // 1. Check if current user exists
    if (!user) {
        location.href = 'index.html';
        return null;
    }

    // 2. Get the current page name (e.g., "admin-dashboard.html", "products.html")
    var currentPage = location.pathname.split('/').pop();

    // 3. Switch based on Role to protect pages
    switch (user.role) {
        case ADMIN:
            // Admin is ONLY allowed on admin-dashboard.html. 
            if (currentPage !== 'admin-dashboard.html') {
                location.href = 'admin-dashboard.html';
            }
            break;

        case CUSTOMER:
            // Customer is NOT allowed on admin-dashboard.html.
            if (currentPage === 'admin-dashboard.html') {
                location.href = 'products.html';
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
        // 7. Check if empty stock 
        if (product.stock <= 0) {
            btnState = "disabled";
            btnText = "Out of Stock";
        }
        // 8. Display to the container
        var html = `
            <div class="col-3 product-card">
                <button class="wishlist-btn ${heartClass}" onclick="toggleWishlist(${product.id})">♥</button>
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p style="height: 40px; overflow: hidden;">${product.description}</p>
                <p class="price">$${product.price}</p>
                
                <p style="color:orange; margin: 5px 0;">
                    ${stars} <span style="color:black; font-size:0.8em">(${averageRating})</span>
                    <button onclick="addReview(${product.id})" style="padding:2px 5px; font-size:10px; margin-left:5px; background:#8d99ae;">Rate</button>
                </p>

                <p class="stock">Stock: ${product.stock}</p>
                <button onclick="addToCart(${product.id})" ${btnState} style="width:100%">${btnText}</button>
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
function addToCart(productId) {
    // 1. Get current cart and products array
    var cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    var products = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
    // 2. Get the product from the array
    var product = null;
    for (var i = 0; i < products.length; i++) {
        if (products[i].id == productId) {
            product = products[i];
            break;
        }
    }
    // 3. Add the product if exist.
    if (product) {
        // a. add to cart
        cart.push(product);
        // b.update the cart content and count
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCartCount();
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
    // 1. Get the wishlist array
    var wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    // 2. Get the product's index inside wishlist
    var index = wishlist.indexOf(productId);
    // 3. Check if exists
    if (index === -1) {
        // a. Add
        wishlist.push(productId);
        alert("Added to Wishlist");
    } else {
        // b. Remove
        wishlist.splice(index, 1);
        alert("Removed from Wishlist");
    }
    // 4. Update the wishlist
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    // 5. Refresh
    renderHomeProducts();
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
        container.innerHTML = "<tr><td colspan='5' style='text-align:center'>Your cart is empty. <a href='products.html'>Go Shopping</a></td></tr>";
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
    // 1. Get the cart array
    var cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    // 2. Check if cart is empty
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    // 3. Confirm desire to checkout
    if (!confirm("Are you sure you want to place this order?")) return;
    // 4. Get Current User info
    var user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    // 5. Calculate Total of Cart
    var total = 0;
    for (var i = 0; i < cart.length; i++) {
        total += parseFloat(cart[i].price);
    }
    // 6. Create new Order Object
    var newOrder = {
        id: Date.now(),
        userId: user.id,
        items: cart,
        total: total,
        status: 'pending',
        date: new Date().toLocaleDateString()
    };
    // 7. Get the orders array
    var orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    // 8. Add the new order
    orders.push(newOrder);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    // 8. Clear Cart
    localStorage.setItem(CART_KEY, JSON.stringify([]));
    // 9. Redirect
    alert("Order Placed Successfully! Waiting for Admin approval.");
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
            returnBtn = `<button onclick="requestReturn(${order.id})" style="background:#fca311; font-size:12px; margin-left:10px;">Return Order</button>`;
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
