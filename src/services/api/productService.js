import productData from "@/services/mockData/products.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  async getAll() {
    await delay(300);
    return [...productData];
  },

  async getBulkPricing(productId, quantity) {
    await delay(100);
    const product = productData.find(p => p.Id === productId);
    if (!product) {
      throw new Error("Product not found");
    }
    
    const quantityBreaks = product.quantityBreaks || [];
    const tier = quantityBreaks.find(tier => 
      quantity >= tier.min && (tier.max === null || quantity <= tier.max)
    );
    
    return {
      product: { ...product },
      tier: tier || { min: 1, max: null, discount: 0, price: product.basePrice },
      quantity,
      unitPrice: tier?.price || product.basePrice,
      totalPrice: (tier?.price || product.basePrice) * quantity,
      savings: tier ? (product.basePrice - tier.price) * quantity : 0
    };
  },

  async getById(id) {
    await delay(200);
    const product = productData.find(p => p.Id === id);
    if (!product) {
      throw new Error("Product not found");
    }
    return { ...product };
  },

  async create(product) {
    await delay(400);
    const newProduct = {
      ...product,
      Id: Math.max(...productData.map(p => p.Id)) + 1
    };
    productData.push(newProduct);
    return { ...newProduct };
  },

  async update(id, data) {
    await delay(300);
    const index = productData.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    productData[index] = { ...productData[index], ...data };
    return { ...productData[index] };
  },

  async delete(id) {
    await delay(200);
    const index = productData.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    const deleted = productData.splice(index, 1)[0];
    return { ...deleted };
  }
};