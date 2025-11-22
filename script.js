// ====================
// SISTEMA DE AUTENTICACIÓN
// ====================

// Credenciales del administrador
const ADMIN_CREDENTIALS = {
    email: 'cristianbenegas137@gmail.com',
    password: 'AdminOrbitech2025!',
    name: 'Administrador'
};

// Elementos del DOM del sistema de autenticación
const authModal = document.querySelector('.auth-modal');
const authContent = document.querySelector('.auth-content');
const loginBtn = document.querySelector('.btn-login');
const registerBtn = document.querySelector('.btn-register');
const closeModalBtn = document.querySelector('.close-modal');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const togglePasswordBtns = document.querySelectorAll('.toggle-password');
const passwordInputs = document.querySelectorAll('input[type="password"]');
const registerPassword = document.getElementById('register-password');
const passwordStrength = document.querySelector('.password-strength');
const strengthBar = document.querySelector('.strength-bar');
const strengthText = document.querySelector('.strength-text');

// Inicialización del sistema de autenticación
function initAuth() {
    // Event listeners para botones de autenticación
    if (loginBtn) loginBtn.addEventListener('click', () => openAuthModal('login'));
    if (registerBtn) registerBtn.addEventListener('click', () => openAuthModal('register'));
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeAuthModal);
    
    // Cerrar modal al hacer clic fuera del contenido
    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                closeAuthModal();
            }
        });
    }
    
    // Cambio entre pestañas de inicio de sesión y registro
    if (loginTab) loginTab.addEventListener('click', () => switchTab('login'));
    if (registerTab) registerTab.addEventListener('click', () => switchTab('register'));
    
    // Mostrar/ocultar contraseña
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', togglePasswordVisibility);
    });
    
    // Validación de formularios
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    
    // Validación de fortaleza de contraseña
    if (registerPassword) {
        registerPassword.addEventListener('input', updatePasswordStrength);
    }
}

// Abrir modal de autenticación
function openAuthModal(tab = 'login') {
    if (!authModal || !authContent) return;
    
    authModal.style.display = 'flex';
    setTimeout(() => {
        authModal.classList.add('active');
        authContent.style.transform = 'translateY(0)';
    }, 10);
    
    switchTab(tab);
}

// Cerrar modal de autenticación
function closeAuthModal() {
    if (!authModal || !authContent) return;
    
    authContent.style.transform = 'translateY(-50px)';
    authModal.classList.remove('active');
    
    setTimeout(() => {
        authModal.style.display = 'none';
        // Limpiar formularios al cerrar
        if (loginForm) loginForm.reset();
        if (registerForm) registerForm.reset();
        resetPasswordStrength();
    }, 300);
}

// Cambiar entre pestañas de inicio de sesión y registro
function switchTab(tab) {
    if (tab === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        document.getElementById('login-form').classList.add('active');
        document.getElementById('register-form').classList.remove('active');
    } else {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        document.getElementById('register-form').classList.add('active');
        document.getElementById('login-form').classList.remove('active');
    }
}

// Mostrar/ocultar contraseña
function togglePasswordVisibility(e) {
    const button = e.target.closest('.toggle-password');
    if (!button) return;
    
    const input = button.previousElementSibling;
    if (!input || (input.type !== 'password' && input.type !== 'text')) return;
    
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    button.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
    
    // Mover el cursor al final del input
    const temp = input.value;
    input.value = '';
    input.focus();
    input.value = temp;
}

// Manejar inicio de sesión
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    // Validación básica
    if (!email || !password) {
        showNotification('Por favor, completa todos los campos', 'error');
        return;
    }

    const isAdmin = email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password;

    if (!isAdmin) {
        showNotification('Correo o contraseña incorrectos', 'error');
        return;
    }

    const user = {
        name: ADMIN_CREDENTIALS.name,
        email: ADMIN_CREDENTIALS.email,
        isAdmin: true
    };

    sessionStorage.setItem('adminAuthenticated', 'true');
    sessionStorage.setItem('authUser', JSON.stringify(user));

    showNotification('Inicio de sesión exitoso', 'success');
    closeAuthModal();
    updateAuthUI(true, user);
}

// Manejar registro
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const termsAccepted = document.getElementById('terms').checked;
    
    // Validación
    if (!name || !email || !password || !confirmPassword) {
        showNotification('Por favor, completa todos los campos', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Las contraseñas no coinciden', 'error');
        return;
    }
    
    if (password.length < 8) {
        showNotification('La contraseña debe tener al menos 8 caracteres', 'error');
        return;
    }
    
    if (!termsAccepted) {
        showNotification('Debes aceptar los términos y condiciones', 'error');
        return;
    }
    
    // Aquí iría la lógica de registro con el servidor
    // Por ahora, solo mostramos un mensaje de éxito
    showNotification('¡Registro exitoso! Ahora puedes iniciar sesión', 'success');
    
    // Cambiar a la pestaña de inicio de sesión
    switchTab('login');
    
    // Limpiar formulario de registro
    registerForm.reset();
    resetPasswordStrength();
}

// Actualizar la interfaz según el estado de autenticación
function updateAuthUI(isAuthenticated, user = {}) {
    const authButtons = document.querySelector('.auth-buttons');
    if (!authButtons) return;

    const existingUserMenu = document.querySelector('.user-menu');
    if (existingUserMenu) {
        existingUserMenu.remove();
    }

    if (isAuthenticated) {
        authButtons.style.display = 'none';

        const userMenu = document.createElement('div');
        userMenu.className = 'user-menu';
        userMenu.innerHTML = `
            <button class="user-btn">
                <i class="fas fa-user-circle"></i>
                <span>${user.name || 'Mi Cuenta'}</span>
                <i class="fas fa-chevron-down"></i>
            </button>
            <div class="dropdown-menu">
                <a href="#"><i class="fas fa-user"></i> Perfil</a>
                <a href="#"><i class="fas fa-shopping-bag"></i> Mis Pedidos</a>
                <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</a>
            </div>
        `;

        authButtons.parentNode.insertBefore(userMenu, authButtons);

        const userBtn = userMenu.querySelector('.user-btn');
        const dropdownMenu = userMenu.querySelector('.dropdown-menu');

        userBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!userMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });

        const logoutBtn = userMenu.querySelector('#logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                handleLogout();
            });
        }

        if (user.isAdmin) {
            ensureAdminLink();
        }
    } else {
        authButtons.style.display = 'flex';
        removeAdminLink();
    }
}

function ensureAdminLink() {
    if (document.querySelector('.admin-nav-link')) return;

    const nav = document.querySelector('nav');
    if (!nav) return;

    const adminLink = document.createElement('a');
    adminLink.href = 'admin-panel.html';
    adminLink.className = 'admin-nav-link';
    adminLink.innerHTML = '<i class="fas fa-shield-alt"></i> Admin';

    const cartIcon = nav.querySelector('.cart-icon');
    if (cartIcon) {
        nav.insertBefore(adminLink, cartIcon);
    } else {
        nav.appendChild(adminLink);
    }
}

function removeAdminLink() {
    const adminLink = document.querySelector('.admin-nav-link');
    if (adminLink) {
        adminLink.remove();
    }
}

// Cerrar sesión
function handleLogout() {
    sessionStorage.removeItem('adminAuthenticated');
    sessionStorage.removeItem('authUser');

    showNotification('Sesión cerrada correctamente', 'success');
    updateAuthUI(false);

    if (window.location.pathname.includes('admin-panel.html')) {
        window.location.href = 'index.html';
    }
}

function restoreAuthState() {
    const storedUser = sessionStorage.getItem('authUser');
    if (!storedUser) {
        updateAuthUI(false);
        return;
    }

    try {
        const user = JSON.parse(storedUser);
        if (user && user.isAdmin) {
            sessionStorage.setItem('adminAuthenticated', 'true');
        }
        updateAuthUI(true, user);
    } catch (error) {
        sessionStorage.removeItem('authUser');
        updateAuthUI(false);
    }
}

// Actualizar indicador de fortaleza de contraseña
function updatePasswordStrength() {
    if (!passwordStrength || !strengthBar || !strengthText) return;
    
    const password = registerPassword.value;
    let strength = 0;
    
    // Longitud mínima
    if (password.length >= 8) strength += 1;
    
    // Contiene letras mayúsculas
    if (/[A-Z]/.test(password)) strength += 1;
    
    // Contiene números
    if (/[0-9]/.test(password)) strength += 1;
    
    // Contiene caracteres especiales
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    // Actualizar barra de fortaleza
    const width = (strength / 4) * 100;
    strengthBar.style.width = `${width}%`;
    
    // Actualizar color y texto según la fortaleza
    if (password.length === 0) {
        strengthBar.style.backgroundColor = 'transparent';
        strengthText.textContent = '';
        passwordStrength.style.display = 'none';
        return;
    }
    
    passwordStrength.style.display = 'block';
    
    if (strength <= 1) {
        strengthBar.style.backgroundColor = '#e74c3c';
        strengthText.textContent = 'Débil';
        strengthText.style.color = '#e74c3c';
    } else if (strength <= 2) {
        strengthBar.style.backgroundColor = '#f39c12';
        strengthText.textContent = 'Moderada';
        strengthText.style.color = '#f39c12';
    } else {
        strengthBar.style.backgroundColor = '#2ecc71';
        strengthText.textContent = 'Fuerte';
        strengthText.style.color = '#2ecc71';
    }
}

// Restablecer indicador de fortaleza de contraseña
function resetPasswordStrength() {
    if (!passwordStrength || !strengthBar || !strengthText) return;
    
    strengthBar.style.width = '0%';
    strengthBar.style.backgroundColor = 'transparent';
    strengthText.textContent = '';
    passwordStrength.style.display = 'none';
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Ocultar y eliminar después de 5 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// ====================
// CARRITO DE COMPRAS
// ====================

// Inicializar sistema de autenticación y carrito cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    restoreAuthState();
    initCart();
});

// Inicializar carrito
function initCart() {
    // Elementos del DOM del carrito
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCartBtn = document.querySelector('.close-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total span');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const addToCartBtns = document.querySelectorAll('.add-to-cart, .btn-oferta');
    const overlay = document.createElement('div');
    
    // Carrito
    let cart = [];
    
    // Cargar carrito desde localStorage si existe
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            updateCartUI();
        } catch (e) {
            console.error('Error al cargar el carrito:', e);
            localStorage.removeItem('cart');
        }
    }
    
    // Crear overlay
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);
    
    // Event Listeners
    if (cartIcon) cartIcon.addEventListener('click', toggleCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if (overlay) overlay.addEventListener('click', closeCart);
    if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);
    
    // Añadir eventos a los botones de "Añadir al carrito"
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', addToCart);
    });
    
    // Funciones del carrito
    function toggleCart() {
        cartSidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
    }
    
    function closeCart() {
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function addToCart(e) {
        e.preventDefault();
        const productCard = e.target.closest('.product-card, .oferta-card');
        if (!productCard) return;
        
        const productId = productCard.dataset.id || Date.now().toString();
        const productName = productCard.querySelector('h3').textContent;
        const priceElement = productCard.querySelector('.price');
        const priceText = priceElement ? priceElement.textContent.replace(/[^0-9.,]/g, '').replace(',', '.') : '0';
        const productPrice = parseFloat(priceText) || 0;
        const productImage = productCard.querySelector('img') ? productCard.querySelector('img').src : '';
        
        // Verificar si el producto ya está en el carrito
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            // Si ya existe, aumentar la cantidad
            existingItem.quantity += 1;
        } else {
            // Si no existe, agregarlo al carrito
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        }
        
        // Guardar carrito en localStorage
        saveCart();
        
        // Actualizar la interfaz
        updateCartUI();
        
        // Mostrar notificación
        showNotification(`${productName} añadido al carrito`, 'success');
    }
    
    function updateCartUI() {
        // Limpiar el contenedor del carrito
        if (!cartItemsContainer) return;
        
        cartItemsContainer.innerHTML = '';
        
        // Si el carrito está vacío
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
            if (document.querySelector('.cart-count')) {
                document.querySelector('.cart-count').textContent = '0';
            }
            if (cartTotal) {
                cartTotal.textContent = '$0.00';
            }
            return;
        }
        
        // Actualizar contador del carrito
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        if (document.querySelector('.cart-count')) {
            document.querySelector('.cart-count').textContent = totalItems;
        }
        
        // Calcular el total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (cartTotal) {
            cartTotal.textContent = `$${total.toFixed(2)}`;
        }
        
        // Renderizar productos en el carrito
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/80?text=Imagen+no+disponible'">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <span class="item-price">$${item.price.toFixed(2)}</span>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                        <button class="remove-item" data-index="${index}">&times;</button>
                    </div>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Añadir eventos a los botones de cantidad y eliminar
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', updateQuantity);
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', removeFromCart);
        });
    }
    
    function updateQuantity(e) {
        const index = parseInt(e.target.dataset.index);
        if (isNaN(index) || index < 0 || index >= cart.length) return;
        
        const item = cart[index];
        
        if (e.target.classList.contains('plus')) {
            item.quantity += 1;
        } else if (e.target.classList.contains('minus')) {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                // Si la cantidad es 1 y se presiona el botón menos, eliminar el producto
                cart.splice(index, 1);
            }
        }
        
        // Guardar carrito en localStorage
        saveCart();
        
        updateCartUI();
    }
    
    function removeFromCart(e) {
        const index = parseInt(e.target.dataset.index);
        if (!isNaN(index) && index >= 0 && index < cart.length) {
            const itemName = cart[index].name;
            cart.splice(index, 1);
            
            // Guardar carrito en localStorage
            saveCart();
            
            updateCartUI();
            showNotification(`${itemName} eliminado del carrito`, 'info');
        }
    }
    
    function checkout() {
        if (cart.length === 0) {
            showNotification('Tu carrito está vacío', 'error');
            return;
        }
        
        // Verificar si el usuario está autenticado
        const isAuthenticated = document.querySelector('.user-menu') !== null;
        
        if (!isAuthenticated) {
            showNotification('Por favor, inicia sesión para continuar', 'error');
            closeCart();
            openAuthModal('login');
            return;
        }
        
        // Aquí iría la lógica de pago
        // Por ahora, solo mostramos un mensaje de éxito
        showNotification('¡Compra realizada con éxito!', 'success');
        
        // Vaciar el carrito después de la compra
        cart = [];
        saveCart();
        updateCartUI();
        closeCart();
    }
    
    function saveCart() {
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
        } catch (e) {
            console.error('Error al guardar el carrito:', e);
        }
    }
}

// Scroll suave para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        // No prevenir el comportamiento predeterminado para enlaces con #
        if (link.getAttribute('href') !== '#') {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth"
                });
            }
        }
    });
});

// Estilos para las notificaciones
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        transform: translateX(120%);
        transition: transform 0.3s ease-in-out;
        max-width: 300px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.success {
        background-color: #2ecc71;
    }
    
    .notification.error {
        background-color: #e74c3c;
    }
    
    .notification.info {
        background-color: #3498db;
    }
    
    .notification.warning {
        background-color: #f39c12;
    }
    
    /* Estilos para el menú de usuario */
    .user-menu {
        position: relative;
        margin-left: 15px;
    }
    
    .user-btn {
        display: flex;
        align-items: center;
        background: none;
        border: 1px solid #ddd;
        border-radius: 20px;
        padding: 6px 15px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .user-btn:hover {
        background-color: #f5f5f5;
    }
    
    .user-btn i {
        margin-right: 8px;
        font-size: 16px;
    }
    
    .user-btn .fa-chevron-down {
        margin-left: 8px;
        margin-right: 0;
        font-size: 12px;
        transition: transform 0.3s ease;
    }
    
    .dropdown-menu {
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border: 1px solid #eee;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        min-width: 200px;
        margin-top: 10px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(10px);
        transition: all 0.3s ease;
        z-index: 100;
    }
    
    .dropdown-menu.show {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
    
    .dropdown-menu a {
        display: flex;
        align-items: center;
        padding: 10px 15px;
        color: #333;
        text-decoration: none;
        transition: background-color 0.2s;
    }
    
    .dropdown-menu a:hover {
        background-color: #f8f9fa;
    }
    
    .dropdown-menu a i {
        margin-right: 10px;
        width: 20px;
        text-align: center;
    }
    
    .dropdown-menu a:not(:last-child) {
        border-bottom: 1px solid #eee;
    }
`;

document.head.appendChild(style);
