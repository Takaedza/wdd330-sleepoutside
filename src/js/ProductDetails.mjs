import { getLocalStorage, setLocalStorage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.dataSource = dataSource;
    this.product = {};
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    document.getElementById('addToCart')
      .addEventListener('click', this.addToCart.bind(this));
  }

  renderProductDetails() {
    document.querySelector('#productName').textContent = this.product.Name;
    document.querySelector('#productNameWithoutBrand').textContent = 
      this.product.NameWithoutBrand;
    document.querySelector('#productImage').src = this.product.Image;
    document.querySelector('#productImage').alt = this.product.Name;
    document.querySelector('#productFinalPrice').textContent = 
      `$${this.product.FinalPrice}`;
    document.querySelector('#productColorName').textContent = 
      this.product.Colors[0].ColorName;
    document.querySelector('#productDescriptionHtmlSimple').innerHTML = 
      this.product.DescriptionHtmlSimple;
    document.querySelector('#addToCart').dataset.id = this.product.Id;
  }

  addToCart() {
    // Get current cart or initialize as empty array
    let cart = getLocalStorage('so-cart') || [];
    
    // If cart is not an array, convert it to an array
    if (!Array.isArray(cart)) {
      cart = [cart];
    }
    
    // Add the product to cart
    cart.push(this.product);
    
    // Save to localStorage
    setLocalStorage('so-cart', cart);
  }
}