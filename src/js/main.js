import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs";
import Alert from "./alert";

const dataSource = new ProductData("tents");
const listElement = document.querySelector(".product-list");
const productList = new ProductList("tents", dataSource, listElement);

function getSearchQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("search");
}

async function displayProducts() {
  const searchQuery = getSearchQuery();
  let products = await dataSource.getData();
  if (searchQuery) {
    products = products.filter(product =>
      product.NameWithoutBrand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.Brand.Name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  productList.renderList(products);
}

loadHeaderFooter().then(() => {
  const searchForm = document.getElementById("searchForm");
  if (searchForm) {
    searchForm.addEventListener("submit", function(event) {
      event.preventDefault();
      const query = document.getElementById("searchInput").value.trim();
      if (query) {
        window.location.href = `index.html?search=${encodeURIComponent(query)}`;
      }
    });
  }
  displayProducts();
});

new Alert();
