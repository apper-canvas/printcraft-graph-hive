import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { productService } from '@/services/api/productService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

function Marketplace() {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    sortBy: 'popularity'
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMarketplaceDesigns();
  }, [filters]);

  async function loadMarketplaceDesigns() {
    try {
      setLoading(true);
      setError(null);
      const marketplaceDesigns = await productService.getMarketplaceDesigns(filters);
      setDesigns(marketplaceDesigns);
    } catch (error) {
      console.error('Failed to load marketplace designs:', error);
      setError('Failed to load marketplace designs');
    } finally {
      setLoading(false);
    }
  }

  async function handlePurchaseDesign(designId) {
    try {
      await productService.purchaseDesign(designId);
      toast.success('Design purchased successfully!');
      // Refresh designs to update purchase status
      loadMarketplaceDesigns();
    } catch (error) {
      console.error('Failed to purchase design:', error);
      toast.error('Failed to purchase design');
    }
  }

  function handleUseDesign(designId) {
    // Navigate to design studio with the purchased design
    navigate(`/design/1?marketplaceDesign=${designId}`);
  }

  const filteredDesigns = designs.filter(design => 
    design.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    design.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    design.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'graphics', label: 'Graphics & Illustrations' },
    { value: 'typography', label: 'Typography' },
    { value: 'patterns', label: 'Patterns' },
    { value: 'logos', label: 'Logos & Branding' },
    { value: 'vintage', label: 'Vintage & Retro' },
    { value: 'modern', label: 'Modern & Minimal' }
  ];

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: 'free', label: 'Free' },
    { value: '1-5', label: '$1 - $5' },
    { value: '5-15', label: '$5 - $15' },
    { value: '15+', label: '$15+' }
  ];

  const sortOptions = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' }
  ];

  if (loading) return <Loading message="Loading marketplace designs..." />;
  if (error) return <Error message={error} onRetry={loadMarketplaceDesigns} />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">
            Design Marketplace
          </h1>
          <p className="text-gray-600">
            Discover unique designs from talented creators worldwide
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <ApperIcon 
                  name="Search" 
                  size={20} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                />
                <input
                  type="text"
                  placeholder="Search designs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {priceRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredDesigns.length} design{filteredDesigns.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Design Grid */}
        {filteredDesigns.length === 0 ? (
          <Empty 
            message="No designs found matching your criteria" 
            action={
              <Button onClick={() => {
                setFilters({ category: 'all', priceRange: 'all', sortBy: 'popularity' });
                setSearchTerm('');
              }}>
                Clear Filters
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDesigns.map((design, index) => (
              <motion.div
                key={design.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
              >
                {/* Design Preview */}
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  <img
                    src={design.previewUrl}
                    alt={design.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {design.isPurchased && (
                    <div className="absolute top-3 left-3">
                      <Badge variant="success" size="sm">
                        <ApperIcon name="Check" size={12} />
                        Owned
                      </Badge>
                    </div>
                  )}
                  {design.price === 0 && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="primary" size="sm">Free</Badge>
                    </div>
                  )}
                </div>

                {/* Design Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">
                    {design.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {design.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {design.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Creator Info */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-semibold">
                        {design.creator.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">{design.creator.name}</span>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-gray-900">
                      {design.price === 0 ? 'Free' : `$${design.price}`}
                    </div>
                    
                    <div className="flex gap-2">
                      {design.isPurchased ? (
                        <Button
                          size="sm"
                          onClick={() => handleUseDesign(design.Id)}
                          icon="ExternalLink"
                        >
                          Use Design
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handlePurchaseDesign(design.Id)}
                          icon={design.price === 0 ? "Download" : "ShoppingCart"}
                        >
                          {design.price === 0 ? 'Download' : 'Purchase'}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 border-t pt-3">
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Download" size={12} />
                      {design.downloads}
                    </div>
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Heart" size={12} />
                      {design.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Star" size={12} />
                      {design.rating}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-primary to-primary-light rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2 font-display">
            Can't find what you're looking for?
          </h2>
          <p className="mb-6 opacity-90">
            Create your own custom design or browse our product catalog
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="secondary"
              onClick={() => navigate('/design/1')}
              icon="Palette"
            >
              Create Custom Design
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              icon="Grid3X3"
              className="border-white text-white hover:bg-white hover:text-primary"
            >
              Browse Products
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Marketplace;