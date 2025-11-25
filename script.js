// ====================
// SISTEMA DE TEMA (CLARO / OSCURO)
// ====================

function getStoredTheme() {
    try {
        return localStorage.getItem('orbitech-theme');
    } catch (e) {
        return null;
    }
}

function storeTheme(theme) {
    try {
        localStorage.setItem('orbitech-theme', theme);
    } catch (e) {
        // Ignorar errores de almacenamiento
    }
}

function applyTheme(theme) {
    const root = document.documentElement;
    const normalized = theme === 'dark' ? 'dark' : 'light';
    root.setAttribute('data-theme', normalized === 'dark' ? 'dark' : 'light');
}

function initTheme() {
    const stored = getStoredTheme();
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = stored || (prefersDark ? 'dark' : 'light');
    applyTheme(initialTheme);

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        const setIcon = (theme) => {
            if (!icon) return;
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        };

        setIcon(initialTheme);

        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            storeTheme(next);
            setIcon(next);
        });
    }
}

// ====================
// SISTEMA DE AUTENTICACIÓN
// ====================

// Credenciales del administrador
const ADMIN_CREDENTIALS = {
    email: 'cristianbenegas137@gmail.com',
    password: 'AdminOrbitech2025!',
    name: 'Administrador'
};

const USERS_KEY = 'orbitech-users';

function loadUsers() {
    try {
        const raw = localStorage.getItem(USERS_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.error('Error al cargar usuarios:', e);
        return [];
    }
}

function saveUsers(list) {
    try {
        localStorage.setItem(USERS_KEY, JSON.stringify(list));
    } catch (e) {
        console.error('Error al guardar usuarios:', e);
    }
}

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

    if (isAdmin) {
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
        return;
    }

    // Buscar usuario registrado en la "base de datos" local
    const users = loadUsers();
    const found = users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (!found) {
        showNotification('Correo o contraseña incorrectos', 'error');
        return;
    }

    const user = {
        name: found.name || 'Usuario',
        email: found.email,
        isAdmin: !!found.isAdmin
    };

    if (user.isAdmin) {
        sessionStorage.setItem('adminAuthenticated', 'true');
    }
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
    
    const users = loadUsers();
    const exists = users.some(u => u.email && u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
        showNotification('Ya existe un usuario registrado con ese correo', 'error');
        return;
    }

    const newUser = {
        name,
        email,
        password,
        isAdmin: false,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

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
// ====================

// Inicializar sistema de tema, autenticación, catálogo y carrito cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initAuth();
    restoreAuthState();
    initCatalog();
    initCart();
});

// Inicializar catálogo de productos/ofertas
function initCatalog() {
    const productGrid = document.querySelector('.product-grid');
    const offersGrid = document.querySelector('.ofertas-grid');
    const heroSearchInput = document.querySelector('.hero .search-bar input');
    const heroSearchButton = document.querySelector('.hero .search-bar button');
    const homeCategoryCards = document.querySelectorAll('.home-category-card');
    const heroSection = document.getElementById('inicio');
    const productsSection = document.getElementById('productos');
    const productDetailSection = document.getElementById('product-detail');
    const detailImage = document.getElementById('detailImage');
    const detailTitle = document.getElementById('detailTitle');
    const detailDescription = document.getElementById('detailDescription');
    const detailPrice = document.getElementById('detailPrice');
    const detailBadge = document.getElementById('detailBadge');
    const detailBackBtn = document.getElementById('productDetailBack');
    const detailCard = document.getElementById('productDetailCard');
    const shippingPostalCode = document.getElementById('shippingPostalCode');
    const calculateShippingBtn = document.getElementById('calculateShippingBtn');
    const shippingResult = document.getElementById('shippingResult');
    const imageLightbox = document.getElementById('imageLightbox');
    const imageLightboxImg = document.getElementById('imageLightboxImg');
    const imageLightboxClose = imageLightbox ? imageLightbox.querySelector('.image-lightbox-close') : null;
    const imageLightboxBackdrop = imageLightbox ? imageLightbox.querySelector('.image-lightbox-backdrop') : null;

    if (!productGrid) return;

    const baseProducts = [];

    let products = baseProducts.slice();
    let currentProduct = null;

    const ADMIN_PRODUCTS_KEY = 'orbitech-admin-products';

    function loadAdminProductsForStore() {
        try {
            const raw = localStorage.getItem(ADMIN_PRODUCTS_KEY);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }

    function refreshProductsFromAdmin() {
        const adminList = loadAdminProductsForStore();
        products = baseProducts.slice();

        if (adminList && adminList.length) {
            const mapped = adminList.map((p, index) => {
                const priceNumber = parseFloat(p.price);
                return {
                    id: p.id || `admin-${index}-${Date.now()}`,
                    name: p.name || 'Producto',
                    description: p.description || '',
                    price: isNaN(priceNumber) ? 0 : priceNumber,
                    image: p.image || 'https://via.placeholder.com/400x250?text=Producto',
                    category: p.category || 'otros',
                    badge: p.badge || 'Nuevo'
                };
            });
            products = products.concat(mapped);
        }
    }

    const offers = [
        {
            id: 'offer-1',
            name: 'Combo Teclado + Mouse',
            price: 49.99,
            discountLabel: '-20% OFF',
            image: 'https://via.placeholder.com/400x200?text=Combo+Teclado+Mouse'
        },
        {
            id: 'offer-2',
            name: 'Smartwatch Deportivo',
            price: 69.99,
            discountLabel: '-15% OFF',
            image: 'https://via.placeholder.com/400x200?text=Smartwatch'
        }
    ];

    let activeCategory = 'all';

    function openProductDetail(productId) {
        if (!productDetailSection || !productsSection) return;
        const product = products.find(p => p.id === productId);
        if (!product) return;

        currentProduct = product;

        if (detailImage) {
            detailImage.src = product.image;
            detailImage.alt = product.name;
            detailImage.style.display = product.image ? 'block' : 'none';
        }

        if (detailTitle) detailTitle.textContent = product.name;
        if (detailDescription) detailDescription.textContent = product.description || '';
        if (detailPrice) {
            detailPrice.textContent = `$${product.price.toFixed(2)}`;
            detailPrice.dataset.price = String(product.price);
        }

        if (detailBadge) {
            if (product.badge) {
                detailBadge.textContent = product.badge;
                detailBadge.style.display = 'inline-block';
            } else {
                detailBadge.style.display = 'none';
            }
        }

        if (detailCard) {
            detailCard.dataset.id = product.id;
        }

        if (shippingPostalCode) shippingPostalCode.value = '';
        if (shippingResult) shippingResult.textContent = '';

        if (heroSection) heroSection.style.display = 'none';
        productsSection.style.display = 'none';
        productDetailSection.style.display = 'block';
        productDetailSection.scrollIntoView({ behavior: 'smooth' });
    }

    function closeProductDetail() {
        if (!productDetailSection || !productsSection) return;
        productDetailSection.style.display = 'none';
        if (heroSection) heroSection.style.display = 'block';
        productsSection.style.display = 'block';
        currentProduct = null;
        if (shippingResult) shippingResult.textContent = '';
    }

    function openImageLightbox(src, altText) {
        if (!imageLightbox || !imageLightboxImg || !src) return;
        imageLightboxImg.src = src;
        imageLightboxImg.alt = altText || '';
        imageLightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeImageLightbox() {
        if (!imageLightbox) return;
        imageLightbox.classList.remove('active');
        if (imageLightboxImg) {
            imageLightboxImg.src = '';
        }
        document.body.style.overflow = '';
    }

    function setupShippingCalculator() {
        if (!calculateShippingBtn || !shippingPostalCode || !shippingResult) return;

        function calculate() {
            const cp = shippingPostalCode.value.trim();
            if (!cp) {
                shippingResult.textContent = 'Ingresá tu código postal para calcular el envío.';
                return;
            }

            if (!/^\d{4,5}$/.test(cp)) {
                shippingResult.textContent = 'Código postal inválido. Debe tener 4 o 5 dígitos.';
                return;
            }

            let base = 3500;
            const first = cp[0];
            if (first === '1' || first === '2') base = 2800;
            else if (first === '5' || first === '6') base = 4200;
            else if (first === '8' || first === '9') base = 4600;

            shippingResult.textContent = `Envío estimado a ${cp}: $${base.toFixed(2)} (3 a 5 días hábiles).`;
        }

        calculateShippingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            calculate();
        });

        shippingPostalCode.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                calculate();
            }
        });
    }

    function renderProducts(filterText = '') {
        if (!productGrid) return;
        productGrid.innerHTML = '';

        const normalizedFilter = filterText.trim().toLowerCase();

        const filtered = products.filter(p => {
            if (activeCategory !== 'all' && p.category !== activeCategory) return false;
            if (!normalizedFilter) return true;
            const haystack = `${p.name} ${p.description}`.toLowerCase();
            return haystack.includes(normalizedFilter);
        });

        if (filtered.length === 0) {
            const empty = document.createElement('p');
            empty.textContent = 'No se encontraron productos para esa búsqueda.';
            empty.style.textAlign = 'center';
            empty.style.color = '#7f8c8d';
            productGrid.appendChild(empty);
            return;
        }

        filtered.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.dataset.id = product.id;

            const badgeHtml = product.badge ? `<span class="product-badge">${product.badge}</span>` : '';

            card.innerHTML = `
                ${badgeHtml}
                <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null; this.style.display='none';">
                <h3>${product.name}</h3>
                <p class="description">${product.description}</p>
                <p class="price" data-price="${product.price}">$${product.price.toFixed(2)}</p>
                <div class="product-meta">
                    <span class="installments"><i class="fas fa-credit-card"></i> Hasta 6 cuotas sin interés</span>
                    <span class="shipping"><i class="fas fa-truck"></i> Envío a todo el país</span>
                </div>
            `;

            card.addEventListener('click', () => openProductDetail(product.id));
            productGrid.appendChild(card);
        });
    }

    function renderOffers() {
        if (!offersGrid) return;
        offersGrid.innerHTML = '';

        offers.forEach(offer => {
            const card = document.createElement('div');
            card.className = 'oferta-card';
            card.dataset.id = offer.id;
            card.innerHTML = `
                <span class="discount-badge">${offer.discountLabel}</span>
                <img src="${offer.image}" alt="${offer.name}" onerror="this.onerror=null; this.style.display='none';">
                <h3>${offer.name}</h3>
                <p class="price" data-price="${offer.price}">$${offer.price.toFixed(2)}</p>
                <button class="btn-oferta">Añadir al carrito</button>
            `;
            const offerImg = card.querySelector('img');
            if (offerImg) {
                offerImg.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (!offerImg.src) return;
                    openImageLightbox(offerImg.src, offerImg.alt || offer.name);
                });
            }
            offersGrid.appendChild(card);
        });
    }

    refreshProductsFromAdmin();

    // Render inicial
    renderProducts();
    renderOffers();

    // Escuchar cambios en localStorage para sincronizar productos del admin
    window.addEventListener('storage', (e) => {
        if (e.key === ADMIN_PRODUCTS_KEY) {
            refreshProductsFromAdmin();
            const currentSearch = heroSearchInput ? heroSearchInput.value : '';
            renderProducts(currentSearch);
        }
    });

    // Volver a sincronizar productos cuando se vuelve a esta página (por ejemplo, con el botón Atrás)
    window.addEventListener('pageshow', () => {
        refreshProductsFromAdmin();
        const currentSearch = heroSearchInput ? heroSearchInput.value : '';
        renderProducts(currentSearch);
    });

    // Filtros por categoría
    const filterChips = document.querySelectorAll('.product-filters .filter-chip');
    if (filterChips.length) {
        filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                activeCategory = chip.dataset.category || 'all';
                filterChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');

                const currentSearch = heroSearchInput ? heroSearchInput.value : '';
                renderProducts(currentSearch);
            });
        });
    }

    // Buscador del hero filtrando productos
    if (heroSearchInput) {
        // Filtrar mientras se escribe
        heroSearchInput.addEventListener('input', () => {
            if (homeCategoryCards && homeCategoryCards.length) {
                homeCategoryCards.forEach(card => card.classList.remove('active'));
            }
            renderProducts(heroSearchInput.value);
        });

        // Permitir presionar Enter para buscar
        heroSearchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                if (homeCategoryCards && homeCategoryCards.length) {
                    homeCategoryCards.forEach(card => card.classList.remove('active'));
                }
                renderProducts(heroSearchInput.value);
            }
        });
    }

    // Botón de la lupa también dispara la búsqueda
    if (heroSearchButton && heroSearchInput) {
        heroSearchButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (homeCategoryCards && homeCategoryCards.length) {
                homeCategoryCards.forEach(card => card.classList.remove('active'));
            }
            renderProducts(heroSearchInput.value);
        });
    }

    // Franja de categorías de la home
    if (homeCategoryCards && homeCategoryCards.length) {
        homeCategoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const term = card.dataset.term || '';
                if (heroSearchInput) {
                    heroSearchInput.value = term;
                }

                homeCategoryCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                renderProducts(term);

                if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    if (detailBackBtn) {
        detailBackBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeProductDetail();
        });
    }

    const navHomeLink = document.querySelector('nav a[href="#inicio"]');
    const navProductsLink = document.querySelector('nav a[href="#productos"]');
    const logoLink = document.querySelector('header .logo');

    function handleNavBackToListing() {
        if (!productDetailSection || !productsSection) return;
        if (productDetailSection.style.display === 'block') {
            closeProductDetail();
        }
    }

    if (navHomeLink) {
        navHomeLink.addEventListener('click', handleNavBackToListing);
    }
    if (navProductsLink) {
        navProductsLink.addEventListener('click', handleNavBackToListing);
    }
    if (logoLink) {
        logoLink.addEventListener('click', handleNavBackToListing);
    }

    setupShippingCalculator();

    if (imageLightboxClose) {
        imageLightboxClose.addEventListener('click', () => {
            closeImageLightbox();
        });
    }

    if (imageLightboxBackdrop) {
        imageLightboxBackdrop.addEventListener('click', () => {
            closeImageLightbox();
        });
    }

    document.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') {
            closeImageLightbox();
        }
    });

    if (detailImage) {
        detailImage.addEventListener('click', () => {
            if (!detailImage.src) return;
            const alt = detailTitle ? detailTitle.textContent : (detailImage.alt || 'Producto');
            openImageLightbox(detailImage.src, alt);
        });
    }
}

// Inicializar carrito
function initCart() {
    // Elementos del DOM del carrito
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCartBtn = document.querySelector('.close-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total span');
    const checkoutBtn = document.querySelector('.checkout-btn');
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

    // Delegación de eventos para botones de "Añadir al carrito"
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.add-to-cart, .btn-oferta');
        if (!trigger) return;
        addToCart(e);
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
        const productCard = e.target.closest('.product-card, .oferta-card, .product-detail-card');
        if (!productCard) return;

        const productId = productCard.dataset.id || Date.now().toString();
        const nameElement = productCard.querySelector('h3, h2');
        const productName = nameElement ? nameElement.textContent : 'Producto';
        const priceElement = productCard.querySelector('.price');
        const priceText = priceElement ? (priceElement.dataset.price || priceElement.textContent.replace(/[^0-9.,]/g, '').replace(',', '.')) : '0';
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
                <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null; this.style.display='none';">
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
