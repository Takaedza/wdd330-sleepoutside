import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product){
    const hasDiscount = product.FinalPrice < product.SuggestedRetailPrice;
    const discount = hasDiscount
        ? (((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100).toFixed(0)
        : null;

    return`<li class="product-card">
        <a href="product_pages/?product=${product.Id}">
            <img
                src="${product.Images.PrimaryMedium}"
                alt="Image of ${product.Name}"
            >
            <h2>${hasDiscount ? `<p class="product-card__discount">-${discount}%</p>` : ""}</h2>
            <h3 class="card__brand">${product.Brand.Name}</h3>
            <p class="card__name">${product.NameWithoutBrand}</p>
            ${hasDiscount ? `<p class="product-card__retail">$${product.SuggestedRetailPrice.toFixed(2)}</p>` : ""}
            <p class="product-card__price">$${product.FinalPrice}</p>
        </a>
    </li>
    `;
}

export default class ProductList {
    constructor(category, dataSource, listElement){ //listElement is the HTML element where we want to render the product list.
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    async init() {
        const list = await this.dataSource.getData(this.category);
        this.renderList(list);
        document.querySelector(".title").textContent = this.category
    }

    renderList(list){
        // const filteredList = list.filter(product => product.FinalPrice !== 179.99); //to show only the 4 products that have product pages.
        renderListWithTemplate(productCardTemplate, this.listElement, list);
    }
}