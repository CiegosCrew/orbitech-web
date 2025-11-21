// Scroll suave
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        // No prevenir el comportamiento predeterminado para enlaces con #
        if (link.getAttribute('href') !== '#') {
            e.preventDefault();
            document.querySelector(link.getAttribute('href')).scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
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
    
    // Funciones
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
        const priceText = priceElement.textContent.replace(/[^0-9.,]/g, '').replace(',', '.');
        const productPrice = parseFloat(priceText);
        const productImage = productCard.querySelector('img').src;
        
        // Verificar si el producto ya está en el carrito
        const existingItem = cart.find(item => item.name === productName);
        
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
        
        // Actualizar la interfaz
        updateCartUI();
        
        // Mostrar notificación
        showNotification(`${productName} añadido al carrito`);
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
                <img src="${item.image}" alt="${item.name}">
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
        
        updateCartUI();
    }
    
    function removeFromCart(e) {
        const index = parseInt(e.target.dataset.index);
        if (!isNaN(index) && index >= 0 && index < cart.length) {
            const itemName = cart[index].name;
            cart.splice(index, 1);
            updateCartUI();
            showNotification(`${itemName} eliminado del carrito`);
        }
    }
    
    function checkout() {
        if (cart.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        
        // Aquí iría la lógica de pago
        alert('¡Gracias por tu compra! Total: ' + (cartTotal ? cartTotal.textContent : '$0.00'));
        
        // Vaciar el carrito después de la compra
        cart = [];
        updateCartUI();
        closeCart();
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Mostrar notificación
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Ocultar notificación después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            
            // Eliminar notificación del DOM después de la animación
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Estilos para la notificación
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: #2ecc71;
            color: white;
            padding: 12px 24px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            transition: transform 0.3s ease-in-out;
        }
        
        .notification.show {
            transform: translateX(-50%) translateY(0);
        }
        
        .empty-cart {
            text-align: center;
            color: #666;
            padding: 20px;
        }
        
        .cart-item {
            display: flex;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eee;
        }
        
        .cart-item img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 5px;
            margin-right: 15px;
        }
        
        .item-details {
            flex: 1;
        }
        
        .item-details h4 {
            margin: 0 0 5px;
            font-size: 1rem;
        }
        
        .item-price {
            font-weight: 600;
            color: var(--accent);
            margin: 5px 0;
            display: block;
        }
        
        .quantity-controls {
            display: flex;
            align-items: center;
            margin-top: 5px;
        }
        
        .quantity-btn {
            background: var(--light-gray);
            border: none;
            width: 25px;
            height: 25px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-weight: bold;
            transition: background 0.3s;
        }
        
        .quantity-btn:hover {
            background: #ddd;
        }
        
        .quantity {
            margin: 0 10px;
            min-width: 20px;
            text-align: center;
        }
        
        .remove-item {
            color: var(--danger);
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1.2rem;
            margin-left: 10px;
            transition: transform 0.3s;
        }
        
        .remove-item:hover {
            transform: rotate(90deg);
        }
    `;
    document.head.appendChild(style);
    
    // Inicializar el carrito
    updateCartUI();
});
