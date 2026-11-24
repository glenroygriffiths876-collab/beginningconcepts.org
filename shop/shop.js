const scents = [
  {id:"golden-hour",name:"Golden Hour",family:"Citrus",notes:"Bitter orange · Neroli · Cedar",story:"Bright orange peel opens into soft neroli, with a dry cedar finish that lingers like late afternoon light.",price:4800},
  {id:"sea-glass",name:"Sea Glass",family:"Fresh",notes:"Sea salt · Lime leaf · Musk",story:"A crisp lime-leaf opening gives way to a sea-salt accord and a soft, clean musk.",price:4400},
  {id:"sorrel-dusk",name:"Sorrel Dusk",family:"Spiced",notes:"Hibiscus · Ginger · Amber",story:"Tart hibiscus meets fresh ginger before settling into the warmth of amber.",price:5400},
  {id:"fern-house",name:"Fern House",family:"Green",notes:"Fern · Vetiver · Green tea",story:"Green tea and crushed fern leaves carry a cool, earthy vetiver base.",price:5000}
];
const sizes = [30,50];
const money = n => "J$" + n.toLocaleString("en-JM");
const price = (s,size) => s.price + (size === 50 ? 2000 : 0);
const el = selector => document.querySelector(selector);
const details = el("#details"), bag = el("#bag");
const selected = new Map();
let family = "All", cart = {}, noticeTimer;
try {
  const saved = JSON.parse(sessionStorage.getItem("sg-bag-v1") || "{}");
  for (const s of scents) for (const size of sizes) {
    const key = s.id + ":" + size;
    if (Number.isInteger(saved[key]) && saved[key] > 0 && saved[key] <= 99) cart[key] = saved[key];
  }
} catch {}
function notify(message) {
  clearTimeout(noticeTimer);
  el("#notice").textContent = message;
  noticeTimer = setTimeout(() => el("#notice").textContent = "", 2200);
}
function changeQuantity(s,size,delta) {
  const key = s.id + ":" + size;
  const next = Math.min(99,Math.max(0,(cart[key] || 0) + delta));
  if (next) cart[key] = next;
  else delete cart[key];
  try { sessionStorage.setItem("sg-bag-v1",JSON.stringify(cart)); } catch {}
  el("#count").textContent = Object.values(cart).reduce((a,b) => a+b,0);
}
function buyControls(root,s,priceNode) {
  const select = root.querySelector("select");
  select.setAttribute("aria-label", s.name + " bottle size");
  for (const size of sizes) select.add(new Option(size + " ml",size));
  select.value = selected.get(s.id) || 30;
  function update() {
    selected.set(s.id,Number(select.value));
    priceNode.textContent = money(price(s,Number(select.value)));
  }
  update();
  select.addEventListener("change",update);
  root.querySelector(".add").addEventListener("click",() => {
    changeQuantity(s,Number(select.value),1);
    if (details.open) details.close();
    showBag();
  });
}
const pairings = {
  "golden-hour": ["sea-glass", "Prefer a fresher citrus?"],
  "sea-glass": ["fern-house", "Like fresh scents with a greener finish?"],
  "fern-house": ["golden-hour", "Try a brighter take on woody notes."],
  "sorrel-dusk": ["golden-hour", "Explore a lighter, sun-warmed scent."]
};
function openDetails(s, recommendation = false) {
  el("#detail-body").innerHTML = '<img alt=""><p class="label"></p><h2 id="scent-title"></h2><p class="story"></p><dl class="detail-notes"></dl><strong class="price"></strong><div class="buy"><select></select><button class="add">Add to bag +</button></div>';
  const body = el("#detail-body");
  body.querySelector("img").src = s.id+".webp";
  body.querySelector(".label").textContent = "Demo · " + (recommendation ? "Your scent match · " : "") + s.family+" · Eau de parfum";
  body.querySelector("h2").textContent = s.name;
  body.querySelector(".story").textContent = s.story;
  const layers = ["Opening", "Heart", "Base"];
  s.notes.split(" · ").forEach((note,index) => {
    const pair = document.createElement("div");
    const term = document.createElement("dt");
    const value = document.createElement("dd");
    term.textContent = layers[index];
    value.textContent = note;
    pair.append(term,value);
    body.querySelector(".detail-notes").append(pair);
  });
  buyControls(body,s,body.querySelector(".price"));
  details.setAttribute("aria-labelledby","scent-title");
  const actions = document.createElement("div");
  actions.className = "scent-links";
  const share = document.createElement("a");
  share.textContent = "Share on WhatsApp";
  share.target = "_blank";
  share.rel = "noopener noreferrer";
  const select = body.querySelector("select");
  function setShareLink() {
    const product = new URL(s.id + "/", location.href);
    product.searchParams.set("size", select.value);
    share.href = "https://wa.me/?text=" + encodeURIComponent(s.name + " · " + select.value + " ml | Salt & Grove demo\n" + product.href);
  }
  select.addEventListener("change", setShareLink);
  setShareLink();
  const [otherId, reason] = pairings[s.id];
  const other = scents.find(item => item.id === otherId);
  const suggestion = document.createElement("button");
  suggestion.textContent = reason + " Explore " + other.name + " →";
  suggestion.onclick = () => openDetails(other);
  actions.append(share,suggestion);
  body.append(actions);
  if (!details.open) details.showModal();
  else {
    details.scrollTop = 0;
    details.querySelector(".close").focus();
  }
}
const finder = el("#finder");
const preferences = {
  "golden-hour":"Bright citrus peel", "sea-glass":"Salt air and lime",
  "sorrel-dusk":"Warm ginger and spice", "fern-house":"Rain on green leaves"
};
for (const scent of scents) {
  const choice = document.createElement("button");
  const image = document.createElement("img");
  image.src = scent.id+".webp";
  image.alt = "";
  image.loading = "lazy";
  const caption = document.createElement("span");
  caption.textContent = preferences[scent.id];
  choice.append(image, caption);
  choice.onclick = () => {
    finder.close();
    openDetails(scent,true);
  };
  el("#choices").append(choice);
}
el("#finder-open").onclick = () => finder.showModal();
function render() {
  const list = scents.filter(s => family === "All" || family === s.family);
  const sort = el("#sort").value;
  if (sort !== "featured") list.sort((a,b) => (a.price-b.price)*(sort === "low" ? 1 : -1));
  const grid = el("#grid");
  grid.replaceChildren();
  for (const s of list) {
    const card = el("#product").content.cloneNode(true);
    card.querySelector("img").src = s.id+".webp";
    card.querySelector(".photo").setAttribute("aria-label","View "+s.name+" fragrance");
    card.querySelector("h3 button").textContent = s.name;
    card.querySelector(".notes").textContent = s.notes;
    card.querySelectorAll("[data-detail]").forEach(btn => btn.onclick = () => openDetails(s));
    buyControls(card,s,card.querySelector(".price"));
    grid.append(card);
  }
}
for (const name of ["All",...scents.map(s => s.family)]) {
  const btn = document.createElement("button");
  btn.textContent = name;
  btn.setAttribute("aria-pressed",name === family);
  btn.onclick = () => {
    family = name;
    el(".filters").querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed",b===btn));
    render();
    notify(name === "All" ? "Showing all four fragrances" : "Showing "+name.toLowerCase()+" fragrances");
  };
  el(".filters").append(btn);
}
function showCheckoutStep(template, title) {
  const body = el("#bag-body");
  body.replaceChildren(el(template).content.cloneNode(true));
  const heading = bag.querySelector("h2");
  heading.textContent = title;
  heading.focus();
  bag.scrollTop = 0;
  return body;
}
let lastOrder;
try {
  const saved = JSON.parse(sessionStorage.getItem("sg-last-order") || "null");
  if (saved && Array.isArray(saved.lines) && Array.isArray(saved.activity) &&
      Number.isFinite(saved.total) && ["delivery","pickup"].includes(saved.method)) lastOrder = saved;
} catch {}
function saveOrder(order) {
  lastOrder = order;
  try { sessionStorage.setItem("sg-last-order", JSON.stringify(order)); } catch {}
}
function showOwner(order) {
  const panel = showCheckoutStep("#owner-view","Order details");
  panel.querySelector(".order-id").textContent = order.id;
  panel.querySelector(".order-lines").textContent = order.lines.join("\n");
  panel.querySelector(".fulfilment").textContent = order.fulfilment;
  panel.querySelector(".subtotal strong").textContent = money(order.total);
  const nextStatus = order.method === "delivery" ? "Out for delivery" : "Ready for pickup";
  const advance = panel.querySelector(".advance");
  function renderActivity() {
    const list = panel.querySelector(".activity");
    list.replaceChildren();
    for (const event of order.activity) {
      const item = document.createElement("li");
      item.textContent = event.status + " · " + new Date(event.at).toLocaleTimeString([], {hour:"numeric",minute:"2-digit"});
      list.append(item);
    }
    advance.hidden = order.activity.length > 1;
  }
  advance.textContent = "Mark " + nextStatus.toLowerCase();
  advance.onclick = () => {
    if (order.activity.length > 1) return;
    order.activity.push({status:nextStatus,at:Date.now()});
    saveOrder(order);
    renderActivity();
    panel.querySelector(".back-step").focus();
  };
  panel.querySelector(".back-step").onclick = () => bag.close();
  renderActivity();
}
function checkout(lines, subtotal, delivery = "pickup") {
  const body = showCheckoutStep("#checkout-options", "Demo checkout");
  body.querySelector('input[value="' + delivery + '"]').checked = true;
  body.querySelector(".back-step").onclick = () => {
    showBag();
    bag.querySelector("h2").focus();
  };
  body.querySelector(".checkout").onclick = () => {
    const method = body.querySelector("input:checked").value;
    const fee = method === "delivery" ? 500 : 0;
    const fulfilment = fee ? "Sample delivery · " + money(fee) : "Sample pickup · Free";
    function fillSummary(panel) {
      panel.querySelector(".order-lines").textContent = lines.join("\n");
      panel.querySelector(".fulfilment").textContent = fulfilment;
      panel.querySelector(".subtotal strong").textContent = money(subtotal + fee);
    }
    const review = showCheckoutStep("#checkout-review", "Review demo order");
    fillSummary(review);
    review.querySelector(".back-step").onclick = () => checkout(lines, subtotal, method);
    review.querySelector(".checkout").onclick = () => {
      cart = {};
      try { sessionStorage.removeItem("sg-bag-v1"); } catch {}
      el("#count").textContent = "0";
      const confirmation = showCheckoutStep("#checkout-complete", "Demo order confirmed");
      fillSummary(confirmation);
      const order = {id:"Demo order " + crypto.randomUUID().slice(0,8).toUpperCase(), lines:[...lines],
        method, fulfilment, total:subtotal+fee, activity:[{status:"Order received",at:Date.now()}]};
      saveOrder(order);
      confirmation.querySelector(".owner-open").onclick = () => showOwner(order);
      confirmation.querySelector(".continue").onclick = () => {
        bag.close();
        el("#bag-open").focus();
      };
    };
  };
}
function showBag() {
  bag.querySelector("h2").textContent = "Your bag";
  const body = el("#bag-body");
  body.replaceChildren();
  let total = 0;
  const lines = [];
  for (const s of scents) for (const size of sizes) {
    const qty = cart[s.id+":"+size];
    if (!qty) continue;
    const amount = qty*price(s,size);
    total += amount;
    lines.push(qty+" × "+s.name+" ("+size+" ml) — "+money(amount));
    const row = document.createElement("div");
    row.className = "bag-line";
    row.innerHTML = '<img alt=""><div class="line-copy"><strong></strong><small></small></div><div class="qty"><button>−</button><span></span><button>+</button></div>';
    row.querySelector("img").src=s.id+".webp";
    row.querySelector("strong").textContent=s.name;
    row.querySelector("small").textContent=size+" ml · "+money(amount);
    row.querySelector(".qty span").textContent=qty;
    row.querySelectorAll("button").forEach((b,i) => {
      const label=(i ? "Add one " : "Remove one ")+s.name+" "+size+" ml";
      b.setAttribute("aria-label",label);
      b.disabled=i===1 && qty===99;
      b.onclick=() => {
        changeQuantity(s,size,i ? 1 : -1);
        showBag();
        (body.querySelector('[aria-label="'+label+'"]:not(:disabled)') || bag.querySelector(".close")).focus();
      };
    });
    body.append(row);
  }
  if (total) {
    const summary = document.createElement("div");
    summary.innerHTML='<div class="subtotal"><span>Subtotal · JMD</span><span></span></div><button class="checkout">Start demo checkout</button><p class="hint">Try delivery and payment with sample details.</p>';
    summary.querySelector(".subtotal span:last-child").textContent=money(total);
    summary.querySelector("button").onclick=() => checkout(lines,total);
    body.append(summary);
  } else body.textContent="Your bag is empty. Explore the collection to add a fragrance.";
  if (lastOrder) {
    const previous = document.createElement("button");
    previous.className = "back-step";
    previous.textContent = "View latest demo order as owner";
    previous.onclick = () => showOwner(lastOrder);
    body.append(previous);
  }
  if (!bag.open) bag.showModal();
}
el("#count").textContent = Object.values(cart).reduce((a,b)=>a+b,0);
el("#bag-open").onclick=showBag;
el("#sort").onchange=render;
for (const dialog of [details,bag,finder]) {
  dialog.querySelector(".close").onclick=()=>dialog.close();
}
details.addEventListener("close",()=> {
  for (const select of el("#grid").querySelectorAll("select")) {
    const s=scents.find(item=>select.getAttribute("aria-label")===item.name+" bottle size");
    select.value=selected.get(s.id);
    select.dispatchEvent(new Event("change"));
  }
});
render();
const entry = new URLSearchParams(location.search);
const sharedScent = scents.find(s => s.id === entry.get("scent"));
if (sharedScent) {
  const sharedSize = Number(entry.get("size"));
  if (sizes.includes(sharedSize)) selected.set(sharedScent.id,sharedSize);
  openDetails(sharedScent);
}
