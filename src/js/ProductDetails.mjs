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
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cart = getLocalStorage("so-cart") || [];
    cart.push(this.product);
    setLocalStorage("so-cart", cart);
  }

  renderProductDetails() {
    // Render the product details using the template function
    productDetailTemplate(this.product);
  }
}

function productDetailTemplate(product) {
  // Update product title and brand
  document.querySelector("h3").textContent = product.Brand.Name;
  document.querySelector("h2").textContent = product.NameWithoutBrand;

  // Check if the product has ExtraImages
  const carouselContainer = document.getElementById("imageCarousel");
  carouselContainer.innerHTML = ""; // Clear previous content

  if (product.Images.ExtraImages && product.Images.ExtraImages.length > 0) {
    renderImageCarousel(product);
  } else {
    renderSingleImage(product);
  }

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
      const productDetailSection = document.querySelector(".product-detail");
      productDetailSection.appendChild(discountElement);
  }
}

function renderImageCarousel(product) {
  const carouselContainer = document.getElementById("imageCarousel");

  // Create the main image element
  const mainImage = document.createElement("img");
  mainImage.id = "productImage";
  mainImage.src = product.Images.ExtraImages[0].src;
  mainImage.alt = product.Images.ExtraImages[0].title;
  carouselContainer.appendChild(mainImage);

  // Create thumbnail images
  const thumbnailsContainer = document.createElement("div");
  thumbnailsContainer.className = "thumbnails";

  product.ExtraImages.forEach((image, index) => {
      const thumbnail = document.createElement("img");
      thumbnail.src = image.ExtraImages.src;
      thumbnail.alt = image.ExtraImages.title;
      thumbnail.className = "thumbnail";
      thumbnail.addEventListener("click", () => {
          mainImage.src = image.ExtraImages.src;
      });
      thumbnailsContainer.appendChild(thumbnail);
  });

  carouselContainer.appendChild(thumbnailsContainer);
}

function renderSingleImage(product) {
  const carouselContainer = document.getElementById("imageCarousel");

  // Clear any existing content
  carouselContainer.innerHTML = "";

  const productImage = document.createElement("img");
  productImage.id = "productImage";
  productImage.src = product.Images.PrimaryExtraLarge;
  productImage.alt = product.NameWithoutBrand;
  carouselContainer.appendChild(productImage);
}
