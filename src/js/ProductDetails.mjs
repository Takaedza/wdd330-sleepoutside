import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource){
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
    this.product = await this.dataSource.findProductById(this.productId);
    // the product details are needed before rendering the HTML
    // once the HTML is rendered, add a listener to the Add to Cart button
    this.renderProductDetails();
    // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on 'this' to understand why.
    
    document
      .getElementById("add-To-Cart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart(){
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails(){
    productDetailTemplate(this.product);
  }

}

function productDetailTemplate(product) {
  document.querySelector("h2").textContent = product.Category.charAt(0).toUpperCase() + product.Category.slice(1);
  document.querySelector("#p-brand").textContent = product.Brand.Name;
  document.querySelector("#p-name").textContent = product.NameWithoutBrand;

  const productImage = document.getElementById("#p-Image");
  productImage.src = product.Images.PrimaryExtraLarge;
  productImage.alt = product.NameWithoutBrand;
  const euroPrice = new Intl.NumberFormat("de-DE", {
    style: "currency", currency: "EUR",
  }).format(Number(product.FinalPrice) * 0.85);
  document.getElementById("#p-price").textContent = `${euroPrice}`;
  document.querySelector("#p-color").textContent = product.Colors[0].ColorName;
  document.querySelector("#p-description").innerHTML = product.DescriptionHtmlSimple;
  

    // document.getElementById("productPrice").textContent = `$${product.FinalPrice}`;
    // document.getElementById("productColor").textContent = product.Colors[0].ColorName;
    // document.getElementById("productDescription").innerHTML = product.DescriptionHtmlSimple;

  // document.getElementById("addToCart").dataset.id = product.Id;
  document.getElementById("#add-To-Cart").dataset.id = product.Id;
  }