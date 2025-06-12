import { getLocalStorage, setLocalStorage, loadHeaderFooter} from "./utils.mjs";

loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  const cartFooter = document.querySelector(".cart-footer");
  const totalDisplay = document.querySelector(".cart-total");

  if (cartItems.length > 0) {
    cartFooter.style.display = "block";
    const total = cartItems.reduce((sum, item) => sum + Number(item.FinalPrice), 0);
    totalDisplay.textContent = `Total: $${total.toFixed(2)}`;
  } else {
    cartFooter.style.display = "none";
    totalDisplay.textContent = "";
  }

  addRemoveListeners();
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images.PrimarySmall}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <button class="remove-button" data-id="${item.Id}">❌</button>
</li>`;

  return newItem;
}

function removeFromCart(id) {
  // console.log("Removing item with ID:", id);
  let cart = getLocalStorage("so-cart") || [];
  cart = cart.filter(item => item.Id !== id.toString());
  setLocalStorage("so-cart", cart);
  renderCartContents();
}

function addRemoveListeners() {
  document.querySelectorAll(".remove-button").forEach(btn => {
    btn.addEventListener("click", function () {
      const id = this.dataset.id;
      removeFromCart(id);
    });
  });
}

export { renderCartContents };

renderCartContents();