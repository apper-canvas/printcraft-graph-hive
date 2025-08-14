import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

function FilterSidebar({ 
  products,
  filters,
  onFiltersChange,
  isOpen,
  onToggle,
  className = ''
}) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    colors: true,
    sizes: true,
    types: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Extract unique values from products
  const categories = [...new Set(products.map(p => p.category))];
  const colors = [...new Set(products.flatMap(p => p.colors || []))];
  const sizes = [...new Set(products.flatMap(p => p.sizes || []))];
  const types = [...new Set(products.map(p => {
    // Extract product type from name (first word)
    return p.name.split(' ')[0];
  }))];

  const handleFilterChange = (filterType, value, checked) => {
    const newFilters = { ...filters };
    
    if (checked) {
      newFilters[filterType] = [...(newFilters[filterType] || []), value];
    } else {
      newFilters[filterType] = (newFilters[filterType] || []).filter(item => item !== value);
    }
    
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      colors: [],
      sizes: [],
      types: []
    });
  };

  const getTotalActiveFilters = () => {
    return Object.values(filters).flat().length;
  };

  const getColorName = (colorHex) => {
    const colorNames = {
      '#FFFFFF': 'White',
      '#000000': 'Black',
      '#FF0000': 'Red',
      '#0000FF': 'Blue',
      '#00FF00': 'Green',
      '#FFFF00': 'Yellow',
      '#FF1493': 'Pink',
      '#808080': 'Gray',
      '#F5F5DC': 'Beige',
      '#00FFFF': 'Cyan'
    };
    return colorNames[colorHex] || colorHex;
  };

  const FilterSection = ({ title, items, filterKey, renderItem }) => (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => toggleSection(filterKey)}
        className="flex items-center justify-between w-full py-2 text-left font-medium text-gray-900 hover:text-primary transition-colors"
      >
        <span className="capitalize">{title}</span>
        <ApperIcon 
          name={expandedSections[filterKey] ? "ChevronUp" : "ChevronDown"} 
          size={16}
          className="text-gray-500"
        />
      </button>
      
      <AnimatePresence>
        {expandedSections[filterKey] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 space-y-2 overflow-hidden"
          >
            {items.map(item => renderItem(item, filterKey))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderCheckboxItem = (item, filterKey) => {
    const isChecked = filters[filterKey]?.includes(item) || false;
    
    return (
      <label key={item} className="flex items-center space-x-3 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => handleFilterChange(filterKey, item, e.target.checked)}
            className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
          {isChecked && (
            <ApperIcon 
              name="Check" 
              size={12} 
              className="absolute top-0 left-0 text-white pointer-events-none"
            />
          )}
        </div>
        <span className="text-sm text-gray-700 group-hover:text-gray-900 capitalize">
          {item}
        </span>
      </label>
    );
  };

  const renderColorItem = (color, filterKey) => {
    const isChecked = filters[filterKey]?.includes(color) || false;
    
    return (
      <label key={color} className="flex items-center space-x-3 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => handleFilterChange(filterKey, color, e.target.checked)}
            className="sr-only"
          />
          <div 
            className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
              isChecked 
                ? 'border-primary ring-2 ring-primary ring-opacity-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            style={{ backgroundColor: color }}
          >
            {isChecked && (
              <ApperIcon 
                name="Check" 
                size={12} 
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
                  color === '#FFFFFF' ? 'text-gray-600' : 'text-white'
                }`}
              />
            )}
          </div>
        </div>
        <span className="text-sm text-gray-700 group-hover:text-gray-900">
          {getColorName(color)}
        </span>
      </label>
    );
  };

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Filter" size={18} className="text-primary" />
          <h2 className="font-medium text-gray-900">Filters</h2>
          {getTotalActiveFilters() > 0 && (
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
              {getTotalActiveFilters()}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {getTotalActiveFilters() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs"
            >
              Clear All
            </Button>
          )}
          <button
            onClick={onToggle}
            className="lg:hidden p-1 hover:bg-gray-100 rounded"
          >
            <ApperIcon name="X" size={18} />
          </button>
        </div>
      </div>

      {/* Filter Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <FilterSection
          title="Categories"
          items={categories}
          filterKey="categories"
          renderItem={renderCheckboxItem}
        />
        
        <FilterSection
          title="Colors"
          items={colors}
          filterKey="colors"
          renderItem={renderColorItem}
        />
        
        <FilterSection
          title="Sizes"
          items={sizes}
          filterKey="sizes"
          renderItem={renderCheckboxItem}
        />
        
        <FilterSection
          title="Product Types"
          items={types}
          filterKey="types"
          renderItem={renderCheckboxItem}
        />
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className={`hidden lg:block w-80 bg-white border-r border-gray-200 ${className}`}>
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-200 z-50 lg:hidden"
          >
            {sidebarContent}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default FilterSidebar;