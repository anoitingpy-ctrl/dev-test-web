/* ============================================================
   DEVQUIRY — front-end logic (vanilla JS, no dependencies)
   ============================================================ */
'use strict';

/* ---------- Product catalogue (single source of truth for the UI) ---------- */
const PRODUCTS = [
  { id: 'relaydesk',  name: 'RelayDesk',  price: 129, cat: 'Business',     badge: 'Featured', v: 'inbox',
    tag: 'A shared inbox and lightweight helpdesk that keeps small teams fast and organised.' },
  { id: 'ledgerline', name: 'LedgerLine', price: 59,  cat: 'Business',     badge: 'New', v: 'invoice',
    tag: 'Offline-first invoicing: quotes, invoices and payment tracking without a subscription.' },
  { id: 'sheetsmith', name: 'SheetSmith', price: 49,  cat: 'Data',         badge: '', v: 'sheet',
    tag: 'Turn messy CSV exports into clean, shareable reports in a few clicks.' },
  { id: 'portwatch',  name: 'PortWatch',  price: 69,  cat: 'Developer',    badge: 'Popular', v: 'pulse',
    tag: 'A quiet uptime and endpoint monitor that alerts you only when it matters.' },
  { id: 'sortwise',   name: 'Sortwise',   price: 39,  cat: 'Utilities',    badge: '', v: 'files',
    tag: 'Bulk file organisation: rename, sort and deduplicate thousands of files safely.' },
  { id: 'clipvault',  name: 'ClipVault',  price: 29,  cat: 'Productivity', badge: '', v: 'clip',
    tag: 'A searchable clipboard manager with encrypted history and instant recall.' },
];
const productById = id => PRODUCTS.find(p => p.id === id);
const money = n => '$' + n;

/* ---------- Cart store (localStorage — UI only, WooCommerce wires up later) ---------- */
const CART_KEY = 'devquiry_cart';
const ORDERS_KEY = 'devquiry_orders';
const getCart = () => { try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; } catch { return {}; } };
const setCart = c => { localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCartBadge(); };
const cartEntries = () => Object.entries(getCart()).filter(([id]) => productById(id));
const cartCount = () => cartEntries().length;
const cartTotal = () => cartEntries().reduce((s, [id, q]) => s + productById(id).price * q, 0);

function addToCart(id, opts = {}) {
  const c = getCart(); c[id] = 1; setCart(c);
  const p = productById(id);
  toast(`${p.name} added to cart`);
  if (opts.go) location.href = opts.go;
}
function removeFromCart(id) { const c = getCart(); delete c[id]; setCart(c); }

function updateCartBadge() {
  const el = document.getElementById('cartCount');
  if (!el) return;
  const n = cartCount();
  el.textContent = n;
  el.hidden = n === 0;
}

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
  t.textContent = msg;
  requestAnimationFrame(() => t.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ---------- UI tile mockups (CSS-art product screenshots) ---------- */
function tileHTML(v) {
  const wins = {
    inbox: `<div class="tl-win"><div class="tl-top"><i></i><i></i><i></i></div><div class="tl-cols"><div class="tl-side"><s class="on"></s><s></s><s></s><s></s></div><div class="tl-main"><b class="w80"></b><b></b><b class="w60"></b><b class="lm w40"></b></div></div></div>`,
    invoice: `<div class="tl-win"><div class="tl-top"><i></i><i></i><i></i></div><div class="tl-bignum"><b></b><s></s></div><div class="tl-main"><b class="w70"></b><b></b><b class="w50"></b></div><span class="tl-bar lm" style="background:var(--lime);width:45%"></span></div>`,
    sheet: `<div class="tl-win"><div class="tl-top"><i></i><i></i><i></i></div><div class="tl-bars"><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="tl-main"><b class="w60"></b><b class="w40"></b></div></div>`,
    pulse: `<div class="tl-win"><div class="tl-top"><i></i><i></i><i></i></div><div class="tl-dots"><i class="up"></i><i class="up"></i><i class="lm"></i><i class="up"></i><i></i></div><div class="tl-main"><b></b><b class="w70"></b><b class="lm w50"></b></div></div>`,
    files: `<div class="tl-win"><div class="tl-top"><i></i><i></i><i></i></div><div class="tl-grid6"><i></i><i></i><i class="lm"></i><i></i><i></i><i></i></div><span class="tl-bar" style="width:55%"></span></div>`,
    clip: `<div class="tl-win"><div class="tl-top"><i></i><i></i><i></i></div><div class="tl-main"><b class="w90"></b><b class="w60"></b><b class="w80"></b><b class="lm w40"></b><b class="w70"></b></div></div>`,
  };
  return `<div class="tile" aria-hidden="true">${wins[v] || wins.inbox}</div>`;
}

function cardHTML(p, i = 0) {
  return `
  <article class="pcard reveal" style="--d:${(i % 3) * .08}s">
    <a class="pcard-media" href="product.html?id=${p.id}" aria-label="${p.name} — view product">
      ${tileHTML(p.v)}
      ${p.badge ? `<span class="pbadge">${p.badge}</span>` : ''}
    </a>
    <div class="pcard-body">
      <span class="pcard-cat">${p.cat}</span>
      <h3 class="pcard-name"><a href="product.html?id=${p.id}">${p.name}</a></h3>
      <p class="pcard-desc">${p.tag}</p>
      <div class="pcard-foot">
        <span class="pcard-price">${money(p.price)}</span>
        <span class="pcard-foot-r"><a class="link-a" href="product.html?id=${p.id}">Explore Product <span class="arr">→</span></a></span>
      </div>
    </div>
  </article>`;
}

function initials(name) { return name.slice(0, 2).toUpperCase(); }
function genKey() {
  const s = () => Array.from({ length: 4 }, () => 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 31)]).join('');
  return `${s()}-${s()}-${s()}-${s()}`;
}
const maskKey = k => '••••-••••-••••-' + k.slice(-4);

/* ---------- Global chrome ---------- */
document.documentElement.classList.add('js');
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('is-ready');
  updateCartBadge();

  /* Nav scroll state */
  const nav = document.getElementById('siteNav');
  const onScroll = () => nav && nav.classList.toggle('is-scrolled', window.scrollY > 10);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile menu */
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobileMenu');
  if (burger && menu) {
    const toggle = open => {
      burger.classList.toggle('open', open);
      menu.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
      document.body.classList.toggle('menu-open', open);
    };
    burger.addEventListener('click', () => toggle(!menu.classList.contains('open')));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
  }

  /* Reveal on scroll */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* How-it-works step progression */
  const steps = [...document.querySelectorAll('.step')];
  if (steps.length) {
    const fill = document.querySelector('.steps-prog i');
    const count = document.querySelector('.steps-count b');
    const so = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      steps.forEach(s => s.classList.remove('is-active'));
      e.target.classList.add('is-active');
      const i = steps.indexOf(e.target);
      if (fill) fill.style.height = ((i + 1) / steps.length * 100) + '%';
      if (count) count.textContent = '0' + (i + 1);
    }), { rootMargin: '-38% 0px -38% 0px' });
    steps.forEach(s => so.observe(s));
  }

  /* Accordions */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', () => {
      const open = item.classList.toggle('open');
      q.setAttribute('aria-expanded', open);
      if (open) { a.hidden = false; a.style.maxHeight = a.scrollHeight + 'px'; }
      else { a.style.maxHeight = '0px'; setTimeout(() => { if (!item.classList.contains('open')) a.hidden = true; }, 460); }
    });
  });

  /* Copy buttons */
  document.querySelectorAll('[data-copy]').forEach(btn => btn.addEventListener('click', async () => {
    const txt = btn.getAttribute('data-copy');
    try { await navigator.clipboard.writeText(txt); toast('License key copied'); }
    catch { toast('Copy: ' + txt); }
  }));

  /* Demo download buttons */
  document.querySelectorAll('[data-demo-download]').forEach(b => b.addEventListener('click', e => {
    e.preventDefault();
    toast('Demo build — downloads connect at launch');
  }));

  route(document.body.dataset.page);
});

/* ---------- Page routers ---------- */
function route(page) {
  if (page === 'products') initProducts();
  if (page === 'product')  initProductDetail();
  if (page === 'cart')     initCartPage();
  if (page === 'checkout') initCheckout();
  if (page === 'success')  initSuccess();
  if (page === 'account')  initAccount();
  if (page === 'contact')  initContact();
}

/* ---------- Products listing ---------- */
function initProducts() {
  const grid = document.getElementById('prodGrid');
  const countEl = document.getElementById('resultsN');
  const search = document.getElementById('prodSearch');
  const sort = document.getElementById('prodSort');
  const chips = [...document.querySelectorAll('.chip')];
  let cat = 'All', q = '', mode = 'featured';

  function render() {
    let list = PRODUCTS.filter(p =>
      (cat === 'All' || p.cat === cat) &&
      (p.name + ' ' + p.tag + ' ' + p.cat).toLowerCase().includes(q.toLowerCase()));
    if (mode === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (mode === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (mode === 'name') list.sort((a, b) => a.name.localeCompare(b.name));

    grid.innerHTML = list.length
      ? list.map((p, i) => cardHTML(p, i)).join('')
      : `<div class="empty-state" style="grid-column:1/-1">No tools match your search. <button class="btn-text" id="clearFilters">Clear filters</button></div>`;
    grid.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    countEl.textContent = `${list.length} ${list.length === 1 ? 'tool' : 'tools'}`;
    const clr = document.getElementById('clearFilters');
    if (clr) clr.addEventListener('click', () => { cat = 'All'; q = ''; search.value = ''; chips.forEach(c => c.classList.toggle('active', c.dataset.cat === 'All')); render(); });
  }

  chips.forEach(c => c.addEventListener('click', () => {
    chips.forEach(x => x.classList.remove('active')); c.classList.add('active');
    cat = c.dataset.cat; render();
  }));
  search.addEventListener('input', () => { q = search.value; render(); });
  sort.addEventListener('change', () => { mode = sort.value; render(); });
  render();
}

/* ---------- Product detail (data-driven via ?id=) ---------- */
function initProductDetail() {
  const id = new URLSearchParams(location.search).get('id');
  const p = productById(id) || PRODUCTS[0];
  document.title = `${p.name} — Devquiry`;
  const map = { name: p.name, cat: p.cat, tag: p.tag, price: money(p.price) };
  Object.entries(map).forEach(([k, v]) => document.querySelectorAll(`[data-pd="${k}"]`).forEach(el => el.textContent = v));
  document.querySelectorAll('[data-pd="crumbname"]').forEach(el => el.textContent = p.name);
  const tile = document.getElementById('pdTile');
  if (tile) tile.innerHTML = tileHTML(p.v);
  document.querySelectorAll('[data-add]').forEach(b => b.addEventListener('click', e => {
    e.preventDefault();
    addToCart(p.id, b.dataset.add === 'buy' ? { go: 'checkout.html' } : {});
  }));
}

/* ---------- Cart ---------- */
function initCartPage() {
  const list = document.getElementById('cartList');
  const sumBox = document.getElementById('cartSummary');

  function render() {
    const items = cartEntries();
    if (!items.length) {
      list.innerHTML = `<div class="empty-state" style="margin-top:32px">Your cart is empty.<br><br><a class="btn btn-dark" href="products.html">Explore Software <span class="arr">→</span></a></div>`;
      sumBox.style.display = 'none';
      return;
    }
    sumBox.style.display = '';
    list.innerHTML = `<div class="cart-list">` + items.map(([id]) => {
      const p = productById(id);
      return `<div class="cart-row">
        <span class="thumb" aria-hidden="true">${initials(p.name)}</span>
        <div>
          <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
          <div class="sub">${p.cat} · Digital delivery · 1 license (up to 3 devices)</div>
        </div>
        <div class="rgt">
          <span class="price">${money(p.price)}</span>
          <button class="btn-text" data-remove="${p.id}">Remove</button>
        </div>
      </div>`;
    }).join('') + `</div>
    <p class="note" style="margin-top:18px">Need multiple seats for your team? <a href="contact.html" style="text-decoration:underline">Contact us</a> for volume licensing.</p>`;

    document.getElementById('sumSub').textContent = money(cartTotal());
    document.getElementById('sumTotal').textContent = money(cartTotal());
    document.getElementById('sumCount').textContent = items.length;
    list.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => {
      removeFromCart(b.dataset.remove); render();
      toast('Removed from cart');
    }));
  }
  render();
}

/* ---------- Checkout ---------- */
function initCheckout() {
  const itemsEl = document.getElementById('coItems');
  const placeBtn = document.getElementById('placeOrder');
  const items = cartEntries();
  if (!items.length) {
    itemsEl.innerHTML = `<div class="empty-state">Your cart is empty. <a href="products.html" style="text-decoration:underline">Browse software</a>.</div>`;
    if (placeBtn) { placeBtn.disabled = true; placeBtn.style.opacity = '.5'; placeBtn.style.cursor = 'not-allowed'; }
    return;
  }
  itemsEl.innerHTML = items.map(([id]) => {
    const p = productById(id);
    return `<li><span class="thumb" aria-hidden="true">${initials(p.name)}</span><div><b>${p.name}</b><span>1 license · instant download</span></div><span class="p">${money(p.price)}</span></li>`;
  }).join('');
  document.getElementById('coSub').textContent = money(cartTotal());
  document.getElementById('coTotal').textContent = money(cartTotal());

  const form = document.getElementById('checkoutForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    const order = {
      no: 'DV-' + new Date().getFullYear() + '-' + String(Math.floor(100000 + Math.random() * 900000)),
      email: document.getElementById('coEmail').value,
      total: cartTotal(),
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      items: items.map(([id]) => ({ id, key: genKey() })),
    };
    orders.push(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    localStorage.setItem('devquiry_last_order', JSON.stringify(order));
    setCart({});
    location.href = 'order-success.html';
  });
}

/* ---------- Order success ---------- */
function initSuccess() {
  let order = null;
  try { order = JSON.parse(localStorage.getItem('devquiry_last_order')); } catch { /* ignore */ }
  if (!order || !order.items || !order.items.length) {
    order = { no: 'DV-2026-000001', total: 129, date: '30 Aug 2026', items: [{ id: 'relaydesk', key: 'DEMO-DEMO-DEMO-2026' }], demo: true };
  }
  const first = order.items[0];
  const p = productById(first.id);
  document.getElementById('ordNo').textContent = 'ORDER ' + order.no + (order.demo ? ' · DEMO' : '');
  document.getElementById('licKey').textContent = first.key;
  document.getElementById('licProduct').textContent = p.name;
  document.getElementById('copyKey').setAttribute('data-copy', first.key);
  const more = document.getElementById('moreKeys');
  if (order.items.length > 1) {
    more.innerHTML = order.items.slice(1).map(it => {
      const pp = productById(it.id);
      return `<div class="key-row" style="margin-top:14px;justify-content:center"><b style="font-size:.9rem">${pp.name}</b><code>${it.key}</code></div>`;
    }).join('');
  }
  /* rebind copy for injected key */
  const btn = document.getElementById('copyKey');
  btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(first.key); toast('License key copied'); }
    catch { toast('Copy: ' + first.key); }
  });
}

/* ---------- Account ---------- */
function initAccount() {
  const tabs = [...document.querySelectorAll('.a-nav [data-tab]')];
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('active')); t.classList.add('active');
    document.querySelectorAll('.pane').forEach(pn => pn.classList.toggle('active', pn.id === 'pane-' + t.dataset.tab));
  }));

  const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
  const licenses = [];
  orders.forEach(o => o.items.forEach(it => licenses.push({ id: it.id, key: it.key, order: o.no, date: o.date })));
  if (!licenses.length) licenses.push({ id: 'relaydesk', key: 'DEMO-DEMO-DEMO-2026', order: 'SAMPLE', date: '30 Aug 2026', sample: true });

  /* Dashboard counts */
  const uniq = new Set(licenses.map(l => l.id));
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('stProducts', String(uniq.size).padStart(2, '0'));
  set('stLicenses', String(licenses.length).padStart(2, '0'));
  set('stDownloads', String(uniq.size).padStart(2, '0'));
  set('stTickets', '00');

  /* Orders */
  const ordEl = document.getElementById('ordersBody');
  if (ordEl) ordEl.innerHTML = orders.length
    ? orders.map(o => `<tr><td><b>${o.no}</b></td><td>${o.date}</td><td>${o.items.map(i => productById(i.id).name).join(', ')}</td><td><span class="pill on">PAID</span></td><td style="text-align:right"><b>${money(o.total)}</b></td></tr>`).join('')
    : `<tr><td colspan="5" style="color:var(--muted)">No orders yet — sample license shown in Licenses. <a href="products.html" style="text-decoration:underline">Browse software</a>.</td></tr>`;

  /* Downloads */
  const dlEl = document.getElementById('dlList');
  if (dlEl) dlEl.innerHTML = [...uniq].map(id => {
    const p = productById(id);
    return `<div class="cart-row" style="grid-template-columns:52px 1fr auto">
      <span class="thumb" style="width:52px;height:52px;font-size:1rem" aria-hidden="true">${initials(p.name)}</span>
      <div><h3>${p.name}</h3><div class="sub">v1.4 · Windows / macOS / Linux · ${p.cat}</div></div>
      <button class="btn btn-ghost btn-sm" data-demo-download>Download</button>
    </div>`;
  }).join('');
  dlEl && dlEl.querySelectorAll('[data-demo-download]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); toast('Demo build — downloads connect at launch'); }));

  /* Licenses */
  const licEl = document.getElementById('licList');
  if (licEl) licEl.innerHTML = licenses.map(l => {
    const p = productById(l.id);
    return `<div class="lic-card">
      <div class="top"><h3>${p.name}${l.sample ? ' <span class="pill">SAMPLE</span>' : ''}</h3><span class="pill on">ACTIVE</span></div>
      <div class="key-row">
        <code data-key>${maskKey(l.key)}</code>
        <button class="btn-text" data-reveal>Show key</button>
        <button class="btn-text" data-cp="${l.key}">Copy</button>
      </div>
      <div class="lic-meta"><span>Order ${l.order}</span><span>Issued ${l.date}</span><span>Activations: 1 of 3 devices</span><span>Verifies periodically with devquiry.com</span></div>
    </div>`;
  }).join('');
  licEl && licEl.querySelectorAll('[data-reveal]').forEach((b, i) => b.addEventListener('click', () => {
    const code = licEl.querySelectorAll('[data-key]')[i];
    const show = b.textContent === 'Show key';
    code.textContent = show ? licenses[i].key : maskKey(licenses[i].key);
    b.textContent = show ? 'Hide key' : 'Show key';
  }));
  licEl && licEl.querySelectorAll('[data-cp]').forEach(b => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.cp); toast('License key copied'); } catch { toast('Copy: ' + b.dataset.cp); }
  }));

  /* Account details form (demo) */
  const adForm = document.getElementById('accountForm');
  adForm && adForm.addEventListener('submit', e => { e.preventDefault(); toast('Saved (demo)'); });
}

/* ---------- Contact ---------- */
function initContact() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    form.innerHTML = `<div class="form-ok">
      <span class="s-check"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg></span>
      <h3>Message sent.</h3><p>Thanks for reaching out — we reply within one business day.<br>For existing orders, include your order number for faster help.</p>
      <p style="margin-top:20px"><a class="link-a" href="index.html#faq">Browse the FAQ meanwhile <span class="arr">→</span></a></p>
    </div>`;
  });
}
