import productData from "@/services/mockData/products.json";
import marketplaceDesignsData from "@/services/mockData/marketplaceDesigns.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate purchased designs (in a real app, this would come from user data)
let purchasedDesigns = new Set([3, 7]); // Pre-purchased design IDs

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
},

// Marketplace Design Methods
async getMarketplaceDesigns(filters = {}) {
  await delay(400);
  let designs = [...marketplaceDesignsData];
  
  // Add purchased status
  designs = designs.map(design => ({
    ...design,
    isPurchased: purchasedDesigns.has(design.Id)
  }));
  
  // Apply category filter
  if (filters.category && filters.category !== 'all') {
    designs = designs.filter(design => design.category === filters.category);
  }
  
  // Apply price range filter
  if (filters.priceRange && filters.priceRange !== 'all') {
    if (filters.priceRange === 'free') {
      designs = designs.filter(design => design.price === 0);
    } else if (filters.priceRange === '1-5') {
      designs = designs.filter(design => design.price > 0 && design.price <= 5);
    } else if (filters.priceRange === '5-15') {
      designs = designs.filter(design => design.price > 5 && design.price <= 15);
    } else if (filters.priceRange === '15+') {
      designs = designs.filter(design => design.price > 15);
    }
  }
  
  // Apply sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'popularity':
        designs.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'newest':
        designs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'price-low':
        designs.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        designs.sort((a, b) => b.price - a.price);
        break;
      default:
        designs.sort((a, b) => b.downloads - a.downloads);
    }
  }
  
  return designs;
},

async purchaseDesign(designId) {
  await delay(200);
  const design = marketplaceDesignsData.find(d => d.Id === designId);
  if (!design) {
    throw new Error("Design not found");
  }
  
  // Add to purchased designs
  purchasedDesigns.add(designId);
  
  // Simulate purchase process
  return {
    success: true,
    designId,
    purchaseId: `purchase_${Date.now()}`,
    downloadUrl: design.previewUrl // In real app, this would be the actual file URL
  };
},

async getDesignsByCategory(category) {
  await delay(200);
  const designs = marketplaceDesignsData.filter(design => 
    design.category === category
  ).map(design => ({
    ...design,
    isPurchased: purchasedDesigns.has(design.Id)
  }));
  return designs;
},

async getDesignById(designId) {
  await delay(150);
  const design = marketplaceDesignsData.find(d => d.Id === designId);
  if (!design) {
    throw new Error("Design not found");
  }
  return {
    ...design,
    isPurchased: purchasedDesigns.has(design.Id)
  };
}
};