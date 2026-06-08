const products = [
  { id: 1, name: "Kemeja Linen Putih", category: "pria", price: 299000, image: "👔", badge: "Bestseller" },
  { id: 2, name: "Blazer Navy", category: "wanita", price: 450000, image: "🧥", badge: "New" },
  { id: 3, name: "Celana Chino Khaki", category: "pria", price: 275000, image: "👖", badge: null },
  { id: 4, name: "Dress Floral", category: "wanita", price: 385000, image: "👗", badge: "New" },
  { id: 5, name: "Sneakers Putih", category: "aksesoris", price: 520000, image: "👟", badge: "Trending" },
  { id: 6, name: "Tote Bag Kulit", category: "aksesoris", price: 195000, image: "👜", badge: null }
];

function getCart() {
  return JSON.parse(localStorage.getItem("vestia_cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("vestia_cart", JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) item.qty++;
  else {
    const product = products.find(p => p.id === productId);
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  showToast("Ditambahkan ke keranjang ✓");
}

function removeFromCart(productId) {
  saveCart(getCart().filter(i => i.id !== productId));
  if (typeof renderCart === "function") renderCart();
}

function updateQty(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(productId); return; }
  saveCart(cart);
  if (typeof renderCart === "function") renderCart();
}

function getCartTotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}

function updateCartBadge() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;
  badge.textContent = getCart().reduce((sum, i) => sum + i.qty, 0);
}

function formatRupiah(n) {
  return "Rp " + n.toLocaleString("id-ID");
}

function renderProductCard(p) {
  return `
    <div class="card">
      <div class="card-visual">
        ${p.badge ? `<span class="card-badge">${p.badge}</span>` : ""}
        <span class="emoji">${p.image}</span>
      </div>
      <div class="card-body">
        <span class="tag">${p.category}</span>
        <h3>${p.name}</h3>
        <p class="price">${formatRupiah(p.price)}</p>
        <button onclick="addToCart(${p.id})">Tambah ke Keranjang</button>
      </div>
    </div>
  `;
}

function showToast(msg) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.style.cssText = `
      position:fixed; bottom:2rem; left:50%; transform:translateX(-50%) translateY(100px);
      background:#0f0f0f; color:#c9a87c; padding:0.8rem 2rem; border-radius:30px;
      font-size:0.85rem; letter-spacing:0.05em; z-index:9999;
      transition:transform 0.4s cubic-bezier(0.4,0,0.2,1); pointer-events:none;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.transform = "translateX(-50%) translateY(0)";
  setTimeout(() => {
    toast.style.transform = "translateX(-50%) translateY(100px)";
  }, 2500);
}

document.addEventListener("DOMContentLoaded", updateCartBadge);