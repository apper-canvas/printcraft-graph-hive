import cartData from "@/services/mockData/cart.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const cartService = {
  async getAll() {
    await delay(200);
    return [...cartData];
  },

  async getById(id) {
    await delay(150);
    const item = cartData.find(c => c.Id === id);
    if (!item) {
      throw new Error("Cart item not found");
    }
    return { ...item };
  },

  async create(item) {
    await delay(300);
    const newItem = {
      ...item,
      Id: cartData.length > 0 ? Math.max(...cartData.map(c => c.Id)) + 1 : 1
    };
    cartData.push(newItem);
    return { ...newItem };
  },

  async update(id, data) {
    await delay(250);
    const index = cartData.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Cart item not found");
    }
    cartData[index] = { ...cartData[index], ...data };
    return { ...cartData[index] };
  },

  async delete(id) {
    await delay(200);
    const index = cartData.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Cart item not found");
    }
    const deleted = cartData.splice(index, 1)[0];
    return { ...deleted };
  },

  async clear() {
    await delay(250);
    const items = [...cartData];
    cartData.length = 0;
    return items;
  }
};