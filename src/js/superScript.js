import { getLocalStorage } from "./utils.mjs";
//This code is to set the quantity of products in the cart
const quantityOfItems = document.querySelector("#numberItems")
const len = getLocalStorage("so-cart").length;//we get the local storage and then we find the length
quantityOfItems.innerHTML = len;//finally we add that in the querySelector