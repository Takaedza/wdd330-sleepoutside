import { getLocalStorage, setLocalStorage, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

const dataSource = new ProductData("tents");
const productId = getParam("product");
const product = new ProductDetails(productId, dataSource);

product.init();

function addProductToCart(product) {
  if (!product || !product.Id) {
    console.error("Invalid product data:", product);
    return;
  }
  
  // Get the current cart contents or initialize as empty array
  let cart = getLocalStorage("so-cart") || [];

  // If cart is not an array (could be a single item), convert it to an array
  if (!Array.isArray(cart)) {
    cart = [cart];
  }

  // Add the new product to cart array
  cart.push(product);

  // Save the updated cart
  setLocalStorage("so-cart", cart);
}

// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  console.log("Adding product to cart:", product);
  addProductToCart(product);

  // Small delay before reading back
  setTimeout(() => {
    console.log("Current cart contents:", getLocalStorage("so-cart"));
  }, 100);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
