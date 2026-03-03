const products = [
  {
    id: 'p1',
    title: 'Aria Sofa',
    price: 1499,
    img: 'https://images.unsplash.com/photo-1618221197111-8d2f6f2b2a94?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=3e4dbf3efc0f0e3f7e1f1c2d1a5a6b2c',
    desc: 'Elegant three-seater with plush cushions and solid wood frame.'
  },
  {
    id: 'p2',
    title: 'Oak Minimal Desk',
    price: 799,
    img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=9b6190a65f1f0cfa3b7f0c2a6b3d9d8e',
    desc: 'Hand-finished oak desk with integrated cable management.'
  },
  {
    id: 'p3',
    title: 'Luna Armchair',
    price: 599,
    img: 'https://images.unsplash.com/photo-1582582494707-9c4f6b2b3a3d?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=7a2b1a3c5d6e7f8a9b0c1d2e3f4a5b6c',
    desc: 'Compact armchair with curved back and high-density foam.'
  },
  {
    id: 'p4',
    title: 'Monroe Dining Table',
    price: 1699,
    img: 'https://images.unsplash.com/photo-1549187774-b4b1de44c5b7?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=6d7c8b9a0f1e2d3c4b5a6f7e8d9c0b1a',
    desc: 'Solid table seating six, finished with water-resistant coating.'
  },
  {
    id: 'p5',
    title: 'Haven Bed Frame',
    price: 1299,
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e',
    desc: 'Platform bed with upholstered headboard and slatted base.'
  },
  {
    id: 'p6',
    title: 'Arc Shelf',
    price: 299,
    img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
    desc: 'Modular shelving with warm timber and powder-coated steel.'
  }
];

const productGrid = document.getElementById('productGrid');
const cartCountEl = document.getElementById('cartCount');
const modal = document.getElementById('productModal');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

function formatPrice(n){return '$' + n.toLocaleString()}

function renderProducts(){
  productGrid.innerHTML = '';
  products.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
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
    productGrid.appendChild(card);
  });
}

function openModal(html){
  modalContent.innerHTML = html;
  modal.setAttribute('aria-hidden','false');
}

function closeModal(){
  modal.setAttribute('aria-hidden','true');
  modalContent.innerHTML = '';
}

function attachListeners(){
  productGrid.addEventListener('click', e=>{
    const btn = e.target.closest('button[data-action]');
    if(!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    const product = products.find(x=>x.id===id);
    if(action==='details'){
      openModal(`<div style="display:flex;gap:18px;align-items:flex-start"><img src='${product.img}' style='width:320px;height:auto;border-radius:8px;object-fit:cover' alt='${product.title}'/><div><h3>${product.title}</h3><p>${product.desc}</p><p style='font-weight:700'>${formatPrice(product.price)}</p><button class='btn primary' id='modalAdd' data-id='${product.id}'>Add to cart</button></div></div>`);
      document.getElementById('modalAdd').addEventListener('click', e=>{ addToCart(product.id); closeModal(); });
    } else if(action==='add'){
      addToCart(product.id);
    }
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', e=>{ if(e.target===modal) closeModal(); });

  document.getElementById('newsletterForm').addEventListener('submit', e=>{
    e.preventDefault();
    const email = document.getElementById('email').value;
    alert('Thanks — we will keep you updated: ' + email);
    e.target.reset();
  });
}

function addToCart(id){
  const key = 'cfs_cart';
  let cart = JSON.parse(localStorage.getItem(key) || '[]');
  cart.push(id);
  localStorage.setItem(key, JSON.stringify(cart));
  cartCountEl.textContent = cart.length;
}

function loadCartCount(){
  const key = 'cfs_cart';
  const cart = JSON.parse(localStorage.getItem(key) || '[]');
  cartCountEl.textContent = cart.length;
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderProducts();
  attachListeners();
  loadCartCount();
  document.getElementById('year').textContent = new Date().getFullYear();
});
