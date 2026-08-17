const PRODUCTS = [
  {id:"ps4", name:"PlayStation 4", category:"consoles", price:45000, emoji:"🎮", tag:"POPULAIRE", image:"ps4slim.png"},

  {id:"ps3", name:"PlayStation 5", category:"consoles", price:28000, emoji:"🕹️", image:"ps5slim.png"},
  {id:"manatte", name:"Manette xbox sereis S/X  ", category:"consoles", price:4000, emoji:"🔥", tag:"NOUVEAU", image:"manatexbox.png"},
  {id:"spiderman", name:" Marvel's Spider-Man ", category:"games", price:6500, emoji:"🕷️", image:"spidermanps5.png"},
  {id:"manatte", name:" Manette ps5", category:"consoles", price:4000, emoji:"⚔️", image:"manatteps5.png"},
  {id:"fc 27", name:"  Fc 27 ", category:"games", price:3000, emoji:"⚽", image:"fc27ps5.png"
  },
{id:"xbox one s", name:"Xbox one S", category:"consoles", price:40000, emoji:"💾", image:"xboxones.png"},
 



  {id:"headset6607", name:"Gaming Headset HayperX ", category:"accessories", price:4500, emoji:"🎧", tag:"BEST SELLER", image:"headset.png"},
  {id:"mouse ", name:"Mouse ", category:"accessories", price:3900, emoji:"🎧", image:"logitechmouse.png"},
  {id:"kebored", name:"kebored ", category:"accessories", price:7500, emoji:"⌨️", tag:"PACK", image:"apexprominigen3.png"},
  {id:"xbox serire s", name:"Xbox serire S", category:"consoles", price:70000, emoji:"💾", image:"xboxseriress.png"},
 {id:"xbox serire X", name:"Xbox serire x", category:"consoles", price:70000, emoji:"💾", image:"xboxserirex.png"},
 
];

const WILAYAS = [
"01 - Adrar","02 - Chlef","03 - Laghouat","04 - Oum El Bouaghi","05 - Batna","06 - Béjaïa",
"07 - Biskra","08 - Béchar","09 - Blida","10 - Bouira","11 - Tamanrasset","12 - Tébessa",
"13 - Tlemcen","14 - Tiaret","15 - Tizi Ouzou","16 - Alger","17 - Djelfa","18 - Jijel",
"19 - Sétif","20 - Saïda","21 - Skikda","22 - Sidi Bel Abbès","23 - Annaba","24 - Guelma",
"25 - Constantine","26 - Médéa","27 - Mostaganem","28 - M'Sila","29 - Mascara","30 - Ouargla",
"31 - Oran","32 - El Bayadh","33 - Illizi","34 - Bordj Bou Arréridj","35 - Boumerdès",
"36 - El Tarf","37 - Tindouf","38 - Tissemsilt","39 - El Oued","40 - Khenchela",
"41 - Souk Ahras","42 - Tipaza","43 - Mila","44 - Aïn Defla","45 - Naâma","46 - Aïn Témouchent",
"47 - Ghardaïa","48 - Relizane","49 - Timimoun","50 - Bordj Badji Mokhtar","51 - Ouled Djellal",
"52 - Béni Abbès","53 - In Salah","54 - In Guezzam","55 - Touggourt","56 - Djanet",
"57 - El Meghaier","58 - El Meniaa"
];

let cart = JSON.parse(localStorage.getItem("gameShopCart") || "[]");
let activeCategory = "all";

const grid = document.getElementById("productGrid");
const empty = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const checkoutModal = document.getElementById("checkoutModal");

const money = n => new Intl.NumberFormat("fr-DZ").format(n) + " DA";
const productById = id => PRODUCTS.find(p => p.id === id);

function saveCart(){ localStorage.setItem("gameShopCart", JSON.stringify(cart)); }

function renderProducts(){
  const q = searchInput.value.trim().toLowerCase();
  const list = PRODUCTS.filter(p =>
    (activeCategory === "all" || p.category === activeCategory || (activeCategory === "offers" && p.tag)) &&
    p.name.toLowerCase().includes(q)
  );
  grid.innerHTML = list.map(p => `
    <article class="product">
      <div class="product-img">
        ${p.tag ? `<span class="tag">${p.tag}</span>` : ""}
        <img src="${p.image}" alt="${p.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
        <span class="product-emoji" style="display:none">${p.emoji}</span>
      </div>
      <div class="product-info">
        <div class="product-category">${p.category.toUpperCase()}</div>
        <h3>${p.name}</h3>
        <div class="product-bottom">
          <div class="price">${money(p.price)}</div>
          <button class="add" onclick="addToCart('${p.id}')" aria-label="Ajouter au panier">+</button>
        </div>
      </div>
    </article>
  `).join("");
  empty.hidden = list.length !== 0;
}

function addToCart(id){
  const item = cart.find(x => x.id === id);
  if(item) item.qty++;
  else cart.push({id, qty:1});
  saveCart(); renderCart(); openCart();
  toast("Produit ajouté au panier ✓");
}

function changeQty(id, delta){
  const item = cart.find(x => x.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) cart = cart.filter(x => x.id !== id);
  saveCart(); renderCart();
}

function renderCart(){
  let total = 0, count = 0;
  document.getElementById("cartItems").innerHTML = cart.length ? cart.map(item => {
    const p = productById(item.id);
    if(!p) return "";
    total += p.price * item.qty; count += item.qty;
    return `<div class="cart-item">
      <div class="cart-thumb">${p.emoji}</div>
      <div><h4>${p.name}</h4><small>${money(p.price)}</small>
        <div class="qty"><button onclick="changeQty('${p.id}',-1)">−</button><b>${item.qty}</b><button onclick="changeQty('${p.id}',1)">+</button></div>
      </div>
      <button class="remove" onclick="changeQty('${p.id}',-${item.qty})">Suppr.</button>
    </div>`;
  }).join("") : `<div style="text-align:center;color:#7f8a99;padding:70px 15px">Votre panier est vide 🎮</div>`;
  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTotal").textContent = money(total);
}

function openCart(){cartDrawer.classList.add("open");overlay.classList.add("show")}
function closeCart(){cartDrawer.classList.remove("open");overlay.classList.remove("show")}

function openCheckout(){
  if(!cart.length){ toast("Ajoutez au moins un produit."); return; }
  closeCart();
  checkoutModal.classList.add("show");
}
function closeCheckout(){checkoutModal.classList.remove("show")}

function toast(msg){
  const t=document.getElementById("toast"); t.textContent=msg; t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),2200);
}

document.querySelectorAll(".cat").forEach(btn => btn.addEventListener("click",()=>{
  document.querySelectorAll(".cat").forEach(x=>x.classList.remove("active"));
  btn.classList.add("active"); activeCategory=btn.dataset.category; renderProducts();
}));
searchInput.addEventListener("input",renderProducts);
document.getElementById("openCart").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
overlay.onclick=closeCart;
document.getElementById("checkoutBtn").onclick=openCheckout;
document.getElementById("closeModal").onclick=closeCheckout;
document.getElementById("clearCart").onclick=()=>{cart=[];saveCart();renderCart();toast("Panier vidé.");};

const wilayaSelect=document.getElementById("wilaya");
wilayaSelect.innerHTML='<option value="">Choisir une wilaya</option>'+WILAYAS.map(w=>`<option>${w}</option>`).join("");

document.getElementById("orderForm").addEventListener("submit", e=>{
  e.preventDefault();
  const data=new FormData(e.target);
  const lines=cart.map(item=>{
    const p=productById(item.id);
    return `• ${p.name} x${item.qty} — ${money(p.price*item.qty)}`;
  });
  const total=cart.reduce((sum,item)=>sum+productById(item.id).price*item.qty,0);
  const msg =
`🎮 *NOUVELLE COMMANDE — ORAN GAME DZ*

🛒 *Produits:*
${lines.join("\n")}

💰 *Total: ${money(total)}*

👤 *Client:* ${data.get("name")}
📞 *Téléphone:* ${data.get("phone")}
📍 *Wilaya:* ${data.get("wilaya")}
🏙️ *Commune:* ${data.get("commune")}
🏠 *Adresse:* ${data.get("address")}
📝 *Note:* ${data.get("note") || "Aucune"}

Merci !`;

  // Business WhatsApp number from the supplied Game Shop ORAN information.
  const whatsappNumber="213778519943";
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`,"_blank");
});

renderProducts();
renderCart();
