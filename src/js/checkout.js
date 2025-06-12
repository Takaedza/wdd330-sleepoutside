import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const checkout = new CheckoutProcess("so-cart", ".order-summary");
checkout.init();

document.querySelector("#zip").addEventListener("blur", () => {
  checkout.calculateOrderTotal();
});

const form = document.forms["checkout-form"];
form.addEventListener("submit", (e) => {
  e.preventDefault();
  checkout.checkout(form);
});