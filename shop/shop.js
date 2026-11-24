const products = [
  { name: "Pocket notebook", price: 450, colour: "#2e5853", quantity: 0 },
  { name: "Study journal", price: 850, colour: "#98502d", quantity: 0 },
  { name: "Sketchbook", price: 1200, colour: "#254766", quantity: 0 }
];
const money = amount => "J$" + amount.toLocaleString("en-JM");
const preview = document.querySelector("#preview");
const message = document.querySelector("#message");
function updateOrder() {
  const count = products.reduce((sum, item) => sum + item.quantity, 0);
  const total = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.querySelector("#summary").textContent = count
    ? count + (count === 1 ? " notebook" : " notebooks") + " · Total " + money(total)
    : "Your basket is empty.";
  preview.disabled = count === 0;
  message.hidden = true;
  return total;
}
for (const product of products) {
  const row = document.createElement("article");
  row.className = "product";
  row.style.setProperty("--cover", product.colour);
  row.innerHTML = '<span class="book" aria-hidden="true"></span><div><h3></h3><p class="price"></p></div><div class="controls"><button type="button">−</button><span>0</span><button type="button">+</button></div>';
  row.querySelector("h3").textContent = product.name;
  row.querySelector(".price").textContent = money(product.price);
  const [minus, plus] = row.querySelectorAll("button");
  minus.setAttribute("aria-label", "Remove one " + product.name);
  plus.setAttribute("aria-label", "Add one " + product.name);
  minus.disabled = true;
  function change(amount) {
    product.quantity += amount;
    row.querySelector(".controls span").textContent = product.quantity;
    minus.disabled = product.quantity === 0;
    updateOrder();
  }
  minus.addEventListener("click", () => change(-1));
  plus.addEventListener("click", () => change(1));
  document.querySelector("#products").append(row);
}
preview.addEventListener("click", () => {
  const lines = products.filter(item => item.quantity).map(item =>
    item.quantity + " × " + item.name + " — " + money(item.price * item.quantity));
  document.querySelector("#message-text").textContent =
    ["Hello! I’d like to order", ...lines, "Total " + money(updateOrder())].join("\n");
  message.hidden = false;
  message.setAttribute("tabindex", "-1");
  message.focus();
});
