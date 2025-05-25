import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const category = getParam("category");
// first create an instance of the ProductData class.
const dataSource = new ProductData();
// then get the element you want the product list to render in
const listElement = document.querySelector(".product-list");
// then create an instance of the ProductList class and send it the correct information.
const myList = new ProductList(category, dataSource, listElement);
// finally call the init method to show the products
myList.init();

const category_title = document.querySelector("#category-title"); //this code is to select a span tag
//to set the category title of each page

category_title.innerHTML =
  category[0].toUpperCase() + category.slice(1).toLowerCase(); // to add ir and set the first word as upper

//this following code is to sort the list of the products
const sortByLetter = document.querySelector("#sort-by-letter");
const sortByPrice = document.querySelector("#sort-by-price");

sortByLetter.addEventListener("click", sortListByLetter);
sortByPrice.addEventListener("click", sortListByPrice);

function sortListByLetter() {
  const items = Array.from(listElement.querySelectorAll("li")); //this is useful to select every card and not only a h2 tag
  items.sort((a, b) => {
    const titleA = a.querySelector("h2").textContent; //we select the correct tag to compare later
    const titleB = b.querySelector("h2").textContent;
    return titleA.localeCompare(titleB);
  }); //This code is to compare the titles of each card
  listElement.innerHTML = "";
  items.forEach((item) => listElement.appendChild(item));
}

function sortListByPrice() {
  const items = Array.from(listElement.querySelectorAll("li")); //this is useful to select every card and not only a h2 tag
  items.sort((a, b) => {
    const priceA = a.querySelector(".product-card__price").textContent.slice(1); //we select the correct tag to compare later
    const priceB = b.querySelector(".product-card__price").textContent.slice(1);
    return parseFloat(priceA) - parseFloat(priceB);
  }); //This code is to compare the titles of each card
  listElement.innerHTML = "";
  items.forEach((item) => listElement.appendChild(item));
}

/*
const dataSource = new ProductData("tents");
const listElement = document.querySelector(".product-list");
const productList = new ProductList("tents", dataSource, listElement);

productList.init();

*/
