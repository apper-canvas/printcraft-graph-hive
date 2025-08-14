import templateData from "@/services/mockData/templates.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const templateService = {
  async getAll() {
    await delay(400);
    return [...templateData];
  },

  async getById(id) {
    await delay(200);
    const template = templateData.find(t => t.Id === id);
    if (!template) {
      throw new Error("Template not found");
    }
    return { ...template };
  },

  async getByCategory(category) {
    await delay(300);
    return templateData.filter(t => t.category === category).map(t => ({ ...t }));
  },

  async create(template) {
    await delay(400);
    const newTemplate = {
      ...template,
      Id: Math.max(...templateData.map(t => t.Id)) + 1
    };
    templateData.push(newTemplate);
    return { ...newTemplate };
  },

  async update(id, data) {
    await delay(300);
    const index = templateData.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error("Template not found");
    }
    templateData[index] = { ...templateData[index], ...data };
    return { ...templateData[index] };
  },

  async delete(id) {
    await delay(200);
    const index = templateData.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error("Template not found");
    }
    const deleted = templateData.splice(index, 1)[0];
    return { ...deleted };
  }
};