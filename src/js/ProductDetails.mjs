import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // Use the datasource to get the details for the current product
    this.product = await this.dataSource.findProductById(this.productId);
    // Render the product details
    this.renderProductDetails();

    document
      .getElementById("add-To-Cart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart(){
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
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

    document.getElementById("addToCart").dataset.id = product.Id;

    // Calculate discount
    const hasDiscount = product.FinalPrice < product.SuggestedRetailPrice;
    const discount = hasDiscount
        ? (product.SuggestedRetailPrice - product.FinalPrice).toFixed(2)
        : null;

    // Add discount information if applicable
    if (hasDiscount) {
        const discountText = `$${discount} OFF`;
        const discountElement = document.createElement("p");
        discountElement.className = "product-card__discount rposition";
        discountElement.textContent = discountText;

        // Append the discount element to the product detail section
        const productDetailSection = document.querySelector(".product-detail");
        productDetailSection.appendChild(discountElement);
    }
}
