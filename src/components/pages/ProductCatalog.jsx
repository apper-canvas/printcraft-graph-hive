import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductGrid from "@/components/organisms/ProductGrid";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { productService } from "@/services/api/productService";

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...new Set(products.map(p => p.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-primary-light to-primary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="font-display font-bold text-5xl md:text-6xl text-white leading-tight">
              Create Amazing
              <br />
              <span className="text-accent">Custom Products</span>
            </h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed">
              Turn your ideas into reality with our premium merchandise printing platform. 
              Design, customize, and order professional products in minutes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white/80 backdrop-blur-sm sticky top-16 z-30 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
              />
            </div>

            {/* Category Filter */}
            <div className="flex space-x-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {!loading && !error && (
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-2xl text-gray-900">
                    {searchTerm || selectedCategory !== "all" 
                      ? `Filtered Products (${filteredProducts.length})`
                      : "All Products"
                    }
                  </h2>
                  <p className="text-gray-600">Choose a product to start designing</p>
                </div>
                
                <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Truck" className="w-4 h-4" />
                    <span>Free shipping over $50</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Shield" className="w-4 h-4" />
                    <span>Quality guarantee</span>
                  </div>
                </div>
              </div>
            )}

            <ProductGrid 
              products={filteredProducts}
              loading={loading}
              error={error}
              onRetry={loadProducts}
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl text-gray-900 mb-4">
              Why Choose PrintCraft?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We make custom printing simple, fast, and affordable for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "Palette",
                title: "Easy Design Tools",
                description: "Intuitive design interface with drag-and-drop functionality"
              },
              {
                icon: "Zap",
                title: "Fast Production",
                description: "Quick turnaround times with same-day processing available"
              },
              {
                icon: "Award",
                title: "Premium Quality",
                description: "High-quality printing on premium materials and products"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="bg-gradient-to-r from-primary/10 to-primary-light/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name={feature.icon} className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductCatalog;