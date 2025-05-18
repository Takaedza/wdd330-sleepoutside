import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product){
    return`<li class="product-card">
        <a href="product_pages/?product=${product.Id}">
            <img
                src="${product.Image}"
                alt="Image of ${product.NameWithoutBrand}"
            />
            <h3 class="card__brand">${product.Brand.Name}</h3>
            <h2 class="card__name">${product.NameWithoutBrand}</h2>
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
    const list = await this.dataSource.getData();
    this.renderList(list);
    }

    renderList(list){
        const filteredList = list.filter(product => product.FinalPrice !== 179.99); //to show only the 4 products that have product pages.
        renderListWithTemplate(productCardTemplate, this.listElement, filteredList);
    }
}