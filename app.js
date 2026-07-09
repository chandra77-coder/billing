// ============================================================
// Dukaan Bill — Complete App Logic
// ============================================================

// ——— State ————————————————————————————————————————————————
const state = {
    items: [],
    customers: [],
    bills: [],
    cart: [],
    currentFilter: 'all',
    settings: {
        shopName: 'My Dukaan',
        phone: '+91 9876543210',
        address: '123 Main Street, City',
        gst: '',
        darkMode: false,
        sound: true,
        autoprint: false
    },
    billCounter: 0
};

// ——— LocalStorage Persistence ————————————————————————————
function loadState() {
    const saved = localStorage.getItem('dukaanBill');
    if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(state, parsed);
    } else {
        seedData();
    }
}

function saveState() {
    localStorage.setItem('dukaanBill', JSON.stringify(state));
}

function seedData() {
    state.items = [
        { id: 1, name: 'Rice 1kg', category: 'grocery', price: 55, stock: 100 },
        { id: 2, name: 'Wheat Flour 5kg', category: 'grocery', price: 220, stock: 50 },
        { id: 3, name: 'Cooking Oil 1L', category: 'grocery', price: 120, stock: 80 },
        { id: 4, name: 'Sugar 1kg', category: 'grocery', price: 42, stock: 60 },
        { id: 5, name: 'Tea 250g', category: 'grocery', price: 85, stock: 40 },
        { id: 6, name: 'Bread', category: 'grocery', price: 30, stock: 25 },
        { id: 7, name: 'Milk 1L', category: 'grocery', price: 60, stock: 15 },
        { id: 8, name: 'Eggs (12)', category: 'grocery', price: 72, stock: 5 },
        { id: 9, name: 'USB Cable', category: 'electronics', price: 150, stock: 20 },
        { id: 10, name: 'Earphones', category: 'electronics', price: 299, stock: 10 },
        { id: 11, name: 'T-Shirt', category: 'clothing', price: 350, stock: 30 },
        { id: 12, name: 'Jeans', category: 'clothing', price: 800, stock: 15 },
        { id: 13, name: 'Notebook', category: 'other', price: 40, stock: 100 },
        { id: 14, name: 'Pen (Pack of 5)', category: 'other', price: 75, stock: 50 },
    ];
    state.customers = [
        { id: 1, name: 'Rahul Sharma', phone: '9876543210' },
        { id: 2, name: 'Priya Patel', phone: '9123456789' },
        { id: 3, name: 'Amit Kumar', phone: '9988776655' },
        { id: 4, name: 'Sunita Devi', phone: '9456789012' },
        { id: 5, name: 'Vikram Singh', phone: '9765432109' },
    ];
    state.bills = [
        { id: 'B001', customer: 'Rahul Sharma', items: [{ name: 'Rice 1kg', qty: 2, price: 55 }, { name: 'Sugar 1kg', qty: 1, price: 42 }], total: 152, date: new Date().toISOString(), status: 'paid' },
        { id: 'B002', customer: 'Priya Patel', items: [{ name: 'Cooking Oil 1L', qty: 1, price: 120 }, { name: 'Wheat Flour 5kg', qty: 1, price: 220 }], total: 340, date: new Date().toISOString(), status: 'due' },
        { id: 'B003', customer: 'Walk-in Customer', items: [{ name: 'Bread', qty: 3, price: 30 }], total: 90, date: new Date().toISOString(), status: 'paid' },
    ];
    state.billCounter = 3;
    saveState();
}

// ——— Navigation —————————————————————————————————————————
function navigateTo(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    document.getElementById('screen-' + screen).classList.add('active');

    const navBtn = document.querySelector(`.nav-item[data-screen="${screen}"]`);
    if (navBtn) navBtn.classList.add('active');

    const titles = {
        dashboard: 'Dukaan Bill',
        bill: 'New Bill',
        items: 'Manage Items',
        customers: 'Customers',
        bills: 'All Bills',
        reports: 'Reports',
        settings: 'Settings'
    };
    document.getElementById('header-title').textContent = titles[screen] || 'Dukaan Bill';

    renderScreen(screen);
}

function renderScreen(screen) {
    switch (screen) {
        case 'dashboard': renderDashboard(); break;
        case 'bill': renderItems(); break;
        case 'items': renderItemsManagement(); break;
        case 'customers': renderCustomers(); break;
        case 'bills': renderBills(); break;
        case 'reports': renderReports(); break;
        case 'settings': renderSettings(); break;
    }
}

// ——— Dashboard —————————————————————————————————————————
function renderDashboard() {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayBills = state.bills.filter(b => b.date.split('T')[0] === todayStr);
    const todaySales = todayBills.filter(b => b.status === 'paid').reduce((s, b) => s + b.total, 0);
    const pendingBills = state.bills.filter(b => b.status === 'due' || b.status === 'overdue');
    const pendingAmount = pendingBills.reduce((s, b) => s + b.total, 0);
    const lowStockItems = state.items.filter(i => i.stock <= 10);

    document.getElementById('stats-grid').innerHTML = `
        <div class="stat-card">
            <div class="stat-value">&#8377;${todaySales.toLocaleString()}</div>
            <div class="stat-label">Today's Sales</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${todayBills.length}</div>
            <div class="stat-label">Today's Bills</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${pendingBills.length}</div>
            <div class="stat-label">Pending</div>
        </div>
    `;

    const alertEl = document.getElementById('low-stock-alert');
    if (lowStockItems.length > 0) {
        alertEl.style.display = 'flex';
        document.getElementById('low-stock-count').textContent = lowStockItems.length + ' items need restocking';
    } else {
        alertEl.style.display = 'none';
    }

    const recentBills = state.bills.slice(-5).reverse();
    document.getElementById('recent-bills-list').innerHTML = recentBills.length === 0
        ? '<div class="empty-state"><div class="empty-state-icon">&#128196;</div><p>No bills yet</p></div>'
        : recentBills.map(b => `
            <div class="list-item" onclick="showBillDetail('${b.id}')">
                <div class="list-item-content">
                    <div class="list-item-title">${b.id}</div>
                    <div class="list-item-subtitle">${b.customer} &middot; ${formatDate(b.date)}</div>
                </div>
                <div class="list-item-right">
                    <div class="list-item-amount">&#8377;${b.total}</div>
                    <span class="badge badge-${b.status}">${b.status}</span>
                </div>
            </div>
        `).join('');
}

// ——— Items (Bill Screen) ———————————————————————————————
function renderItems() {
    const items = state.currentFilter === 'all'
        ? state.items
        : state.items.filter(i => i.category === state.currentFilter);

    const grid = document.getElementById('item-grid');
    if (items.length === 0) {
        grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;"><div class="empty-state-icon">&#128230;</div><p>No items found</p></div>';
        return;
    }

    grid.innerHTML = items.map(item => {
        const inCart = state.cart.find(c => c.id === item.id);
        const qty = inCart ? inCart.qty : 0;
        const stockClass = item.stock <= 0 ? 'out-of-stock' : (item.stock <= 10 ? 'low-stock' : '');
        return `
            <div class="item-card ${stockClass}" onclick="selectItem(${item.id})">
                <div class="item-card-name">${item.name}</div>
                <div class="item-card-price">&#8377;${item.price}</div>
                <div class="item-card-stock">Stock: ${item.stock}</div>
                ${qty > 0 ? `
                    <div class="stepper" onclick="event.stopPropagation()">
                        <div class="stepper-btn" onclick="changeQty(${item.id}, -1)">&minus;</div>
                        <div class="stepper-value">${qty}</div>
                        <div class="stepper-btn" onclick="changeQty(${item.id}, 1)">+</div>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function filterItems(category, el) {
    state.currentFilter = category;
    document.querySelectorAll('#item-tabs .tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    renderItems();
}

function searchItems(query) {
    const q = query.toLowerCase();
    const items = state.items.filter(i => i.name.toLowerCase().includes(q));
    const grid = document.getElementById('item-grid');
    if (items.length === 0) {
        grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;"><div class="empty-state-icon">&#128269;</div><p>No items found</p></div>';
        return;
    }
    grid.innerHTML = items.map(item => {
        const inCart = state.cart.find(c => c.id === item.id);
        const qty = inCart ? inCart.qty : 0;
        const stockClass = item.stock <= 0 ? 'out-of-stock' : (item.stock <= 10 ? 'low-stock' : '');
        return `
            <div class="item-card ${stockClass}" onclick="selectItem(${item.id})">
                <div class="item-card-name">${item.name}</div>
                <div class="item-card-price">&#8377;${item.price}</div>
                <div class="item-card-stock">Stock: ${item.stock}</div>
                ${qty > 0 ? `
                    <div class="stepper" onclick="event.stopPropagation()">
                        <div class="stepper-btn" onclick="changeQty(${item.id}, -1)">&minus;</div>
                        <div class="stepper-value">${qty}</div>
                        <div class="stepper-btn" onclick="changeQty(${item.id}, 1)">+</div>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function selectItem(id) {
    const item = state.items.find(i => i.id === id);
    if (!item || item.stock <= 0) return;

    const inCart = state.cart.find(c => c.id === id);
    if (inCart) {
        inCart.qty++;
    } else {
        state.cart.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
    }
    updateCart();
    renderItems();
}

function changeQty(id, delta) {
    const inCart = state.cart.find(c => c.id === id);
    if (!inCart) return;
    inCart.qty += delta;
    if (inCart.qty <= 0) {
        state.cart = state.cart.filter(c => c.id !== id);
    }
    updateCart();
    renderItems();
}

function updateCart() {
    const total = state.cart.reduce((s, c) => s + c.price * c.qty, 0);
    const count = state.cart.reduce((s, c) => s + c.qty, 0);

    document.getElementById('cart-count').textContent = count;
    document.getElementById('cart-total').textContent = '\u20B9' + total.toLocaleString();

    const cartBar = document.getElementById('cart-bar');
    if (count > 0) {
        cartBar.style.display = 'flex';
    } else {
        cartBar.style.display = 'none';
    }
}

// ——— Cart Modal —————————————————————————————————————————
function showCart() {
    const list = document.getElementById('cart-items-list');
    if (state.cart.length === 0) {
        list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128722;</div><p>Cart is empty</p></div>';
    } else {
        list.innerHTML = state.cart.map(c => `
            <div class="list-item">
                <div class="list-item-content">
                    <div class="list-item-title">${c.name}</div>
                    <div class="list-item-subtitle">&#8377;${c.price} x ${c.qty}</div>
                </div>
                <div class="list-item-right">
                    <div class="list-item-amount">&#8377;${(c.price * c.qty).toLocaleString()}</div>
                    <div class="stepper">
                        <div class="stepper-btn btn-sm" onclick="changeCartQty(${c.id}, -1)">&minus;</div>
                        <div class="stepper-value">${c.qty}</div>
                        <div class="stepper-btn btn-sm" onclick="changeCartQty(${c.id}, 1)">+</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Populate customer dropdown
    const select = document.getElementById('cart-customer');
    select.innerHTML = '<option value="">Walk-in Customer</option>' +
        state.customers.map(c => `<option value="${c.id}">${c.name} (${c.phone})</option>`).join('');

    updateCartSummary();
    openModal('modal-cart');
}

function changeCartQty(id, delta) {
    const inCart = state.cart.find(c => c.id === id);
    if (!inCart) return;
    inCart.qty += delta;
    if (inCart.qty <= 0) {
        state.cart = state.cart.filter(c => c.id !== id);
    }
    updateCart();
    showCart();
    saveState();
}

function updateCartSummary() {
    const subtotal = state.cart.reduce((s, c) => s + c.price * c.qty, 0);
    const discount = parseFloat(document.getElementById('cart-discount').value) || 0;
    const taxPercent = parseFloat(document.getElementById('cart-tax').value) || 0;
    const afterDiscount = subtotal - discount;
    const tax = afterDiscount * (taxPercent / 100);
    const grandTotal = afterDiscount + tax;

    document.getElementById('cart-subtotal').textContent = '\u20B9' + subtotal.toLocaleString();
    document.getElementById('cart-discount-display').textContent = '-\u20B9' + discount.toLocaleString();
    document.getElementById('cart-tax-display').textContent = '\u20B9' + tax.toFixed(0).toLocaleString();
    document.getElementById('cart-grand-total').textContent = '\u20B9' + Math.round(grandTotal).toLocaleString();
}

// ——— Save Bill ——————————————————————————————————————————
function saveBill() {
    if (state.cart.length === 0) {
        showToast('Cart is empty!');
        return;
    }

    const subtotal = state.cart.reduce((s, c) => s + c.price * c.qty, 0);
    const discount = parseFloat(document.getElementById('cart-discount').value) || 0;
    const taxPercent = parseFloat(document.getElementById('cart-tax').value) || 0;
    const afterDiscount = subtotal - discount;
    const tax = afterDiscount * (taxPercent / 100);
    const grandTotal = Math.round(afterDiscount + tax);

    const customerId = document.getElementById('cart-customer').value;
    const customer = customerId
        ? state.customers.find(c => c.id === parseInt(customerId))?.name || 'Walk-in Customer'
        : 'Walk-in Customer';

    state.billCounter++;
    const billId = 'B' + String(state.billCounter).padStart(3, '0');

    // Deduct stock
    state.cart.forEach(c => {
        const item = state.items.find(i => i.id === c.id);
        if (item) item.stock = Math.max(0, item.stock - c.qty);
    });

    const bill = {
        id: billId,
        customer: customer,
        items: state.cart.map(c => ({ name: c.name, qty: c.qty, price: c.price })),
        total: grandTotal,
        date: new Date().toISOString(),
        status: 'paid',
        discount: discount,
        taxPercent: taxPercent,
        subtotal: subtotal
    };

    state.bills.push(bill);
    state.cart = [];
    updateCart();
    closeModal('modal-cart');
    saveState();
    navigateTo('dashboard');
    showToast('Bill ' + billId + ' saved!');
}

// ——— Invoice Preview ————————————————————————————————————
function generateInvoice() {
    if (state.cart.length === 0) {
        showToast('Cart is empty!');
        return;
    }

    const subtotal = state.cart.reduce((s, c) => s + c.price * c.qty, 0);
    const discount = parseFloat(document.getElementById('cart-discount').value) || 0;
    const taxPercent = parseFloat(document.getElementById('cart-tax').value) || 0;
    const afterDiscount = subtotal - discount;
    const tax = afterDiscount * (taxPercent / 100);
    const grandTotal = Math.round(afterDiscount + tax);

    const customerId = document.getElementById('cart-customer').value;
    const customer = customerId
        ? state.customers.find(c => c.id === parseInt(customerId))?.name || 'Walk-in Customer'
        : 'Walk-in Customer';

    state.billCounter++;
    const billId = 'B' + String(state.billCounter).padStart(3, '0');
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN');
    const timeStr = now.toLocaleTimeString('en-IN');

    const preview = document.getElementById('invoice-preview');
    preview.innerHTML = `
        <h2>${state.settings.shopName}</h2>
        <div class="preview-grid">
            <div>
                <strong>${state.settings.address}</strong><br>
                Phone: ${state.settings.phone}<br>
                ${state.settings.gst ? 'GST: ' + state.settings.gst : ''}
            </div>
            <div style="text-align:right;">
                <strong>Bill: ${billId}</strong><br>
                Date: ${dateStr}<br>
                Time: ${timeStr}<br>
                Customer: ${customer}
            </div>
        </div>
        <table class="preview-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th class="text-right">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${state.cart.map((c, i) => `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${c.name}</td>
                        <td>${c.qty}</td>
                        <td>${c.price}</td>
                        <td class="text-right">${(c.price * c.qty).toLocaleString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div style="text-align:right;">
            <div>Subtotal: \u20B9${subtotal.toLocaleString()}</div>
            ${discount > 0 ? `<div>Discount: -\u20B9${discount.toLocaleString()}</div>` : ''}
            ${tax > 0 ? `<div>Tax (${taxPercent}%): \u20B9${tax.toFixed(0).toLocaleString()}</div>` : ''}
            <div style="font-weight:700; font-size:14px; margin-top:8px;">Total: \u20B9${grandTotal.toLocaleString()}</div>
        </div>
        <div style="text-align:center; margin-top:20px; font-size:10px;">
            Thank you for your purchase!
        </div>
    `;

    openModal('modal-invoice');
}

function printInvoice() {
    const content = document.getElementById('invoice-preview').innerHTML;
    const win = window.open('', '_blank', 'width=400,height=600');
    win.document.write(`
        <html><head><title>Invoice</title>
        <style>
            body { font-family: 'Courier New', monospace; font-size: 12px; padding: 10px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #333; padding: 4px 6px; text-align: left; }
            th { background: #f5f5f5; }
            .text-right { text-align: right; }
        </style></head>
        <body>${content}</body></html>
    `);
    win.document.close();
    win.print();
}

function shareInvoice() {
    const text = document.getElementById('invoice-preview').innerText;
    if (navigator.share) {
        navigator.share({ title: 'Invoice', text: text });
    } else {
        navigator.clipboard.writeText(text);
        showToast('Invoice copied to clipboard!');
    }
}

// ——— Items Management ————————————————————————————————
function renderItemsManagement() {
    const list = document.getElementById('items-management-list');
    if (state.items.length === 0) {
        list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128230;</div><p>No items yet. Add some!</p></div>';
        return;
    }
    list.innerHTML = state.items.map(item => `
        <div class="list-item">
            <div class="list-item-content">
                <div class="list-item-title">${item.name}</div>
                <div class="list-item-subtitle">&#8377;${item.price} &middot; ${item.category} &middot; Stock: ${item.stock}</div>
            </div>
            <div class="list-item-right">
                <button class="btn btn-danger btn-sm" onclick="deleteItem(${item.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function showAddItemModal() {
    document.getElementById('new-item-name').value = '';
    document.getElementById('new-item-price').value = '';
    document.getElementById('new-item-stock').value = '';
    openModal('modal-add-item');
}

function addItem() {
    const name = document.getElementById('new-item-name').value.trim();
    const price = parseFloat(document.getElementById('new-item-price').value);
    const stock = parseInt(document.getElementById('new-item-stock').value) || 0;
    const category = document.getElementById('new-item-category').value;

    if (!name || isNaN(price) || price <= 0) {
        showToast('Please enter a valid name and price');
        return;
    }

    const maxId = state.items.reduce((max, i) => Math.max(max, i.id), 0);
    state.items.push({ id: maxId + 1, name, category, price, stock });
    closeModal('modal-add-item');
    saveState();
    renderItemsManagement();
    showToast('Item added!');
}

function deleteItem(id) {
    if (confirm('Delete this item?')) {
        state.items = state.items.filter(i => i.id !== id);
        saveState();
        renderItemsManagement();
        showToast('Item deleted');
    }
}

// ——— Customers —————————————————————————————————————————
function renderCustomers() {
    const list = document.getElementById('customers-list');
    if (state.customers.length === 0) {
        list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128101;</div><p>No customers yet</p></div>';
        return;
    }
    list.innerHTML = state.customers.map(c => `
        <div class="list-item">
            <div class="list-item-content">
                <div class="list-item-title">${c.name}</div>
                <div class="list-item-subtitle">${c.phone}</div>
            </div>
            <div class="list-item-right">
                <button class="btn btn-danger btn-sm" onclick="deleteCustomer(${c.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function searchCustomers(query) {
    const q = query.toLowerCase();
    const filtered = state.customers.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q));
    const list = document.getElementById('customers-list');
    if (filtered.length === 0) {
        list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128269;</div><p>No customers found</p></div>';
        return;
    }
    list.innerHTML = filtered.map(c => `
        <div class="list-item">
            <div class="list-item-content">
                <div class="list-item-title">${c.name}</div>
                <div class="list-item-subtitle">${c.phone}</div>
            </div>
            <div class="list-item-right">
                <button class="btn btn-danger btn-sm" onclick="deleteCustomer(${c.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function showAddCustomerModal() {
    document.getElementById('new-customer-name').value = '';
    document.getElementById('new-customer-phone').value = '';
    openModal('modal-add-customer');
}

function addCustomer() {
    const name = document.getElementById('new-customer-name').value.trim();
    const phone = document.getElementById('new-customer-phone').value.trim();

    if (!name) {
        showToast('Please enter a customer name');
        return;
    }

    const maxId = state.customers.reduce((max, c) => Math.max(max, c.id), 0);
    state.customers.push({ id: maxId + 1, name, phone });
    closeModal('modal-add-customer');
    saveState();
    renderCustomers();
    showToast('Customer added!');
}

function deleteCustomer(id) {
    if (confirm('Delete this customer?')) {
        state.customers = state.customers.filter(c => c.id !== id);
        saveState();
        renderCustomers();
        showToast('Customer deleted');
    }
}

// ——— Bills List —————————————————————————————————————————
function renderBills(filter = 'all') {
    const bills = filter === 'all' ? state.bills : state.bills.filter(b => b.status === filter);
    const list = document.getElementById('bills-list');

    if (bills.length === 0) {
        list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128196;</div><p>No bills found</p></div>';
        return;
    }

    list.innerHTML = bills.slice().reverse().map(b => `
        <div class="list-item" onclick="showBillDetail('${b.id}')">
            <div class="list-item-content">
                <div class="list-item-title">${b.id}</div>
                <div class="list-item-subtitle">${b.customer} &middot; ${formatDate(b.date)} &middot; ${b.items.length} items</div>
            </div>
            <div class="list-item-right">
                <div class="list-item-amount">&#8377;${b.total}</div>
                <span class="badge badge-${b.status}">${b.status}</span>
            </div>
        </div>
    `).join('');
}

function filterBills(status, el) {
    document.querySelectorAll('#screen-bills .tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    renderBills(status);
}

function showBillDetail(billId) {
    const bill = state.bills.find(b => b.id === billId);
    if (!bill) return;

    document.getElementById('bill-detail-title').textContent = bill.id;
    document.getElementById('bill-detail-content').innerHTML = `
        <div style="margin-bottom:12px;">
            <div><strong>Customer:</strong> ${bill.customer}</div>
            <div><strong>Date:</strong> ${formatDate(bill.date)}</div>
            <div><strong>Status:</strong> <span class="badge badge-${bill.status}">${bill.status}</span></div>
        </div>
        <table class="preview-table">
            <thead><tr><th>Item</th><th>Qty</th><th>Rate</th><th class="text-right">Amount</th></tr></thead>
            <tbody>
                ${bill.items.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.qty}</td>
                        <td>${item.price}</td>
                        <td class="text-right">${(item.price * item.qty).toLocaleString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div style="text-align:right; margin-top:12px; font-size:18px; font-weight:700;">
            Total: &#8377;${bill.total}
        </div>
    `;

    const paidBtn = document.getElementById('bill-detail-mark-paid-btn');
    if (bill.status === 'paid') {
        paidBtn.style.display = 'none';
    } else {
        paidBtn.style.display = 'block';
        paidBtn.onclick = () => {
            bill.status = 'paid';
            saveState();
            closeModal('modal-bill-detail');
            renderScreen(currentActiveScreen());
            showToast('Bill marked as paid!');
        };
    }

    document.getElementById('bill-detail-print-btn').onclick = () => {
        printBillDetail(bill);
    };

    openModal('modal-bill-detail');
}

function printBillDetail(bill) {
    const content = `
        <h2 style="text-align:center;">${state.settings.shopName}</h2>
        <div style="text-align:center; margin-bottom:12px;">${state.settings.address}<br>Phone: ${state.settings.phone}</div>
        <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
            <div><strong>${bill.id}</strong><br>${formatDate(bill.date)}</div>
            <div style="text-align:right;">Customer: ${bill.customer}<br>Status: ${bill.status}</div>
        </div>
        <table class="preview-table" style="width:100%; border-collapse:collapse;">
            <thead><tr><th style="border:1px solid #333; padding:4px;">Item</th><th style="border:1px solid #333; padding:4px;">Qty</th><th style="border:1px solid #333; padding:4px;">Rate</th><th style="border:1px solid #333; padding:4px; text-align:right;">Amount</th></tr></thead>
            <tbody>
                ${bill.items.map(item => `
                    <tr>
                        <td style="border:1px solid #333; padding:4px;">${item.name}</td>
                        <td style="border:1px solid #333; padding:4px;">${item.qty}</td>
                        <td style="border:1px solid #333; padding:4px;">${item.price}</td>
                        <td style="border:1px solid #333; padding:4px; text-align:right;">${(item.price * item.qty).toLocaleString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div style="text-align:right; margin-top:12px; font-weight:700;">Total: \u20B9${bill.total}</div>
    `;
    const win = window.open('', '_blank', 'width=400,height=600');
    win.document.write(`<html><head><title>Bill ${bill.id}</title><style>body{font-family:'Courier New',monospace;font-size:12px;padding:10px;}</style></head><body>${content}</body></html>`);
    win.document.close();
    win.print();
}

function currentActiveScreen() {
    const active = document.querySelector('.screen.active');
    return active ? active.id.replace('screen-', '') : 'dashboard';
}

// ——— Reports ———————————————————————————————————————————
function renderReports() {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayBills = state.bills.filter(b => b.date.split('T')[0] === todayStr && b.status === 'paid');
    const todaySales = todayBills.reduce((s, b) => s + b.total, 0);

    const now = new Date();
    const monthStr = now.toISOString().slice(0, 7);
    const monthBills = state.bills.filter(b => b.date.slice(0, 7) === monthStr && b.status === 'paid');
    const monthSales = monthBills.reduce((s, b) => s + b.total, 0);

    const pending = state.bills.filter(b => b.status === 'due' || b.status === 'overdue');
    const pendingAmount = pending.reduce((s, b) => s + b.total, 0);

    document.getElementById('report-today').textContent = '\u20B9' + todaySales.toLocaleString();
    document.getElementById('report-month').textContent = '\u20B9' + monthSales.toLocaleString();
    document.getElementById('report-count').textContent = state.bills.length;
    document.getElementById('report-pending').textContent = '\u20B9' + pendingAmount.toLocaleString();

    // Weekly chart
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const ds = d.toISOString().split('T')[0];
        const daySales = state.bills.filter(b => b.date.split('T')[0] === ds && b.status === 'paid').reduce((s, b) => s + b.total, 0);
        weekData.push({ day: days[d.getDay()], sales: daySales });
    }

    const maxSales = Math.max(...weekData.map(d => d.sales), 1);
    document.getElementById('weekly-chart').innerHTML = weekData.map(d => `
        <div class="bar" style="height:${Math.max(20, (d.sales / maxSales) * 120)}px;">
            <div class="bar-label">${d.day}</div>
        </div>
    `).join('');
}

// ——— Settings ——————————————————————————————————————————
function renderSettings() {
    document.getElementById('setting-shop-name').value = state.settings.shopName;
    document.getElementById('setting-phone').value = state.settings.phone;
    document.getElementById('setting-address').value = state.settings.address;
    document.getElementById('setting-gst').value = state.settings.gst;
}

function saveSetting(key, value) {
    state.settings[key] = value;
    saveState();
}

function toggleSetting(el, key) {
    el.classList.toggle('active');
    state.settings[key] = el.classList.contains('active');
    saveState();
}

function exportData() {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dukaan-bill-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported!');
}

function clearAllData() {
    if (confirm('Are you sure you want to clear ALL data? This cannot be undone.')) {
        localStorage.removeItem('dukaanBill');
        seedData();
        navigateTo('dashboard');
        showToast('All data cleared');
    }
}

// ——— Modals ————————————————————————————————————————————
function openModal(id) {
    document.getElementById(id).classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// ——— Toast —————————————————————————————————————————————
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.style.display = 'block';
    toast.style.opacity = '1';
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => { toast.style.display = 'none'; }, 300);
    }, 2000);
}

// ——— Helpers ———————————————————————————————————————————
function formatDate(isoStr) {
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function showSettings() {
    navigateTo('settings');
}

function showNotifications() {
    showToast('No new notifications');
}

// ——— Cart discount/tax listeners ———————————————————————
document.getElementById('cart-discount').addEventListener('input', updateCartSummary);
document.getElementById('cart-tax').addEventListener('input', updateCartSummary);

// ——— Init ——————————————————————————————————————————————
loadState();
navigateTo('dashboard');

// ——— Close modals on overlay click ————————————————————
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
        }
    });
});
