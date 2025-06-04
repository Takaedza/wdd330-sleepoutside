
const baseurl = import.meta.env.Vite_SERVER_URL;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {

  constructor() {
    // this.category = category;
    // this.path = `/json/${this.category}.json`;
  }
  async getData(category) {
    const response = await fetch(`${baseurl}products/search/${category}`);
    const data = await convertToJson(response);

    return data.Result;
  }
  
  async findProductById(id) {

    const response = await fetch(`${baseurl}products/${id}`);
    const data = await convertToJson(response);
    console.log(data.Result);

    return data.Result;
  }
}