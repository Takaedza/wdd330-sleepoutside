import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const category = getParam("category");
const dataSource = new ProductData();
const listElement = document.querySelector(".product-list")
const productList = new ProductList(category, dataSource, listElement)

const productCategory = document.getElementById("top-prod-category");
const modStr = category[0].toUpperCase() + category.slice(1);
productCategory.textContent = `Top Products: ${modStr}`

productList.init();