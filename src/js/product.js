import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { getParam , loadHeaderFooter} from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

const productId = getParam("product");
const dataSource = new ProductData("tents");

const product = new ProductDetails(productId, dataSource);
product.init();

loadHeaderFooter();

// // add to cart button event handler
// async function addToCartHandler(e) {
//   const product = await dataSource.findProductById(e.target.dataset.id);
//   addProductToCart(product);
// }

// add listener to Add to Cart button
//document
//  .getElementById("addToCart")
//  .addEventListener("click", addToCartHandler);

//This code is to set the quantity of products in the cart
const quantityOfItems = document.querySelector("#numberItems")
const len = getLocalStorage("so-cart").length;//we get the local storage and then we find the length
quantityOfItems.innerHTML = len;//finally we add that in the querySelector
