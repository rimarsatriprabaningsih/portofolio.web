const products = [
  { id:1, name:"Kemeja Linen Putih", category:"pria", price:239000, originalPrice:299000,
    image:"https://image.uniqlo.com/UQ/ST3/id/imagesgoods/477181/item/idgoods_00_477181_3x4.jpg?width=600",
    badge:"Sale", rating:4.8, reviews:124,
    description:"Kemeja linen premium breathable. Slim fit modern, cocok formal & casual.",
    sizes:["S","M","L","XL"], colors:["Putih","Krem"] },
  { id:2, name:"Blazer Navy Elegance", category:"wanita", price:450000, originalPrice:null,
    image:"https://suitshop.com/_next/image/?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F1025%2F3059%2Ffiles%2FWomen_sNavy_Jacket_Front_1500x2000_crop_center.jpg%3Fv%3D1765064986&w=1024&q=90",
    badge:"New", rating:4.9, reviews:89,
    description:"Blazer navy wool blend premium. Tailoring presisi untuk penampilan profesional.",
    sizes:["S","M","L"], colors:["Navy","Hitam"] },
  { id:3, name:"Celana Chino Khaki", category:"pria", price:220000, originalPrice:275000,
    image:"https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
    badge:"Sale", rating:4.6, reviews:201,
    description:"Celana chino stretch comfort fit. Warna khaki versatile smart casual.",
    sizes:["28","30","32","34"], colors:["Khaki","Navy"] },
  { id:4, name:"Dress Floral Summer", category:"wanita", price:385000, originalPrice:null,
    image:"https://colorbox.co.id/cdn/shop/products/I-DIWFCR223A016_ECRU_4.jpg?v=1675845866",
    badge:"New", rating:4.7, reviews:156,
    description:"Dress floral motif eksklusif. Flowy silhouette untuk brunch atau date night.",
    sizes:["S","M","L","XL"], colors:["Floral Pink","Floral Blue"] },
  { id:5, name:"Sneakers White Classic", category:"aksesoris", price:416000, originalPrice:520000,
    image:"https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80",
    badge:"Trending", rating:4.9, reviews:312,
    description:"Sneakers putih timeless dengan sole cushion. Matching semua outfit.",
    sizes:["38","39","40","41","42"], colors:["Putih","Off-White"] },
  { id:6, name:"Tote Bag Premium Leather", category:"aksesoris", price:195000, originalPrice:null,
    image:"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80",
    badge:null, rating:4.5, reviews:78,
    description:"Tote bag kulit sintetis premium. Kompartemen laptop, minimalis & fungsional.",
    sizes:["One Size"], colors:["Tan","Hitam"] },
  { id:7, name:"Kaos Oversize Black", category:"pria", price:149000, originalPrice:null,
    image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    badge:"New", rating:4.4, reviews:95,
    description:"Kaos oversize cotton combed 24s. Streetwear essential cutting relaxed.",
    sizes:["M","L","XL","XXL"], colors:["Hitam","Abu","Putih"] },
  { id:8, name:"Rok Midi Pleated", category:"wanita", price:265000, originalPrice:330000,
    image:"https://colorbox.co.id/cdn/shop/files/I-SIWKEY124D127_BLACK_4_T_2f343437-54c6-4edb-84ab-fc86322c0aae.jpg?v=1740969162&width=700",
    badge:"Sale", rating:4.6, reviews:67,
    description:"Rok midi pleated elastic waistband. Feminine & nyaman sepanjang hari.",
    sizes:["S","M","L"], colors:["Beige","Hitam","Olive"] }
];

const COUPON_CODE = "VESTIA15";
const COUPON_DISCOUNT = 0.15;

function getCart() { return JSON.parse(localStorage.getItem("vestia_cart") || "[]"); }
function getWishlist() { return JSON.parse(localStorage.getItem("vestia_wishlist") || "[]"); }

function saveCart(cart) { localStorage.setItem("vestia_cart", JSON.stringify(cart)); updateBadges(); }
function saveWishlist(list) { localStorage.setItem("vestia_wishlist", JSON.stringify(list)); updateBadges(); }

function addToCart(productId, qty=1, size=null, color=null) {
  const cart = getCart();
  const key = `${productId}-${size||"default"}-${color||"default"}`;
  const existing = cart.find(i => i.key === key);
  if (existing) existing.qty += qty;
  else { const p = products.find(x => x.id === productId); cart.push({...p, qty, size, color, key}); }
  saveCart(cart);
  showToast("✓ Ditambahkan ke keranjang");
}

function removeFromCart(key) { saveCart(getCart().filter(i => i.key !== key)); if(typeof renderCart==="function") renderCart(); }

function updateQty(key, delta) {
  const cart = getCart();
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(key); return; }
  saveCart(cart);
  if (typeof renderCart === "function") renderCart();
}

function getCartSubtotal() { return getCart().reduce((s,i) => s + i.price * i.qty, 0); }
function getShipping(sub) { return sub >= 500000 ? 0 : 25000; }
function getDiscount(sub) { return localStorage.getItem("vestia_coupon") === COUPON_CODE ? Math.round(sub * COUPON_DISCOUNT) : 0; }
function getGrandTotal() { const sub = getCartSubtotal(); return sub - getDiscount(sub) + getShipping(sub); }

function toggleWishlist(id) {
  let list = getWishlist();
  if (list.includes(id)) { list = list.filter(x => x !== id); showToast("Dihapus dari wishlist"); }
  else { list.push(id); showToast("♥ Disimpan ke wishlist"); }
  saveWishlist(list);
  if (typeof renderWishlist === "function") renderWishlist();
  if (typeof refreshWishlistIcons === "function") refreshWishlistIcons();
}
function isWishlisted(id) { return getWishlist().includes(id); }

function applyCoupon(code) {
  if (code.toUpperCase() === COUPON_CODE) {
    localStorage.setItem("vestia_coupon", COUPON_CODE);
    showToast("✓ Kupon VESTIA15 diterapkan! Diskon 15%");
    if (typeof renderCart === "function") renderCart();
    return true;
  }
  showToast("✗ Kode kupon tidak valid");
  return false;
}

function formatRupiah(n) { return "Rp " + n.toLocaleString("id-ID"); }
function getDiscountPercent(price, orig) { return orig ? Math.round((1 - price/orig) * 100) : 0; }
function generateOrderId() { return "VST-" + Date.now().toString(36).toUpperCase(); }

function updateBadges() {
  const c = document.getElementById("cart-count");
  const w = document.getElementById("wish-count");
  if (c) c.textContent = getCart().reduce((s,i) => s + i.qty, 0);
  if (w) w.textContent = getWishlist().length;
}

function showToast(msg) {
  let t = document.getElementById("toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; document.body.appendChild(t); }
  t.textContent = msg;
  t.className = "toast show";
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.className = "toast", 2800);
}

function renderStars(rating) {
  let s = "";
  for (let i = 1; i <= 5; i++) s += i <= Math.floor(rating) ? "★" : (i - rating < 1 ? "★" : "☆");
  return `<span class="stars">${s}</span>`;
}

function renderProductCard(p) {
  const disc = getDiscountPercent(p.price, p.originalPrice);
  const wished = isWishlisted(p.id);
  return `
    <div class="card">
      <div class="card-visual">
        <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy">
        ${p.badge ? `<span class="card-badge ${p.badge==="Sale"?"sale":""}">${p.badge==="Sale"&&disc?"-"+disc+"%":p.badge}</span>` : ""}
        <button class="wish-btn ${wished?"active":""}" onclick="event.stopPropagation();toggleWishlist(${p.id})">♥</button>
        <a href="product-detail.html?id=${p.id}" class="card-overlay">Lihat Detail</a>
      </div>
      <div class="card-body">
        <div class="card-meta"><span class="tag">${p.category}</span> ${renderStars(p.rating)} <small>(${p.reviews})</small></div>
        <h3><a href="product-detail.html?id=${p.id}">${p.name}</a></h3>
        <div class="price-row">
          <span class="price">${formatRupiah(p.price)}</span>
          ${p.originalPrice ? `<span class="price-old">${formatRupiah(p.originalPrice)}</span>` : ""}
        </div>
        <button class="btn-add" onclick="addToCart(${p.id})">+ Keranjang</button>
      </div>
    </div>`;
}

function handleSearch(q) {
  q = q.toLowerCase().trim();
  if (!q) return products;
  return products.filter(p => p.name.toLowerCase().includes(q) || p.category.includes(q));
}

function toggleMenu() {
  document.querySelector(".nav-links")?.classList.toggle("open");
  document.querySelector(".hamburger")?.classList.toggle("active");
}

function openLogin() { document.getElementById("login-modal")?.classList.add("open"); }
function closeLogin() { document.getElementById("login-modal")?.classList.remove("open"); }
function handleLogin(e) { e.preventDefault(); closeLogin(); showToast("✓ Login berhasil! Selamat datang di Vestia"); }

function handleGlobalSearch(q) {
  if (window.location.pathname.includes("products.html") || window.location.href.includes("products.html")) {
    document.getElementById("product-list").innerHTML = handleSearch(q).map(renderProductCard).join("");
  } else if (q.trim()) {
    localStorage.setItem("vestia_search", q);
    window.location.href = "products.html";
  }
}

function generateQrisPayload(orderId, amount) {
  return ["VESTIA FASHION","QRIS DEMO",`Order: ${orderId}`,`Total: ${formatRupiah(amount)}`,
    `Waktu: ${new Date().toLocaleString("id-ID")}`,"Scan via GoPay/OVO/Dana/ShopeePay",
    "Prototype - bukan pembayaran nyata"].join("\n");
}

function showQrisPayment(orderId, amount) {
  const container = document.getElementById("checkout-content");
  container.innerHTML = `
    <div class="qris-page"><div class="qris-box">
      <div class="qris-header">
        <div class="qris-logo-text">QRIS</div>
        <h2>Scan QRIS untuk Bayar</h2>
        <p class="qris-amount">${formatRupiah(amount)}</p>
        <p class="qris-order">Order: <strong>${orderId}</strong></p>
      </div>
      <div class="qris-qr-wrap"><div id="qrcode"></div></div>
      <div class="qris-instructions">
        <h4>Cara Pembayaran:</h4>
        <ol>
          <li>Buka aplikasi e-wallet (GoPay, OVO, Dana, ShopeePay)</li>
          <li>Pilih menu <strong>Scan QR / QRIS</strong></li>
          <li>Arahkan kamera ke QR code di atas</li>
          <li>Konfirmasi pembayaran <strong>${formatRupiah(amount)}</strong></li>
          <li>Klik "Saya Sudah Bayar" di bawah</li>
        </ol>
      </div>
      <div class="qris-timer">⏱ Selesaikan dalam <span id="countdown">15:00</span></div>
      <button class="btn btn-dark" onclick="confirmQrisPayment('${orderId}')" style="margin-top:1rem">✓ Saya Sudah Bayar</button>
      <button class="btn btn-ghost" onclick="location.reload()" style="margin-top:0.5rem;width:100%">Batalkan</button>
    </div></div>`;

  document.getElementById("qrcode").innerHTML = "";
  new QRCode(document.getElementById("qrcode"), {
    text: generateQrisPayload(orderId, amount), width: 220, height: 220,
    colorDark: "#141414", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.H
  });
  startCountdown(900);
}

function startCountdown(sec) {
  const el = document.getElementById("countdown");
  if (!el) return;
  const iv = setInterval(() => {
    sec--;
    el.textContent = `${Math.floor(sec/60)}:${(sec%60).toString().padStart(2,"0")}`;
    if (sec <= 0) { clearInterval(iv); el.textContent = "Kedaluwarsa"; }
  }, 1000);
}

function confirmQrisPayment(orderId) {
  localStorage.removeItem("vestia_cart");
  localStorage.removeItem("vestia_coupon");
  updateBadges();
  document.getElementById("checkout-content").innerHTML = `
    <div class="success-box">
      <div class="success-icon">✓</div>
      <h2>Pembayaran Berhasil!</h2>
      <p>Pesanan kamu sedang diproses.</p>
      <div class="order-id">${orderId}</div>
      <a href="index.html" class="btn btn-primary" style="margin-top:1.5rem;display:inline-block">Kembali ke Beranda</a>
    </div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  updateBadges();
  document.getElementById("login-modal")?.addEventListener("click", e => {
    if (e.target.id === "login-modal") closeLogin();
  });
});