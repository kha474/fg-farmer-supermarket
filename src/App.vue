<script setup>
import { ref, computed, watch } from 'vue'

const STORAGE = {
  products: 'fg_products',
  sales: 'fg_sales',
  purchases: 'fg_purchases',
  customers: 'fg_customers',
  suppliers: 'fg_suppliers',
  expenses: 'fg_expenses',
  business: 'fg_business',
  phone: 'fg_phone',
  lowStock: 'fg_low_stock'
}

const load = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

const defaultProducts = [
  { id: 1, name: 'Maize Flour 1kg', category: 'Flour', price: 100, stock: 50, image: 'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?w=500' },
  { id: 2, name: 'Maize Flour 2kg', category: 'Flour', price: 180, stock: 40, image: 'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?w=500' },
  { id: 3, name: 'Wheat Flour 1kg', category: 'Flour', price: 100, stock: 35, image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500' },
  { id: 4, name: 'Wheat Flour 2kg', category: 'Flour', price: 190, stock: 30, image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500' },
  { id: 5, name: 'Sugar 1kg', category: 'Groceries', price: 170, stock: 60, image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=500' },
  { id: 6, name: 'Sugar 2kg', category: 'Groceries', price: 330, stock: 30, image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=500' },
  { id: 7, name: 'Rice 1kg', category: 'Groceries', price: 180, stock: 45, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500' },
  { id: 8, name: 'Rice 2kg', category: 'Groceries', price: 350, stock: 25, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500' },
  { id: 9, name: 'Pishori Rice 1kg', category: 'Groceries', price: 220, stock: 20, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500' },
  { id: 10, name: 'Green Grams 1kg', category: 'Groceries', price: 180, stock: 30, image: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=500' },
  { id: 11, name: 'Beans 1kg', category: 'Groceries', price: 180, stock: 40, image: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=500' },
  { id: 12, name: 'Ndengu 1kg', category: 'Groceries', price: 200, stock: 25, image: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=500' },
  { id: 13, name: 'Lentils 1kg', category: 'Groceries', price: 220, stock: 20, image: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=500' },
  { id: 14, name: 'Salt 1kg', category: 'Groceries', price: 50, stock: 50, image: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442d?w=500' },
  { id: 15, name: 'Cooking Oil 1L', category: 'Cooking', price: 300, stock: 35, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500' },
  { id: 16, name: 'Cooking Oil 2L', category: 'Cooking', price: 580, stock: 20, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500' },
  { id: 17, name: 'Margarine 500g', category: 'Cooking', price: 180, stock: 25, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500' },
  { id: 18, name: 'Tea Leaves 250g', category: 'Beverages', price: 150, stock: 35, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500' },
  { id: 19, name: 'Coffee 100g', category: 'Beverages', price: 250, stock: 20, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500' },
  { id: 20, name: 'Spaghetti 400g', category: 'Groceries', price: 100, stock: 40, image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=500' },
  { id: 21, name: 'Coca-Cola 300ml', category: 'Drinks', price: 50, stock: 60, image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500' },
  { id: 22, name: 'Water 500ml', category: 'Drinks', price: 40, stock: 60, image: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?w=500' },
  { id: 23, name: 'Milk 500ml', category: 'Dairy', price: 65, stock: 40, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500' },
  { id: 24, name: 'Bread', category: 'Bakery', price: 70, stock: 30, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500' },
  { id: 25, name: 'Eggs Tray', category: 'Food', price: 450, stock: 15, image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500' },
  { id: 26, name: 'Bar Soap', category: 'Household', price: 100, stock: 30, image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=500' }
]

const products = ref(load(STORAGE.products, defaultProducts))
const sales = ref(load(STORAGE.sales, []))
const purchases = ref(load(STORAGE.purchases, []))
const customers = ref(load(STORAGE.customers, []))
const suppliers = ref(load(STORAGE.suppliers, []))
const expenses = ref(load(STORAGE.expenses, []))

const businessName = ref(localStorage.getItem(STORAGE.business) || 'FG Farmer Supermarket')
const businessPhone = ref(localStorage.getItem(STORAGE.phone) || '')
const lowStockLimit = ref(Number(localStorage.getItem(STORAGE.lowStock) || 5))

// ✅ NEW: Load Paystack key from Vite environment variables
const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || ''

watch(products, v => localStorage.setItem(STORAGE.products, JSON.stringify(v)), { deep: true })
watch(sales, v => localStorage.setItem(STORAGE.sales, JSON.stringify(v)), { deep: true })
watch(purchases, v => localStorage.setItem(STORAGE.purchases, JSON.stringify(v)), { deep: true })
watch(customers, v => localStorage.setItem(STORAGE.customers, JSON.stringify(v)), { deep: true })
watch(suppliers, v => localStorage.setItem(STORAGE.suppliers, JSON.stringify(v)), { deep: true })
watch(expenses, v => localStorage.setItem(STORAGE.expenses, JSON.stringify(v)), { deep: true })
watch(businessName, v => localStorage.setItem(STORAGE.business, v))
watch(businessPhone, v => localStorage.setItem(STORAGE.phone, v))
watch(lowStockLimit, v => localStorage.setItem(STORAGE.lowStock, String(v)))

const activePage = ref('pos')
const search = ref('')
const selectedCategory = ref('All')
const cart = ref([])
const paymentMethod = ref('Cash')
const customerName = ref('')
const customerPhone = ref('')
const cashReceived = ref(0)
const receipt = ref(null)
const notification = ref('')
const showProductForm = ref(false)
const editingProductId = ref(null)
const isProcessingPayment = ref(false)

const productForm = ref({ name: '', category: 'Groceries', price: 0, stock: 0, image: '' })
const purchaseForm = ref({ productId: '', quantity: 1, cost: 0, supplier: '' })
const customerForm = ref({ name: '', phone: '' })
const supplierForm = ref({ name: '', phone: '' })
const expenseForm = ref({ title: '', amount: 0, date: new Date().toISOString().slice(0, 10) })

const categories = computed(() => ['All', ...new Set(products.value.map(p => p.category))])

const filteredProducts = computed(() => products.value.filter(product => {
  const matchesSearch = product.name.toLowerCase().includes(search.value.toLowerCase())
  const matchesCategory = selectedCategory.value === 'All' || product.category === selectedCategory.value
  return matchesSearch && matchesCategory
}))

const cartTotal = computed(() => cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0))
const cartCount = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0))
const changeDue = computed(() => Math.max(0, Number(cashReceived.value) - cartTotal.value))

const todaySales = computed(() => sales.value.filter(s => new Date(s.date).toDateString() === new Date().toDateString()))
const todayRevenue = computed(() => todaySales.value.reduce((sum, s) => sum + s.total, 0))
const totalRevenue = computed(() => sales.value.reduce((sum, s) => sum + s.total, 0))
const totalExpenses = computed(() => expenses.value.reduce((sum, e) => sum + Number(e.amount), 0))
const totalPurchasesValue = computed(() => purchases.value.reduce((sum, p) => sum + Number(p.total), 0))
const lowStockProducts = computed(() => products.value.filter(p => Number(p.stock) <= Number(lowStockLimit.value)))

function notify(message) {
  notification.value = message
  setTimeout(() => notification.value = '', 4000)
}

function getProductImage(product) {
  return product.image || makeFallbackImage(product.name)
}

function makeFallbackImage(name) {
  const safeName = String(name || 'Product').replace(/[<>&"]/g, '')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="400"><rect width="100%" height="100%" fill="#e8f5e9"/><text x="50%" y="43%" text-anchor="middle" font-size="90">🛒</text><text x="50%" y="70%" text-anchor="middle" font-family="Arial" font-size="25" fill="#166534">${safeName}</text><text x="50%" y="83%" text-anchor="middle" font-family="Arial" font-size="18" fill="#4b765a">FG Farmer Supermarket</text></svg>`
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg)
}

function imageError(event) {
  event.target.onerror = null
  event.target.src = makeFallbackImage(event.target.alt || 'Product')
}

function addToCart(product) {
  if (isProcessingPayment.value) return
  if (product.stock <= 0) return notify('This product is out of stock.')
  const existing = cart.value.find(item => item.id === product.id)
  if (existing) {
    if (existing.quantity >= product.stock) return notify('Not enough stock available.')
    existing.quantity++
  } else {
    cart.value.push({ id: product.id, name: product.name, price: Number(product.price), quantity: 1 })
  }
}

function increaseQuantity(item) {
  if (isProcessingPayment.value) return
  const product = products.value.find(p => p.id === item.id)
  if (!product || item.quantity >= product.stock) return notify('Not enough stock available.')
  item.quantity++
}

function decreaseQuantity(item) {
  if (isProcessingPayment.value) return
  if (item.quantity > 1) item.quantity--
  else removeFromCart(item)
}

function removeFromCart(item) {
  if (isProcessingPayment.value) return
  cart.value = cart.value.filter(p => p.id !== item.id)
}

function clearCart() {
  if (isProcessingPayment.value) return
  cart.value = []
  cashReceived.value = 0
}

function validateStock(items) {
  for (const item of items) {
    const product = products.value.find(p => p.id === item.id)
    if (!product || Number(product.stock) < Number(item.quantity)) {
      notify(`Insufficient stock for ${item.name}.`)
      return false
    }
  }
  return true
}

function recordSale(method, items = cart.value) {
  if (!items.length) {
    notify('Your cart is empty.')
    return false
  }

  if (!validateStock(items)) return false

  const sale = {
    id: Date.now(),
    receiptNo: 'FG-' + Date.now(),
    date: new Date().toISOString(),
    items: JSON.parse(JSON.stringify(items)),
    total: items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0),
    paymentMethod: method,
    customer: customerName.value || 'Walk-in Customer',
    phone: customerPhone.value
  }

  items.forEach(item => {
    const product = products.value.find(p => p.id === item.id)
    product.stock -= item.quantity
  })

  sales.value.unshift(sale)
  receipt.value = sale
  cart.value = []
  cashReceived.value = 0
  customerName.value = ''
  customerPhone.value = ''
  return true
}

function completeCashSale() {
  if (Number(cashReceived.value) < cartTotal.value) {
    notify('Cash received is less than the total.')
    return
  }
  if (recordSale('Cash')) notify('Cash sale completed.')
}

function loadPaystack() {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) return resolve()

    const existing = document.querySelector('#paystack-script')
    if (existing) {
      existing.addEventListener('load', resolve, { once: true })
      existing.addEventListener('error', reject, { once: true })
      return
    }

    const script = document.createElement('script')
    script.id = 'paystack-script'
    script.src = 'https://js.paystack.co/v2/inline.js'
    script.onload = resolve
    script.onerror = reject
    document.body.appendChild(script)
  })
}

async function verifyPaystackPayment(reference, proof, expectedAmount) {
  const response = await fetch('/api/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reference,
      proof,
      expectedAmount
    })
  })

  const result = await response.json()

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Payment verification failed.')
  }

  return result
}

async function payWithPaystack() {
  if (isProcessingPayment.value) return
  if (!cart.value.length) return notify('Your cart is empty.')

  // ✅ NEW: Check if the environment variable is present
  if (!paystackPublicKey || !paystackPublicKey.startsWith('pk_')) {
    notify('Paystack public key is missing. Please add VITE_PAYSTACK_PUBLIC_KEY to Vercel and redeploy.')
    return
  }

  const email = prompt('Enter the customer email address for payment:')
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return notify('A valid email address is required.')
  }

  const itemsForPayment = JSON.parse(JSON.stringify(cart.value))
  const amount = itemsForPayment.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (!validateStock(itemsForPayment)) return

  isProcessingPayment.value = true
  notify('Preparing secure payment...')

  try {
    await loadPaystack()

    const initResponse = await fetch('/api/initialize-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.trim(),
        amount,
        currency: 'KES',
        customerName: customerName.value,
        customerPhone: customerPhone.value
      })
    })

    const initData = await initResponse.json()

    if (!initResponse.ok || !initData.success) {
      throw new Error(initData.message || 'Could not initialize payment.')
    }

    const popup = new window.PaystackPop()

    popup.resumeTransaction(initData.access_code, {
      onSuccess: async (transaction) => {
        try {
          notify('Payment received. Verifying with Paystack...')

          const verified = await verifyPaystackPayment(
            transaction.reference || initData.reference,
            initData.proof,
            amount
          )

          if (verified.amount !== amount) {
            throw new Error('The verified payment amount does not match the sale.')
          }

          if (!validateStock(itemsForPayment)) {
            throw new Error('Stock changed during payment. Please check inventory.')
          }

          const actualChannel = verified.channel || paymentMethod.value
          const method = `Paystack - ${actualChannel}`

          if (recordSale(method, itemsForPayment)) {
            notify('Payment verified. Sale completed successfully.')
          }
        } catch (error) {
          console.error(error)
          notify(error.message || 'Payment verification failed. Do not release goods.')
        } finally {
          isProcessingPayment.value = false
        }
      },
      onCancel: () => {
        isProcessingPayment.value = false
        notify('Payment was cancelled. No sale was recorded.')
      },
      onError: (error) => {
        isProcessingPayment.value = false
        console.error(error)
        notify(error?.message || 'Paystack could not open the payment window.')
      }
    })
  } catch (error) {
    console.error(error)
    isProcessingPayment.value = false
    notify(error.message || 'Unable to connect to Paystack. Check your connection.')
  }
}

function handleCheckout() {
  if (paymentMethod.value === 'Cash') completeCashSale()
  else payWithPaystack()
}

function openAddProduct() {
  editingProductId.value = null
  productForm.value = { name: '', category: 'Groceries', price: 0, stock: 0, image: '' }
  showProductForm.value = true
}

function editProduct(product) {
  editingProductId.value = product.id
  productForm.value = { ...product }
  showProductForm.value = true
}

function saveProduct() {
  const form = productForm.value
  if (!form.name.trim() || Number(form.price) <= 0 || Number(form.stock) < 0) {
    return notify('Enter valid product details.')
  }

  if (editingProductId.value) {
    const index = products.value.findIndex(p => p.id === editingProductId.value)
    if (index !== -1) {
      products.value[index] = {
        ...form,
        id: editingProductId.value,
        price: Number(form.price),
        stock: Number(form.stock)
      }
    }
    notify('Product updated.')
  } else {
    products.value.push({
      ...form,
      id: Date.now(),
      price: Number(form.price),
      stock: Number(form.stock),
      image: form.image || ''
    })
    notify('Product added.')
  }
  showProductForm.value = false
}

function deleteProduct(id) {
  if (!confirm('Delete this product?')) return
  products.value = products.value.filter(p => p.id !== id)
  notify('Product deleted.')
}

function addPurchase() {
  const form = purchaseForm.value
  const product = products.value.find(p => p.id === Number(form.productId))

  if (!product || Number(form.quantity) <= 0 || Number(form.cost) < 0) {
    return notify('Enter valid purchase details.')
  }

  const quantity = Number(form.quantity)
  const total = quantity * Number(form.cost)
  product.stock += quantity

  purchases.value.unshift({
    id: Date.now(),
    product: product.name,
    productId: product.id,
    quantity,
    cost: Number(form.cost),
    total,
    supplier: form.supplier || 'Not specified',
    date: new Date().toISOString()
  })

  purchaseForm.value = { productId: '', quantity: 1, cost: 0, supplier: '' }
  notify('Stock purchase recorded.')
}

function addCustomer() {
  if (!customerForm.value.name.trim()) return notify('Enter customer name.')
  customers.value.push({ id: Date.now(), ...customerForm.value })
  customerForm.value = { name: '', phone: '' }
  notify('Customer added.')
}

function deleteCustomer(id) {
  customers.value = customers.value.filter(c => c.id !== id)
}

function addSupplier() {
  if (!supplierForm.value.name.trim()) return notify('Enter supplier name.')
  suppliers.value.push({ id: Date.now(), ...supplierForm.value })
  supplierForm.value = { name: '', phone: '' }
  notify('Supplier added.')
}

function deleteSupplier(id) {
  suppliers.value = suppliers.value.filter(s => s.id !== id)
}

function addExpense() {
  const form = expenseForm.value
  if (!form.title.trim() || Number(form.amount) <= 0) return notify('Enter a valid expense.')

  expenses.value.unshift({
    id: Date.now(),
    title: form.title,
    amount: Number(form.amount),
    date: form.date
  })

  expenseForm.value = {
    title: '',
    amount: 0,
    date: new Date().toISOString().slice(0, 10)
  }
  notify('Expense recorded.')
}

function deleteExpense(id) {
  expenses.value = expenses.value.filter(e => e.id !== id)
}

function printReceipt() {
  window.print()
}

function closeReceipt() {
  receipt.value = null
}

function resetData() {
  if (!confirm('This will delete all saved sales, purchases, products and records. Continue?')) return

  Object.values(STORAGE).forEach(key => localStorage.removeItem(key))
  products.value = defaultProducts.map(p => ({ ...p }))
  sales.value = []
  purchases.value = []
  customers.value = []
  suppliers.value = []
  expenses.value = []
  businessName.value = 'FG Farmer Supermarket'
  businessPhone.value = ''
  lowStockLimit.value = 5
  notify('System data has been reset.')
}

function formatMoney(amount) {
  return 'KSh ' + Number(amount || 0).toLocaleString('en-KE')
}

function formatDate(date) {
  return new Date(date).toLocaleString('en-KE')
}
</script>

<template>
  <div class="app">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-icon">FG</div>
        <div><h2>FG Farmer</h2><small>Supermarket POS</small></div>
      </div>

      <nav>
        <button :class="{ active: activePage === 'pos' }" @click="activePage = 'pos'">🛒 Point of Sale</button>
        <button :class="{ active: activePage === 'sales' }" @click="activePage = 'sales'">📊 Sales</button>
        <button :class="{ active: activePage === 'purchases' }" @click="activePage = 'purchases'">📦 Purchases</button>
        <button :class="{ active: activePage === 'stock' }" @click="activePage = 'stock'">🏷️ Stock Management</button>
        <button :class="{ active: activePage === 'customers' }" @click="activePage = 'customers'">👥 Customers</button>
        <button :class="{ active: activePage === 'suppliers' }" @click="activePage = 'suppliers'">🚚 Suppliers</button>
        <button :class="{ active: activePage === 'expenses' }" @click="activePage = 'expenses'">💰 Expenses</button>
        <button :class="{ active: activePage === 'reports' }" @click="activePage = 'reports'">📈 Reports</button>
        <button :class="{ active: activePage === 'settings' }" @click="activePage = 'settings'">⚙️ Settings</button>
      </nav>

      <div class="sidebar-bottom"><span class="status-dot"></span>System Online</div>
    </aside>

    <main class="main">
      <header class="topbar">
        <div><h1>{{ businessName }}</h1><p>Welcome to your supermarket management system</p></div>
        <div class="top-date">{{ new Date().toLocaleDateString('en-KE', { dateStyle: 'medium' }) }}</div>
      </header>

      <div v-if="notification" class="notification">{{ notification }}</div>

      <section v-if="activePage === 'pos'">
        <div class="stats">
          <div class="stat-card"><span>Today's Sales</span><strong>{{ formatMoney(todayRevenue) }}</strong></div>
          <div class="stat-card"><span>Transactions Today</span><strong>{{ todaySales.length }}</strong></div>
          <div class="stat-card"><span>Products</span><strong>{{ products.length }}</strong></div>
          <div class="stat-card warning"><span>Low Stock Items</span><strong>{{ lowStockProducts.length }}</strong></div>
        </div>

        <div class="pos-layout">
          <div class="products-panel">
            <div class="section-heading">
              <div><h2>Products</h2><p>Select products to add them to the cart</p></div>
              <input v-model="search" class="search" placeholder="Search products..." />
            </div>

            <div class="categories">
              <button v-for="category in categories" :key="category" :class="{ selected: selectedCategory === category }" @click="selectedCategory = category">{{ category }}</button>
            </div>

            <div class="product-grid">
              <button v-for="product in filteredProducts" :key="product.id" class="product-card" :disabled="product.stock <= 0 || isProcessingPayment" @click="addToCart(product)">
                <img :src="getProductImage(product)" @error="imageError" :alt="product.name" />
                <div class="product-info">
                  <strong>{{ product.name }}</strong>
                  <span>{{ formatMoney(product.price) }}</span>
                  <small :class="{ 'out-stock': product.stock <= lowStockLimit }">{{ product.stock }} in stock</small>
                </div>
              </button>
            </div>
          </div>

          <div class="cart-panel">
            <div class="cart-heading">
              <div><h2>Current Sale</h2><p>{{ cartCount }} items</p></div>
              <button class="clear-btn" :disabled="isProcessingPayment" @click="clearCart">Clear</button>
            </div>

            <div class="customer-fields">
              <input v-model="customerName" :disabled="isProcessingPayment" placeholder="Customer name (optional)" />
              <input v-model="customerPhone" :disabled="isProcessingPayment" placeholder="Customer phone (optional)" />
            </div>

            <div class="cart-items">
              <div v-if="!cart.length" class="empty">
                <div>🛒</div><p>Your cart is empty</p><small>Select products to get started</small>
              </div>

              <div v-for="item in cart" :key="item.id" class="cart-item">
                <div class="cart-item-details"><strong>{{ item.name }}</strong><small>{{ formatMoney(item.price) }} each</small></div>
                <div class="quantity">
                  <button :disabled="isProcessingPayment" @click="decreaseQuantity(item)">−</button>
                  <span>{{ item.quantity }}</span>
                  <button :disabled="isProcessingPayment" @click="increaseQuantity(item)">+</button>
                </div>
                <strong>{{ formatMoney(item.price * item.quantity) }}</strong>
              </div>
            </div>

            <div class="cart-summary">
              <div class="summary-line"><span>Subtotal</span><strong>{{ formatMoney(cartTotal) }}</strong></div>
              <div class="total-line"><span>Total</span><strong>{{ formatMoney(cartTotal) }}</strong></div>

              <label>Payment Method</label>
              <div class="payment-methods">
                <button :class="{ chosen: paymentMethod === 'Cash' }" :disabled="isProcessingPayment" @click="paymentMethod = 'Cash'">💵 Cash</button>
                <button :class="{ chosen: paymentMethod === 'M-Pesa' }" :disabled="isProcessingPayment" @click="paymentMethod = 'M-Pesa'">📱 M-Pesa</button>
                <button :class="{ chosen: paymentMethod === 'Card' }" :disabled="isProcessingPayment" @click="paymentMethod = 'Card'">💳 Card</button>
              </div>

              <div v-if="paymentMethod === 'Cash'" class="cash-field">
                <label>Cash Received (KSh)</label>
                <input v-model.number="cashReceived" type="number" min="0" placeholder="Enter amount received" />
                <div class="change-line"><span>Change</span><strong>{{ formatMoney(changeDue) }}</strong></div>
              </div>

              <button class="checkout-btn" :disabled="!cart.length || isProcessingPayment" @click="handleCheckout">
                {{ isProcessingPayment ? 'Processing payment...' : paymentMethod === 'Cash' ? 'Complete Cash Sale' : 'Pay with ' + paymentMethod }}
              </button>
              <small class="secure-note" v-if="paymentMethod !== 'Cash'">Payment is verified by your server before a sale is recorded. Available payment channels depend on your Paystack account.</small>
            </div>
          </div>
        </div>
      </section>

      <section v-if="activePage === 'sales'">
        <div class="page-heading"><div><h2>Sales Records</h2><p>View all recorded transactions</p></div></div>
        <div class="stats">
          <div class="stat-card"><span>Total Sales</span><strong>{{ sales.length }}</strong></div>
          <div class="stat-card"><span>Total Revenue</span><strong>{{ formatMoney(totalRevenue) }}</strong></div>
        </div>
        <div class="table-card">
          <table>
            <thead><tr><th>Receipt No.</th><th>Date</th><th>Customer</th><th>Payment</th><th>Total</th></tr></thead>
            <tbody>
              <tr v-for="sale in sales" :key="sale.id">
                <td>{{ sale.receiptNo }}</td><td>{{ formatDate(sale.date) }}</td><td>{{ sale.customer }}</td><td><span class="tag">{{ sale.paymentMethod }}</span></td><td class="money">{{ formatMoney(sale.total) }}</td>
              </tr>
              <tr v-if="!sales.length"><td colspan="5" class="empty-cell">No sales recorded yet.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section v-if="activePage === 'purchases'">
        <div class="page-heading"><div><h2>Purchases</h2><p>Record new stock received from suppliers</p></div></div>
        <div class="form-card">
          <h3>Add Stock Purchase</h3>
          <div class="form-grid">
            <label>Product<select v-model="purchaseForm.productId"><option value="">Select product</option><option v-for="product in products" :key="product.id" :value="product.id">{{ product.name }}</option></select></label>
            <label>Quantity<input v-model.number="purchaseForm.quantity" type="number" min="1" /></label>
            <label>Cost per item (KSh)<input v-model.number="purchaseForm.cost" type="number" min="0" /></label>
            <label>Supplier<input v-model="purchaseForm.supplier" placeholder="Supplier name" /></label>
          </div>
          <button class="primary-btn" @click="addPurchase">Record Purchase</button>
        </div>
        <div class="table-card">
          <h3>Purchase History</h3>
          <table>
            <thead><tr><th>Date</th><th>Product</th><th>Quantity</th><th>Supplier</th><th>Total Cost</th></tr></thead>
            <tbody>
              <tr v-for="purchase in purchases" :key="purchase.id"><td>{{ formatDate(purchase.date) }}</td><td>{{ purchase.product }}</td><td>{{ purchase.quantity }}</td><td>{{ purchase.supplier }}</td><td>{{ formatMoney(purchase.total) }}</td></tr>
              <tr v-if="!purchases.length"><td colspan="5" class="empty-cell">No purchases recorded.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section v-if="activePage === 'stock'">
        <div class="page-heading"><div><h2>Stock Management</h2><p>Manage your supermarket products and inventory</p></div><button class="primary-btn" @click="openAddProduct">+ Add Product</button></div>
        <div v-if="showProductForm" class="form-card">
          <h3>{{ editingProductId ? 'Edit Product' : 'Add New Product' }}</h3>
          <div class="form-grid">
            <label>Product Name<input v-model="productForm.name" placeholder="Product name" /></label>
            <label>Category<input v-model="productForm.category" placeholder="Category" /></label>
            <label>Price (KSh)<input v-model.number="productForm.price" type="number" min="0" /></label>
            <label>Stock Quantity<input v-model.number="productForm.stock" type="number" min="0" /></label>
            <label class="full-field">Image URL<input v-model="productForm.image" placeholder="Paste product image URL (optional)" /></label>
          </div>
          <div class="form-actions"><button class="primary-btn" @click="saveProduct">Save Product</button><button class="secondary-btn" @click="showProductForm = false">Cancel</button></div>
        </div>
        <div class="table-card">
          <table>
            <thead><tr><th>Image</th><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td><img class="table-image" :src="getProductImage(product)" @error="imageError" :alt="product.name" /></td>
                <td>{{ product.name }}</td><td>{{ product.category }}</td><td>{{ formatMoney(product.price) }}</td><td>{{ product.stock }}</td>
                <td><span :class="product.stock <= lowStockLimit ? 'tag danger' : 'tag success'">{{ product.stock <= lowStockLimit ? 'Low Stock' : 'Available' }}</span></td>
                <td class="actions"><button @click="editProduct(product)">Edit</button><button class="delete-btn" @click="deleteProduct(product.id)">Delete</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section v-if="activePage === 'customers'">
        <div class="page-heading"><div><h2>Customers</h2><p>Manage your customer list</p></div></div>
        <div class="form-card">
          <h3>Add Customer</h3>
          <div class="form-grid"><label>Customer Name<input v-model="customerForm.name" placeholder="Full name" /></label><label>Phone Number<input v-model="customerForm.phone" placeholder="Phone number" /></label></div>
          <button class="primary-btn" @click="addCustomer">Add Customer</button>
        </div>
        <div class="table-card">
          <table><thead><tr><th>Name</th><th>Phone</th><th>Action</th></tr></thead>
            <tbody><tr v-for="customer in customers" :key="customer.id"><td>{{ customer.name }}</td><td>{{ customer.phone }}</td><td><button class="delete-btn" @click="deleteCustomer(customer.id)">Delete</button></td></tr><tr v-if="!customers.length"><td colspan="3" class="empty-cell">No customers added.</td></tr></tbody>
          </table>
        </div>
      </section>

      <section v-if="activePage === 'suppliers'">
        <div class="page-heading"><div><h2>Suppliers</h2><p>Manage your product suppliers</p></div></div>
        <div class="form-card">
          <h3>Add Supplier</h3>
          <div class="form-grid"><label>Supplier Name<input v-model="supplierForm.name" placeholder="Supplier name" /></label><label>Phone Number<input v-model="supplierForm.phone" placeholder="Phone number" /></label></div>
          <button class="primary-btn" @click="addSupplier">Add Supplier</button>
        </div>
        <div class="table-card">
          <table><thead><tr><th>Name</th><th>Phone</th><th>Action</th></tr></thead>
            <tbody><tr v-for="supplier in suppliers" :key="supplier.id"><td>{{ supplier.name }}</td><td>{{ supplier.phone }}</td><td><button class="delete-btn" @click="deleteSupplier(supplier.id)">Delete</button></td></tr><tr v-if="!suppliers.length"><td colspan="3" class="empty-cell">No suppliers added.</td></tr></tbody>
          </table>
        </div>
      </section>

      <section v-if="activePage === 'expenses'">
        <div class="page-heading"><div><h2>Expenses</h2><p>Track supermarket operating expenses</p></div></div>
        <div class="form-card">
          <h3>Record Expense</h3>
          <div class="form-grid"><label>Expense Description<input v-model="expenseForm.title" placeholder="e.g. Electricity bill" /></label><label>Amount (KSh)<input v-model.number="expenseForm.amount" type="number" min="0" /></label><label>Date<input v-model="expenseForm.date" type="date" /></label></div>
          <button class="primary-btn" @click="addExpense">Save Expense</button>
        </div>
        <div class="stats"><div class="stat-card"><span>Total Expenses</span><strong>{{ formatMoney(totalExpenses) }}</strong></div></div>
        <div class="table-card">
          <table><thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Action</th></tr></thead>
            <tbody><tr v-for="expense in expenses" :key="expense.id"><td>{{ expense.date }}</td><td>{{ expense.title }}</td><td>{{ formatMoney(expense.amount) }}</td><td><button class="delete-btn" @click="deleteExpense(expense.id)">Delete</button></td></tr><tr v-if="!expenses.length"><td colspan="4" class="empty-cell">No expenses recorded.</td></tr></tbody>
          </table>
        </div>
      </section>

      <section v-if="activePage === 'reports'">
        <div class="page-heading"><div><h2>Business Reports</h2><p>Summary of your supermarket performance</p></div></div>
        <div class="stats">
          <div class="stat-card"><span>Total Revenue</span><strong>{{ formatMoney(totalRevenue) }}</strong></div>
          <div class="stat-card"><span>Today's Revenue</span><strong>{{ formatMoney(todayRevenue) }}</strong></div>
          <div class="stat-card"><span>Purchases</span><strong>{{ formatMoney(totalPurchasesValue) }}</strong></div>
          <div class="stat-card warning"><span>Expenses</span><strong>{{ formatMoney(totalExpenses) }}</strong></div>
        </div>
        <div class="stats">
          <div class="stat-card"><span>Estimated Balance</span><strong>{{ formatMoney(totalRevenue - totalExpenses - totalPurchasesValue) }}</strong></div>
          <div class="stat-card"><span>Total Transactions</span><strong>{{ sales.length }}</strong></div>
          <div class="stat-card"><span>Products in Stock</span><strong>{{ products.reduce((sum, p) => sum + Number(p.stock), 0) }}</strong></div>
          <div class="stat-card"><span>Low Stock Products</span><strong>{{ lowStockProducts.length }}</strong></div>
        </div>
        <div class="table-card">
          <h3>Recent Sales</h3>
          <table><thead><tr><th>Receipt</th><th>Date</th><th>Customer</th><th>Payment</th><th>Total</th></tr></thead>
            <tbody><tr v-for="sale in sales.slice(0, 10)" :key="sale.id"><td>{{ sale.receiptNo }}</td><td>{{ formatDate(sale.date) }}</td><td>{{ sale.customer }}</td><td>{{ sale.paymentMethod }}</td><td>{{ formatMoney(sale.total) }}</td></tr><tr v-if="!sales.length"><td colspan="5" class="empty-cell">No sales data available.</td></tr></tbody>
          </table>
        </div>
      </section>

      <section v-if="activePage === 'settings'">
        <div class="page-heading"><div><h2>Settings</h2><p>Configure your supermarket system</p></div></div>
        <div class="form-card settings-card">
          <h3>Business Information</h3>
          <label>Business Name<input v-model="businessName" placeholder="FG Farmer Supermarket" /></label>
          <label>Business Phone Number<input v-model="businessPhone" placeholder="07XXXXXXXX" /></label>
          <label>Low Stock Warning Level<input v-model.number="lowStockLimit" type="number" min="0" /></label>
        </div>
        
        <!-- ✅ NEW: Replaced input with a status message -->
        <div class="form-card settings-card">
          <h3>Paystack Payment Settings</h3>
          <div v-if="paystackPublicKey" style="background: #dcfce7; color: #166534; padding: 12px; border-radius: 8px; font-size: 13px; margin-bottom: 10px;">
            ✅ Paystack Public Key is successfully loaded from environment variables.
          </div>
          <div v-else style="background: #fee2e2; color: #b91c1c; padding: 12px; border-radius: 8px; font-size: 13px; margin-bottom: 10px;">
            ⚠️ Paystack Public Key is missing! Please add <strong>VITE_PAYSTACK_PUBLIC_KEY</strong> to your Vercel settings and redeploy.
          </div>
          <p class="settings-description">Your secret key belongs only in Vercel environment variables. Never paste it into frontend code.</p>
        </div>

        <div class="form-card settings-card">
          <h3>System Information</h3>
          <p>System: FG Farmer Supermarket POS</p><p>Currency: Kenyan Shillings (KSh)</p><p>Products: {{ products.length }}</p><p>Sales records: {{ sales.length }}</p><p>Customers: {{ customers.length }}</p>
        </div>
        <div class="form-card danger-card">
          <h3>Reset System</h3><p>This deletes saved sales, purchases, products and other records from this browser.</p><button class="danger-button" @click="resetData">Reset All Data</button>
        </div>
      </section>
    </main>

    <div v-if="receipt" class="modal-overlay">
      <div class="receipt" id="receipt">
        <div class="receipt-header">
          <h2>{{ businessName }}</h2><p>{{ businessPhone }}</p><p>OFFICIAL SALES RECEIPT</p>
          <div class="receipt-divider"></div><p>Receipt: {{ receipt.receiptNo }}</p><p>{{ formatDate(receipt.date) }}</p>
        </div>
        <div class="receipt-customer"><p>Customer: {{ receipt.customer }}</p><p v-if="receipt.phone">Phone: {{ receipt.phone }}</p></div>
        <div class="receipt-divider"></div>
        <div v-for="item in receipt.items" :key="item.id" class="receipt-item">
          <div><strong>{{ item.name }}</strong><small>{{ item.quantity }} × {{ formatMoney(item.price) }}</small></div>
          <strong>{{ formatMoney(item.quantity * item.price) }}</strong>
        </div>
        <div class="receipt-divider"></div>
        <div class="receipt-total"><span>Total Paid</span><strong>{{ formatMoney(receipt.total) }}</strong></div>
        <p class="receipt-payment">Payment: {{ receipt.paymentMethod }}</p>
        <p class="receipt-thanks">Thank you for shopping with us!</p><p class="receipt-footer">Welcome again.</p>
      </div>
      <div class="receipt-actions"><button class="primary-btn" @click="printReceipt">🖨️ Print Receipt</button><button class="secondary-btn" @click="closeReceipt">Close</button></div>
    </div>
  </div>
</template>

<style>
*{box-sizing:border-box}
body{margin:0;font-family:Arial,Helvetica,sans-serif;background:#f4f7f5;color:#1f2937}
button,input,select{font:inherit}button{cursor:pointer}
.app{display:flex;min-height:100vh}
.sidebar{width:245px;min-width:245px;background:#14532d;color:white;padding:24px 15px;display:flex;flex-direction:column;min-height:100vh}
.brand{display:flex;align-items:center;gap:12px;padding:5px 8px 28px;border-bottom:1px solid rgba(255,255,255,.15)}
.brand-icon{width:43px;height:43px;border-radius:12px;background:white;color:#166534;display:grid;place-items:center;font-weight:900;font-size:18px}
.brand h2{font-size:17px;margin:0 0 4px}.brand small{color:#bbf7d0;font-size:11px}
.sidebar nav{display:flex;flex-direction:column;gap:7px;margin-top:28px}
.sidebar nav button{border:0;background:transparent;color:#dcfce7;text-align:left;padding:13px 12px;border-radius:8px;font-size:13px;transition:.2s}
.sidebar nav button:hover,.sidebar nav button.active{background:#22c55e;color:white}
.sidebar-bottom{margin-top:auto;padding:20px 10px 5px;font-size:12px;color:#bbf7d0}
.status-dot{display:inline-block;width:8px;height:8px;background:#4ade80;border-radius:50%;margin-right:7px}
.main{flex:1;min-width:0;padding:28px;overflow-x:hidden}
.topbar{display:flex;align-items:center;justify-content:space-between;gap:15px;margin-bottom:28px}
.topbar h1{margin:0 0 6px;color:#14532d;font-size:25px}
.topbar p,.page-heading p,.section-heading p,.cart-heading p{margin:0;color:#7b8794;font-size:13px}
.top-date{color:#64748b;font-size:13px}
.notification{background:#dcfce7;border:1px solid #86efac;color:#166534;padding:13px 16px;border-radius:9px;margin-bottom:20px;font-size:13px}
.stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:15px;margin-bottom:22px}
.stat-card{background:white;padding:20px;border-radius:12px;border:1px solid #e5eee7;box-shadow:0 2px 8px rgba(0,0,0,.025)}
.stat-card span{display:block;font-size:12px;color:#78858c;margin-bottom:10px}
.stat-card strong{color:#14532d;font-size:22px}.stat-card.warning strong{color:#d97706}
.pos-layout{display:grid;grid-template-columns:minmax(0,1fr) 370px;gap:20px;align-items:start}
.products-panel,.cart-panel,.table-card,.form-card{background:white;border:1px solid #e5eee7;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,.025)}
.section-heading,.cart-heading,.page-heading{display:flex;align-items:center;justify-content:space-between;gap:15px;margin-bottom:18px}
.section-heading h2,.cart-heading h2,.page-heading h2{margin:0 0 6px;color:#14532d;font-size:19px}
.search{max-width:220px}
input,select{width:100%;border:1px solid #dce5df;border-radius:8px;padding:11px 12px;outline:none;background:white;color:#1f2937}
input:focus,select:focus{border-color:#22a35a;box-shadow:0 0 0 3px rgba(34,163,90,.1)}
.categories{display:flex;gap:8px;overflow-x:auto;padding-bottom:15px;margin-bottom:5px}
.categories button{flex-shrink:0;border:1px solid #dce5df;border-radius:20px;background:white;padding:8px 13px;color:#52635a;font-size:12px}
.categories button.selected{background:#166534;border-color:#166534;color:white}
.product-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:13px}
.product-card{border:1px solid #e7eee9;background:white;padding:0;border-radius:10px;overflow:hidden;text-align:left;transition:.2s;min-width:0}
.product-card:hover{border-color:#22a35a;transform:translateY(-2px);box-shadow:0 5px 15px rgba(22,101,52,.08)}
.product-card:disabled{opacity:.5;cursor:not-allowed}
.product-card img{width:100%;height:115px;display:block;object-fit:cover;background:#eef4ef}
.product-info{padding:11px;display:flex;flex-direction:column;gap:6px}
.product-info strong{font-size:12px;line-height:1.4;min-height:32px}
.product-info span{color:#15803d;font-weight:700;font-size:13px}
.product-info small{color:#7b8794;font-size:10px}.product-info small.out-stock{color:#dc2626}
.cart-panel{position:sticky;top:15px;padding:18px}
.clear-btn{background:#fee2e2;border:0;color:#b91c1c;border-radius:6px;padding:8px 11px;font-size:11px}
.customer-fields{display:grid;gap:8px;margin-bottom:15px}.customer-fields input{font-size:12px}
.cart-items{max-height:340px;overflow-y:auto;border-top:1px solid #edf1ee;border-bottom:1px solid #edf1ee}
.empty{text-align:center;padding:35px 10px;color:#94a3a0}.empty div{font-size:35px}
.empty p{margin:8px 0 5px;color:#64748b}.empty small{font-size:11px}
.cart-item{display:grid;grid-template-columns:minmax(0,1fr) auto auto;align-items:center;gap:9px;padding:13px 0;border-bottom:1px solid #f0f3f1}
.cart-item:last-child{border-bottom:0}
.cart-item-details{min-width:0;display:flex;flex-direction:column;gap:5px}
.cart-item-details strong{font-size:11px}.cart-item-details small{color:#87928c;font-size:10px}
.cart-item>strong{font-size:11px;white-space:nowrap}
.quantity{display:flex;align-items:center;gap:7px}
.quantity button{width:23px;height:23px;border:0;border-radius:5px;background:#dcfce7;color:#166534;font-weight:bold}
.quantity span{font-size:12px}
.cart-summary{padding-top:16px}
.summary-line,.total-line,.change-line{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;font-size:13px}
.summary-line span,.change-line span{color:#64748b}
.total-line{padding:13px 0;border-top:1px solid #edf1ee;border-bottom:1px solid #edf1ee;font-size:15px}
.total-line strong{color:#15803d;font-size:20px}
.cart-summary label,.form-card label{display:block;font-size:12px;color:#475569;margin-bottom:8px}
.payment-methods{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin:10px 0 15px}
.payment-methods button{border:1px solid #dce5df;background:white;border-radius:7px;padding:10px 4px;font-size:11px;color:#475569}
.payment-methods button.chosen{background:#dcfce7;border-color:#16a34a;color:#166534;font-weight:bold}
.cash-field{margin-bottom:12px}.cash-field input{margin-bottom:10px}.change-line{margin-top:10px}.change-line strong{color:#15803d}
.checkout-btn,.primary-btn{background:#15803d;color:white;border:0;border-radius:8px;padding:12px 16px;font-weight:700;font-size:13px;transition:.2s}
.checkout-btn{width:100%;margin-top:7px}.checkout-btn:hover,.primary-btn:hover{background:#166534}
.checkout-btn:disabled{opacity:.5;cursor:not-allowed}
.secure-note{display:block;margin-top:10px;color:#87928c;font-size:10px;line-height:1.5}
.page-heading{margin-bottom:20px}.page-heading .primary-btn{white-space:nowrap}
.table-card{overflow-x:auto;margin-bottom:20px}
.table-card h3,.form-card h3{color:#14532d;font-size:16px;margin:0 0 17px}
table{width:100%;border-collapse:collapse;min-width:650px}
th{background:#f0f7f2;color:#52635a;font-size:11px;text-align:left;padding:13px 12px;white-space:nowrap}
td{padding:13px 12px;border-bottom:1px solid #edf1ee;font-size:12px;color:#475569}
.money{color:#15803d;font-weight:700}.empty-cell{text-align:center;color:#94a3b8;padding:30px}
.tag{display:inline-block;padding:5px 8px;background:#f1f5f9;border-radius:15px;font-size:10px}
.tag.success{background:#dcfce7;color:#166534}.tag.danger{background:#fee2e2;color:#b91c1c}
.table-image{width:43px;height:38px;object-fit:cover;border-radius:5px;background:#f0f4f0}
.actions{white-space:nowrap}.actions button{border:0;border-radius:5px;padding:7px 9px;background:#dcfce7;color:#166534;font-size:10px;margin-right:5px}
.delete-btn{background:#fee2e2!important;color:#b91c1c!important;border:0;border-radius:5px;padding:7px 9px;font-size:10px}
.form-card{margin-bottom:20px}
.form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px;margin-bottom:17px}
.form-card label input,.form-card label select{display:block;margin-top:7px}
.full-field{grid-column:1/-1}
.form-actions{display:flex;gap:10px;flex-wrap:wrap}
.secondary-btn{background:#e2e8f0;color:#334155;border:0;border-radius:8px;padding:11px 16px;font-size:13px}
.settings-card{max-width:700px}.settings-card>label{margin-bottom:17px}
.settings-description{color:#64748b;font-size:12px;line-height:1.6;margin:-5px 0 15px}
.danger-card{max-width:700px;border-color:#fecaca}
.danger-card p{color:#64748b;font-size:12px;line-height:1.6}
.danger-button{background:#dc2626;color:white;border:0;border-radius:7px;padding:11px 15px;font-size:12px}
.modal-overlay{position:fixed;inset:0;background:rgba(15,23,42,.65);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;overflow-y:auto}
.receipt{background:white;color:#111827;width:100%;max-width:380px;padding:25px;border-radius:8px;font-family:monospace}
.receipt-header{text-align:center}.receipt-header h2{color:#166534;margin:0 0 8px;font-size:20px}
.receipt-header p,.receipt-customer p,.receipt-payment,.receipt-footer{font-size:11px;margin:5px 0}
.receipt-divider{border-top:1px dashed #94a3b8;margin:15px 0}
.receipt-item{display:flex;justify-content:space-between;gap:10px;margin:12px 0;font-size:11px}
.receipt-item div{display:flex;flex-direction:column;gap:5px}.receipt-item small{color:#64748b}
.receipt-total{display:flex;justify-content:space-between;font-size:15px;font-weight:bold}
.receipt-thanks{text-align:center;font-size:13px;font-weight:bold;margin-top:20px}
.receipt-footer{text-align:center}
.receipt-actions{display:flex;flex-direction:column;gap:10px;width:100%;max-width:380px;margin-top:15px}
@media(max-width:1100px){.pos-layout{grid-template-columns:minmax(0,1fr) 330px}.product-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:850px){
.app{display:block}.sidebar{width:100%;min-width:0;min-height:auto;padding:12px}
.brand{padding-bottom:12px}.sidebar nav{flex-direction:row;overflow-x:auto;margin-top:12px;padding-bottom:5px}
.sidebar nav button{white-space:nowrap;font-size:11px;padding:10px}.sidebar-bottom{display:none}
.main{padding:18px}.pos-layout{grid-template-columns:1fr}.cart-panel{position:static}
}
@media(max-width:600px){
.main{padding:13px}.topbar{align-items:flex-start}.topbar h1{font-size:19px}.top-date{font-size:10px}
.stats{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
.stat-card{padding:14px}.stat-card strong{font-size:17px}
.section-heading{flex-direction:column;align-items:stretch}.search{max-width:none}
.product-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
.product-card img{height:95px}.form-grid{grid-template-columns:1fr}
.full-field{grid-column:auto}.page-heading{align-items:flex-start}.page-heading h2{font-size:17px}
}
@media print{
@page{size:80mm auto;margin:5mm}
body *{visibility:hidden!important}
.receipt,.receipt *{visibility:visible!important}
.receipt{position:absolute;top:0;left:0;width:100%;max-width:none;padding:0;border-radius:0}
.modal-overlay{position:static;background:white;padding:0;display:block}
.receipt-actions{display:none!important}
}
</style>