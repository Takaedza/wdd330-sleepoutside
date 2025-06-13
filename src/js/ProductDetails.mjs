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
      .getElementById("addToCart")
      .addEventListener("click", this.addToCart.bind(this));
  }

  addProductToCart() {
    const cart = getLocalStorage("so-cart") || [];
    cart.push(this.product);
    setLocalStorage("so-cart", cart);
  }

  renderProductDetails() {
    productDetailTemplate(this.product);
    // eslint-disable-next-line no-console
    console.log("a", this.product)
  }
}

function productDetailTemplate(product) {
    document.querySelector("h3").textContent = product.Brand.Name;
    document.querySelector("h2").textContent = product.NameWithoutBrand;

    const productImage = document.getElementById("productImage");
    productImage.src = product.Image;
    productImage.alt = product.NameWithoutBrand;

    document.getElementById("productPrice").textContent = `$${product.FinalPrice}`;
    document.getElementById("productColor").textContent = product.Colors[0].ColorName;
    document.getElementById("productDescription").innerHTML = product.DescriptionHtmlSimple;

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
