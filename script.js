const products = [
  {
    id: 'p1',
    title: 'Aria Sofa',
    price: 1499,
    img: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
    desc: 'Elegant three-seater with plush cushions and solid wood frame.'
  },
  {
    id: 'p2',
    title: 'Oak Minimal Desk',
    price: 799,
    img: 'https://images.pexels.com/photos/3785822/pexels-photo-3785822.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
    desc: 'Hand-finished oak desk with integrated cable management.'
  },
  {
    id: 'p3',
    title: 'Luna Armchair',
    price: 599,
    img: 'https://images.pexels.com/photos/1128949/pexels-photo-1128949.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
    desc: 'Compact armchair with curved back and high-density foam.'
  },
  {
    id: 'p4',
    title: 'Monroe Dining Table',
    price: 1699,
    img: 'https://images.pexels.com/photos/621146/pexels-photo-621146.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
    desc: 'Solid table seating six, finished with water-resistant coating.'
  },
  {
    id: 'p5',
    title: 'Haven Bed Frame',
    price: 1299,
    img: 'https://images.pexels.com/photos/375909/pexels-photo-375909.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
    desc: 'Platform bed with upholstered headboard and slatted base.'
  },
  {
    id: 'p6',
    title: 'Arc Shelf',
    price: 299,
    img: 'https://images.pexels.com/photos/6471148/pexels-photo-6471148.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
    desc: 'Arched shelving unit with adjustable panels.'
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
  // close modal with Esc key when open
  document.addEventListener('keydown', e=>{
    if(e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false'){
      closeModal();
    }
  });

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
  // avoid duplicates – store as counts
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

document.addEventListener('DOMContentLoaded', ()=>{
  renderProducts();
  attachListeners();
  loadCartCount();
  document.getElementById('year').textContent = new Date().getFullYear();
});
