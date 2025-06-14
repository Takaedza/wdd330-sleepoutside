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
    const productToAdd = { ...this.product, selectedColor: this.product.selectedColor };
    cart.push(productToAdd);
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
  if (product.Images.ExtraImages && product.Images.ExtraImages.length > 0) {
    renderImageCarousel(product);
  } else {
    renderSingleImage(product);
  }

  document.getElementById("productPrice").textContent = `$${product.FinalPrice}`;
  document.getElementById("productColor").textContent = product.Colors[0].ColorName;
  document.getElementById("productDescription").innerHTML = product.DescriptionHtmlSimple;
  // Render color swatches if more than one color
const swatchContainer = document.getElementById("colorSwatches");
// eslint-disable-next-line no-console
console.log("gh", product)
swatchContainer.innerHTML = ""; // Clear previous swatches

if (product.Colors && product.Colors.length > 1) {
  product.Colors.forEach((color, idx) => {
    const swatch = document.createElement("img");
    swatch.src = color.SwatchImageUrl; // Assuming this is the swatch image URL
    swatch.alt = color.ColorName;
    swatch.title = color.ColorName;
    swatch.className = "color-swatch";
    swatch.dataset.index = idx;

    // Highlight the first color by default
    if (idx === 0) swatch.classList.add("selected");

    // Click handler for selecting a color
    swatch.addEventListener("click", function() {
      // Remove 'selected' class from all swatches
      document.querySelectorAll(".color-swatch").forEach(s => s.classList.remove("selected"));
      // Add 'selected' to clicked swatch
      this.classList.add("selected");

      // Update displayed color name
      document.getElementById("productColor").textContent = color.ColorName;

      // Optionally, update main image if images are color-specific
      // mainImage.src = color.ImageUrl; // Uncomment if you have color-specific images

      // Store selected color in product object for cart
      product.selectedColor = color;
    });

    swatchContainer.appendChild(swatch);
  });

  // Set the default selected color
  product.selectedColor = product.Colors[0];
} else if (product.Colors && product.Colors.length === 1) {
  // Only one color, set as selected
  product.selectedColor = product.Colors[0];
}

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
  carouselContainer.innerHTML = ""; // Clear previous content

  // Create the main image element using the PrimaryLarge image
  const mainImage = document.createElement("img");
  mainImage.id = "productImage";
  mainImage.src = product.Images.PrimaryLarge; // Set to the primary large image
  mainImage.alt = product.NameWithoutBrand;
  carouselContainer.appendChild(mainImage);

  // Create thumbnail images
  const thumbnailsWrapper = document.querySelector(".thumbnails-wrapper");
  thumbnailsWrapper.innerHTML = ""; // Clear previous thumbnails

  // Add primary image as the first thumbnail
  const primaryThumbnail = document.createElement("img");
  primaryThumbnail.src = product.Images.PrimarySmall; // Use PrimarySmall for thumbnail
  primaryThumbnail.alt = `${product.NameWithoutBrand} Primary Image`;
  primaryThumbnail.className = "thumbnail";
  primaryThumbnail.addEventListener("click", () => {
      mainImage.src = product.Images.PrimaryLarge; // Change main image to primary large on click
  });
  thumbnailsWrapper.appendChild(primaryThumbnail);

  // Add extra images as thumbnails
  product.Images.ExtraImages.forEach((image, index) => {
      const thumbnail = document.createElement("img");
      thumbnail.src = image.Src; // Use the Src from ExtraImages
      thumbnail.alt = `${product.NameWithoutBrand} ${image.Title} ${index + 1}`;
      thumbnail.className = "thumbnail";
      thumbnail.addEventListener("click", () => {
          mainImage.src = image.Src; // Change main image on thumbnail click
      });
      thumbnailsWrapper.appendChild(thumbnail);
  });
}

function renderSingleImage(product) {
  const carouselContainer = document.getElementById("imageCarousel");
  carouselContainer.innerHTML = ""; // Clear previous content

  const productImage = document.createElement("img");
  productImage.id = "productImage";
  productImage.src = product.Images.PrimaryLarge; // Use PrimaryLarge for single image
  productImage.alt = product.NameWithoutBrand;
  carouselContainer.appendChild(productImage);
}
