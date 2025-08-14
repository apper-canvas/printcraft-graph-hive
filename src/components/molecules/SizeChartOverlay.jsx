import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const SizeChartOverlay = ({ 
  isVisible, 
  onClose, 
  product, 
  triggerRef,
  position = 'auto' 
}) => {
  const overlayRef = useRef(null);
  const [overlayPosition, setOverlayPosition] = useState({ top: 0, left: 0 });

  // Sample size chart data based on product category
  const getSizeChartData = (product) => {
    if (!product) return null;

    const category = product.category;
    
    switch (category) {
      case 'apparel':
        if (product.name.toLowerCase().includes('hoodie')) {
          return {
            title: 'Hoodie Size Chart',
            headers: ['Size', 'Chest (in)', 'Length (in)', 'Sleeve (in)'],
            measurements: [
              ['XS', '32-34', '25', '32'],
              ['S', '34-36', '26', '33'],
              ['M', '38-40', '27', '34'],
              ['L', '42-44', '28', '35'],
              ['XL', '46-48', '29', '36'],
              ['XXL', '50-52', '30', '37']
            ]
          };
        } else if (product.name.toLowerCase().includes('tank')) {
          return {
            title: 'Tank Top Size Chart',
            headers: ['Size', 'Chest (in)', 'Length (in)'],
            measurements: [
              ['XS', '30-32', '24'],
              ['S', '32-34', '25'],
              ['M', '36-38', '26'],
              ['L', '40-42', '27'],
              ['XL', '44-46', '28']
            ]
          };
        } else {
          return {
            title: 'T-Shirt Size Chart',
            headers: ['Size', 'Chest (in)', 'Length (in)', 'Sleeve (in)'],
            measurements: [
              ['XS', '30-32', '26', '7'],
              ['S', '34-36', '28', '8'],
              ['M', '38-40', '29', '8.5'],
              ['L', '42-44', '30', '9'],
              ['XL', '46-48', '31', '9.5'],
              ['XXL', '50-52', '32', '10']
            ]
          };
        }
      
      case 'drinkware':
        if (product.name.toLowerCase().includes('mug')) {
          return {
            title: 'Mug Size Chart',
            headers: ['Size', 'Capacity', 'Height (in)', 'Diameter (in)'],
            measurements: [
              ['11oz', '11 fl oz', '3.85', '3.35'],
              ['15oz', '15 fl oz', '4.5', '3.35']
            ]
          };
        } else if (product.name.toLowerCase().includes('bottle')) {
          return {
            title: 'Water Bottle Size Chart',
            headers: ['Size', 'Capacity', 'Height (in)', 'Diameter (in)'],
            measurements: [
              ['20oz', '20 fl oz', '8.5', '2.8'],
              ['32oz', '32 fl oz', '10.5', '3.0']
            ]
          };
        }
        break;
      
      case 'bags':
        return {
          title: 'Tote Bag Size Chart',
          headers: ['Size', 'Width (in)', 'Height (in)', 'Handle (in)'],
          measurements: [
            ['Standard', '15', '16', '22']
          ]
        };
      
      case 'accessories':
        if (product.name.toLowerCase().includes('cap')) {
          return {
            title: 'Baseball Cap Size Chart',
            headers: ['Size', 'Circumference (in)', 'Adjustment'],
            measurements: [
              ['Adjustable', '21-25', 'Velcro strap']
            ]
          };
        } else if (product.name.toLowerCase().includes('phone')) {
          return {
            title: 'Phone Case Size Chart',
            headers: ['Size', 'Width (in)', 'Height (in)', 'Thickness (in)'],
            measurements: [
              ['iPhone 14', '2.82', '5.78', '0.31'],
              ['iPhone 14 Pro', '2.81', '5.81', '0.31'],
              ['Samsung Galaxy', '2.79', '6.14', '0.33']
            ]
          };
        }
        break;
      
      default:
        return {
          title: 'Size Chart',
          headers: ['Size', 'Dimensions'],
          measurements: product.sizes?.map(size => [size, 'Contact for details']) || []
        };
    }
    
    return null;
  };

  const sizeData = getSizeChartData(product);

  // Calculate overlay position
  useEffect(() => {
    if (isVisible && triggerRef?.current && overlayRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const overlayRect = overlayRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top = triggerRect.bottom + 8;
      let left = triggerRect.left;

      // Adjust if overlay would go off-screen horizontally
      if (left + overlayRect.width > viewportWidth - 16) {
        left = viewportWidth - overlayRect.width - 16;
      }
      if (left < 16) left = 16;

      // Adjust if overlay would go off-screen vertically
      if (top + overlayRect.height > viewportHeight - 16) {
        top = triggerRect.top - overlayRect.height - 8;
      }
      if (top < 16) top = 16;

      setOverlayPosition({ top, left });
    }
  }, [isVisible, triggerRef]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target) &&
          triggerRef?.current && !triggerRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, onClose, triggerRef]);

  if (!sizeData) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 max-w-md w-full"
          style={{
            top: `${overlayPosition.top}px`,
            left: `${overlayPosition.left}px`,
            maxHeight: 'calc(100vh - 32px)',
            overflowY: 'auto'
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg text-gray-900">
              {sizeData.title}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1 h-8 w-8 hover:bg-gray-100"
            >
              <ApperIcon name="X" size={16} />
            </Button>
          </div>

          {/* Size Chart Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 rounded-t-lg">
                  {sizeData.headers.map((header, index) => (
                    <th 
                      key={index}
                      className="px-3 py-2 text-left font-medium text-gray-700 first:rounded-tl-lg last:rounded-tr-lg"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sizeData.measurements.map((row, rowIndex) => (
                  <tr 
                    key={rowIndex}
                    className={`border-t border-gray-100 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-25'} hover:bg-gray-50 transition-colors`}
                  >
                    {row.map((cell, cellIndex) => (
                      <td 
                        key={cellIndex}
                        className={`px-3 py-2 ${cellIndex === 0 ? 'font-medium text-gray-900' : 'text-gray-600'}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 flex items-center">
              <ApperIcon name="Info" size={14} className="mr-1" />
              All measurements are approximate. Contact us for custom sizing.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SizeChartOverlay;