import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SizeChartOverlay from "@/components/molecules/SizeChartOverlay";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const sizeInfoRef = useRef(null);
  const sizeGuideRef = useRef(null);

  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    const timeout = setTimeout(() => {
      setShowSizeChart(true);
    }, 500); // 500ms delay for hover
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    // Small delay to allow moving to overlay
    setTimeout(() => {
      if (!showSizeChart) return;
      setShowSizeChart(false);
    }, 150);
  };

  const handleSizeGuideClick = (e) => {
    e.stopPropagation();
    setShowSizeChart(true);
  };
  const handleDesignClick = () => {
    navigate(`/design/${product.Id}`);
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <img 
          src={product.mockupUrl} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <h3 className="font-display font-bold text-lg text-gray-900 group-hover:text-primary transition-colors duration-200">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <Badge variant="primary" size="sm">
              <ApperIcon name="DollarSign" className="w-3 h-3 mr-1" />
              From ${product.basePrice}
</Badge>
            <div className="flex items-center justify-between">
              <div
                ref={sizeInfoRef}
                className="flex items-center space-x-1 cursor-help"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <span className="text-xs text-gray-500">{product.sizes.length} sizes</span>
                <ApperIcon name="Info" size={12} className="text-gray-400" />
              </div>
              
              <button
                ref={sizeGuideRef}
                onClick={handleSizeGuideClick}
                className="text-xs text-primary hover:text-primary-light transition-colors duration-200 font-medium"
              >
                Size Guide
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">Available Colors:</p>
            <div className="flex space-x-2">
              {product.colors.map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200 hover:ring-primary transition-colors duration-200"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          <Button
            onClick={handleDesignClick}
            className="w-full"
            icon="Palette"
          >
            Start Designing
          </Button>
        </div>
</div>
      
      {/* Size Chart Overlay */}
      <SizeChartOverlay
        isVisible={showSizeChart}
        onClose={() => setShowSizeChart(false)}
        product={product}
        triggerRef={showSizeChart ? (sizeInfoRef.current ? sizeInfoRef : sizeGuideRef) : null}
      />
    </div>
  );
};

export default ProductCard;