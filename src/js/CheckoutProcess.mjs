import { getLocalStorage, alertMessage } from "./utils.mjs";

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce((sum, item) => sum + item.FinalPrice, 0);
    const itemCount = this.list.length;

    const subtotalElement = document.querySelector(`${this.outputSelector} #subtotal`);
    const itemsElement = document.querySelector(`${this.outputSelector} #num-items`);

    if (subtotalElement) subtotalElement.innerText = `$${this.itemTotal.toFixed(2)}`;
    if (itemsElement) itemsElement.innerText = itemCount;
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;

    const itemCount = this.list.length;
    this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;

    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const taxElement = document.querySelector(`${this.outputSelector} #tax`);
    const shippingElement = document.querySelector(`${this.outputSelector} #shipping`);
    const totalElement = document.querySelector(`${this.outputSelector} #order-total`);

    if (taxElement) taxElement.innerText = `$${this.tax.toFixed(2)}`;
    if (shippingElement) shippingElement.innerText = `$${this.shipping.toFixed(2)}`;
    if (totalElement) totalElement.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  packageItems(items) {
    return items.map(item => ({
        id: item.Id,
        name: item.Name,
        price: item.ListPrice,
        quantity: 1 
    }));
  }

  async checkout(form) {
    const ExternalServices = (await import("./ExternalServices.mjs")).default;
    const service = new ExternalServices();

    const formData = this.formDataToJSON(form);
    const items = this.packageItems(this.list);

    const order = {
        ...formData,
        orderDate: new Date().toISOString(),
        items: items,
        orderTotal: this.orderTotal.toFixed(2),
        shipping: this.shipping,
        tax: this.tax.toFixed(2)
    };

    if (order.expiration && order.expiration.includes("-")) {
        const [year, month] = order.expiration.split("-");
        order.expiration = `${month}/${year.slice(2)}`;
    }

    console.log("Order to submit:", order);

    try {
      const response = await service.checkout(order);
      console.log("✅ Order successfully submitted:", response);
      localStorage.removeItem(this.key);
      window.location.href = "/checkout/success.html";
    } catch (error) {
      console.error("❌ Failed to submit order:", error);
      let message = "An unexpected error occurred. Please try again.";
      
      if (error?.name === "servicesError" && error?.message?.message) {
        message = error.message.message;
      }
      alertMessage(message);
    }
  }

  formDataToJSON(formElement) {
    const formData = new FormData(formElement),
        convertedJSON = {};

    formData.forEach((value, key) => {
        convertedJSON[key] = value;
    });

    return convertedJSON;
  }
}
