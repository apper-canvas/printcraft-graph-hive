import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const BulkOrderCalculator = ({ 
  product, 
  selectedQuantity = 1, 
  onQuantityChange,
  className = "" 
}) => {
  const [quantity, setQuantity] = useState(selectedQuantity);
  const [selectedTier, setSelectedTier] = useState(null);

  // Default quantity breaks if not provided in product data
  const defaultBreaks = [
    { min: 1, max: 9, discount: 0, price: product?.basePrice || 0 },
    { min: 10, max: 24, discount: 0.10, price: (product?.basePrice || 0) * 0.90 },
    { min: 25, max: 49, discount: 0.15, price: (product?.basePrice || 0) * 0.85 },
    { min: 50, max: 99, discount: 0.20, price: (product?.basePrice || 0) * 0.80 },
    { min: 100, max: null, discount: 0.25, price: (product?.basePrice || 0) * 0.75 }
  ];

  const quantityBreaks = product?.quantityBreaks || defaultBreaks;

  useEffect(() => {
    setQuantity(selectedQuantity);
  }, [selectedQuantity]);

  useEffect(() => {
    const tier = quantityBreaks.find(tier => 
      quantity >= tier.min && (tier.max === null || quantity <= tier.max)
    );
    setSelectedTier(tier);
  }, [quantity, quantityBreaks]);

  const handleQuantityChange = (newQuantity) => {
    const validQuantity = Math.max(1, newQuantity);
    setQuantity(validQuantity);
    if (onQuantityChange) {
      onQuantityChange(validQuantity);
    }
  };

  const calculateSavings = (tier) => {
    if (!tier || tier.discount === 0) return 0;
    return (product.basePrice - tier.price) * quantity;
  };

  const quickQuantities = [10, 25, 50, 100, 250];

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-lg text-gray-900 flex items-center">
          <ApperIcon name="Calculator" className="w-5 h-5 mr-2 text-primary" />
          Bulk Order Calculator
        </h3>
        {selectedTier && selectedTier.discount > 0 && (
          <Badge variant="success" size="sm">
            Save {(selectedTier.discount * 100).toFixed(0)}%
          </Badge>
        )}
      </div>

      {/* Quantity Input */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Quantity
        </label>
        <div className="flex items-center space-x-3">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="border-0 rounded-r-none"
            >
              <ApperIcon name="Minus" className="w-4 h-4" />
            </Button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="w-20 px-3 py-2 text-center border-0 focus:ring-0 focus:outline-none"
              min="1"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuantityChange(quantity + 1)}
              className="border-0 rounded-l-none"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex-1">
            <div className="flex space-x-2 flex-wrap">
              {quickQuantities.map((qty) => (
                <Button
                  key={qty}
                  variant={quantity === qty ? "primary" : "outline"}
                  size="sm"
                  onClick={() => handleQuantityChange(qty)}
                  className="text-xs"
                >
                  {qty}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Quantity Breaks</h4>
        <div className="grid gap-2">
          {quantityBreaks.map((tier, index) => {
            const isActive = selectedTier === tier;
            const isAvailable = quantity >= tier.min;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200
                  ${isActive 
                    ? 'border-primary bg-primary/5 shadow-sm' 
                    : isAvailable 
                      ? 'border-gray-200 bg-gray-50 hover:border-gray-300 cursor-pointer' 
                      : 'border-gray-100 bg-gray-25 opacity-60'
                  }
                `}
                onClick={() => isAvailable && handleQuantityChange(tier.min)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-3 h-3 rounded-full transition-colors duration-200
                    ${isActive ? 'bg-primary' : isAvailable ? 'bg-gray-300' : 'bg-gray-200'}
                  `} />
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      {tier.min}{tier.max ? `-${tier.max}` : '+'} pieces
                    </p>
                    {tier.discount > 0 && (
                      <p className="text-xs text-success font-medium">
                        {(tier.discount * 100).toFixed(0)}% off
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">
                    ${tier.price.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">each</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Order Summary */}
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-700">Unit Price:</span>
          <span className="font-bold text-lg text-primary">
            ${selectedTier?.price.toFixed(2) || product?.basePrice.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-700">Quantity:</span>
          <span className="font-bold text-lg">{quantity.toLocaleString()}</span>
        </div>
        
        {selectedTier && calculateSavings(selectedTier) > 0 && (
          <div className="flex justify-between items-center text-success">
            <span className="font-medium">You Save:</span>
            <span className="font-bold text-lg">
              ${calculateSavings(selectedTier).toFixed(2)}
            </span>
          </div>
        )}
        
        <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
          <span className="font-bold text-lg text-gray-900">Total:</span>
          <span className="font-bold text-2xl text-primary">
            ${((selectedTier?.price || product?.basePrice || 0) * quantity).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-gradient-to-r from-primary/5 to-primary-light/5 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <ApperIcon name="TrendingUp" className="w-5 h-5 text-primary mt-0.5" />
          <div className="flex-1">
            <h5 className="font-medium text-gray-900 mb-1">Bulk Order Benefits</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center space-x-2">
                <ApperIcon name="Check" className="w-3 h-3 text-success" />
                <span>Free shipping on orders over $50</span>
              </li>
              <li className="flex items-center space-x-2">
                <ApperIcon name="Check" className="w-3 h-3 text-success" />
                <span>Priority production (3-5 business days)</span>
              </li>
              <li className="flex items-center space-x-2">
                <ApperIcon name="Check" className="w-3 h-3 text-success" />
                <span>Dedicated account manager for 100+ orders</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkOrderCalculator;