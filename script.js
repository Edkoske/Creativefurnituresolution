/* global page switching, filtering, cart, modal, newsletter and contact handlers */

const products = [
  {
    id: 'p1', title: 'Aria Sofa', price: 1499,
    category: 'Sofas', material: 'Leather',
    img: 'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg',
    desc: 'Elegant three-seater with plush cushions and solid wood frame.'
  },
  {
    id: 'p2', title: 'Oak Minimal Desk', price: 799,
    category: 'Office', material: 'Wood',
    img: 'https://images.pexels.com/photos/374023/pexels-photo-374023.jpeg',
    desc: 'Hand-finished oak desk with integrated cable management.'
  },
  {
    id: 'p3', title: 'Luna Armchair', price: 599,
    category: 'Sofas', material: 'Fabric',
    img: 'https://images.pexels.com/photos/698528/pexels-photo-698528.jpeg',
    desc: 'Compact armchair with curved back and high-density foam.'
  },
  {
    id: 'p4', title: 'Monroe Dining Table', price: 1699,
    category: 'Dining', material: 'Wood',
    img: 'https://images.pexels.com/photos/298842/pexels-photo-298842.jpeg',
    desc: 'Solid table seating six, finished with water-resistant coating.'
  },
  {
    id: 'p5', title: 'Haven Bed Frame', price: 1299,
    category: 'Beds', material: 'Wood',
    img: 'https://images.pexels.com/photos/7088092/pexels-photo-7088092.jpeg',
    desc: 'Platform bed with upholstered headboard and slatted base.'
  },
  {
    id: 'p6', title: 'Arc Shelf', price: 299,
    category: 'Office', material: 'Metal',
    img: 'https://images.pexels.com/photos/569978/pexels-photo-569978.jpeg',
    desc: 'Arched shelving unit with adjustable panels.'
  }
];

// element references
const featuredGrid = document.getElementById('featuredProducts');
const shopGrid = document.getElementById('shopProducts');
const cartCountEl = document.getElementById('cartBadge');
const modal = document.getElementById('productModal');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

// simple state
let filters = {category:'', price:'', material:'', sort:'newest'};

/* utility */
function formatPrice(n){ return '$' + n.toLocaleString(); }

/* rendering helpers */
function renderGrid(grid, items){
  grid.innerHTML = '';
  items.forEach(p => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <img loading="lazy" src="${p.img}" alt="${p.title}">
      <div class="product-body">
        <h4 class="product-title">${p.title}</h4>
        <p class="product-desc">${p.desc}</p>
        <div class="product-meta">
          <div class="price">${formatPrice(p.price)}</div>
          <div>
            <button class="card-btn" data-id="${p.id}" data-action="details">Details</button>
            <button class="card-btn" data-id="${p.id}" data-action="add">Add</button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderFeatured(){
  renderGrid(featuredGrid, products.slice(0,4));
}

function renderShop(){
  applyFilters();
}

/* page switching */
function showPage(id){
  ['main-content','shop-page','about-page','contact-page'].forEach(pid=>{
    const el = document.getElementById(pid);
    if(!el) return;
    el.style.display = pid === id ? '' : 'none';
  });
}
function showHome(e){ if(e) e.preventDefault(); showPage('main-content'); }
function showShop(e){ if(e) e.preventDefault(); showPage('shop-page'); renderShop(); }
function showAbout(e){ if(e) e.preventDefault(); showPage('about-page'); }
function showContact(e){ if(e) e.preventDefault(); showPage('contact-page'); }

/* filtering */
function applyFilters(){
  let results = products.slice();
  if(filters.category){
    results = results.filter(p=>p.category === filters.category);
  }
  if(filters.material){
    results = results.filter(p=>p.material === filters.material);
  }
  if(filters.price){
    const [low,high] = filters.price.split('-').map(Number);
    results = results.filter(p=>{
      if(high) return p.price >= low && p.price <= high;
      return p.price >= low;
    });
  }
  if(filters.sort === 'price-low'){
    results.sort((a,b)=>a.price-b.price);
  } else if(filters.sort === 'price-high'){
    results.sort((a,b)=>b.price-a.price);
  }
  renderGrid(shopGrid, results);
}
function filterByCategory(cat){
  filters.category = cat;
  const sel = document.getElementById('catFilter');
  if(sel) sel.value = cat;
  applyFilters();
  showShop();
}

/* cart and modal */
function openModal(html){
  modalContent.innerHTML = html;
  modal.setAttribute('aria-hidden','false');
}
function closeModal(){
  modal.setAttribute('aria-hidden','true');
  modalContent.innerHTML = '';
}
function toggleCart(){
  const side = document.getElementById('cartSidebar');
  if(side.getAttribute('aria-hidden') === 'true'){
    side.setAttribute('aria-hidden','false');
  } else {
    side.setAttribute('aria-hidden','true');
  }
}
function addToCart(id){
  const key = 'cfs_cart';
  let cart = JSON.parse(localStorage.getItem(key) || '[]');
  const index = cart.findIndex(x=>x.id===id);
  if(index > -1){ cart[index].qty += 1; }
  else { cart.push({id,qty:1}); }
  localStorage.setItem(key, JSON.stringify(cart));
  cartCountEl.textContent = cart.reduce((sum,i)=>sum+i.qty,0);
}
function loadCartCount(){
  const key = 'cfs_cart';
  const cart = JSON.parse(localStorage.getItem(key) || '[]');
  cartCountEl.textContent = cart.reduce((sum,i)=>sum+i.qty,0);
}

/* checkout & notifications */
function handleCheckout(){
  showNotification('Checkout functionality is coming soon.', 'info');
}
function showNotification(message, type='success'){
  // simple alert for now
  alert(message);
}

/* misc handlers */
function handleContactForm(e){
  e.preventDefault();
  showNotification('Thanks for your message! We will be in touch shortly.');
  e.target.reset();
}

function handleNewsletter(e){
  e.preventDefault();
  const email = document.getElementById('email').value;
  showNotification('Subscribed with ' + email);
  e.target.reset();
}

/* event attachments */
function toggleNavOnMobile(){
  const menu = document.getElementById('navMenu');
  const toggle = document.getElementById('menuToggle');
  if(menu && window.innerWidth <= 768){
    menu.classList.remove('active');
    toggle.setAttribute('aria-expanded','false');
  }
}

function attachListeners(){
  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  if(menuToggle && navMenu){
    menuToggle.addEventListener('click', ()=>{
      const isActive = navMenu.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });
  }

  document.body.addEventListener('click', e=>{
    const btn = e.target.closest('button[data-action]');
    if(btn){
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      const product = products.find(x=>x.id===id);
      if(action==='details'){
        openModal(`
          <div style="display:flex;gap:18px;align-items:flex-start;flex-wrap:wrap">
            <img src='${product.img}' style='width:100%;max-width:320px;height:auto;border-radius:8px;object-fit:cover' alt='${product.title}'/>
            <div style='flex:1;min-width:250px'>
              <h3>${product.title}</h3>
              <p>${product.desc}</p>
              <p style='font-weight:700'>${formatPrice(product.price)}</p>
              <button class='btn primary' id='modalAdd' data-id='${product.id}'>Add to cart</button>
            </div>
          </div>
        `);
        document.getElementById('modalAdd').addEventListener('click', e=>{ addToCart(product.id); closeModal(); });
      } else if(action==='add'){
        addToCart(product.id);
      }
    }
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', e=>{ if(e.target===modal) closeModal(); });
  document.addEventListener('keydown', e=>{
    if(e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false'){
      closeModal();
    }
  });

  const newsletterForm = document.getElementById('newsletterForm');
  if(newsletterForm) newsletterForm.addEventListener('submit', handleNewsletter);

  const contactForm = document.querySelector('#contact-page form');
  if(contactForm) contactForm.addEventListener('submit', handleContactForm);

  ['catFilter','priceFilter','materialFilter','sortFilter'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.addEventListener('change', e=>{
      filters[id.replace(/Filter$/,'')] = e.target.value;
      applyFilters();
    });
  });
}

// initialisation
document.addEventListener('DOMContentLoaded', ()=>{
  renderFeatured();
  loadCartCount();
  attachListeners();
  document.getElementById('year').textContent = new Date().getFullYear();
});
