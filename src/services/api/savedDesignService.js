import savedDesignData from "@/services/mockData/savedDesigns.json";

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let mockSavedDesigns = [...savedDesignData];
let nextId = Math.max(...mockSavedDesigns.map(d => d.Id), 0) + 1;
export const savedDesignService = {
  async getAll() {
    await delay(300);
    return [...mockSavedDesigns];
  },

  async getById(id) {
    await delay(200);
    if (!Number.isInteger(id) || id < 1) {
      throw new Error('Invalid ID provided');
    }
    const design = mockSavedDesigns.find(d => d.Id === id);
    return design ? { ...design } : null;
  },

async create(designData) {
    await delay(400);
    const newDesign = {
      ...designData,
      Id: nextId++,
      savedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      version: 1
    };
    mockSavedDesigns.push(newDesign);
    return { ...newDesign };
  },

  async update(id, updateData) {
    await delay(300);
    if (!Number.isInteger(id) || id < 1) {
      throw new Error('Invalid ID provided');
    }
    const index = mockSavedDesigns.findIndex(d => d.Id === id);
    if (index === -1) {
      throw new Error('Saved design not found');
    }
    mockSavedDesigns[index] = { 
      ...mockSavedDesigns[index], 
      ...updateData,
      updatedAt: new Date().toISOString(),
      version: (mockSavedDesigns[index].version || 1) + 1
    };
return { ...mockSavedDesigns[index] };
  },

  async delete(id) {
    await delay(200);
    if (!Number.isInteger(id) || id < 1) {
      throw new Error('Invalid ID provided');
    }
    const index = mockSavedDesigns.findIndex(d => d.Id === id);
    if (index === -1) {
      throw new Error('Saved design not found');
    }
    mockSavedDesigns.splice(index, 1);
    return true;
  }
};