import React, { forwardRef, useEffect, useRef, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const DesignCanvas = React.forwardRef(({ 
  product, 
  design, 
  selectedColor,
  onDesignUpdate,
  onColorChange,
  onDownloadMockup
}, ref) => {
const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef(null);

  // Forward ref to parent component
  React.useImperativeHandle(ref, () => canvasRef.current);

  // Color hue calculation for product color changes
  const getColorHue = (color) => {
    if (color === "#FFFFFF") return 0;
    if (color === "#000000") return 0;
    if (color === "#FF0000") return 0;
    if (color === "#00FF00") return 120;
    if (color === "#0000FF") return 240;
    return 0;
  };
  const handleMouseDown = (e) => {
    if (!design) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if click is within design bounds
    const designRect = {
      x: design.position.x,
      y: design.position.y,
      width: design.size.width,
      height: design.size.height
    };
    
    if (x >= designRect.x && x <= designRect.x + designRect.width &&
        y >= designRect.y && y <= designRect.y + designRect.height) {
      setIsDragging(true);
      setDragStart({
        x: x - design.position.x,
        y: y - design.position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !design) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragStart.x;
    const y = e.clientY - rect.top - dragStart.y;
    
    // Constrain within canvas bounds
    const maxX = 400 - design.size.width;
    const maxY = 500 - design.size.height;
    
    onDesignUpdate({
      ...design,
      position: {
        x: Math.max(0, Math.min(maxX, x)),
        y: Math.max(0, Math.min(maxY, y))
      }
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStart, design]);

  if (!product) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="space-y-6">
        {/* Product Colors */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Choose Color:</h3>
          <div className="flex space-x-3">
            {product.colors.map((color, index) => (
              <button
                key={index}
                onClick={() => onColorChange(color)}
                className={`w-10 h-10 rounded-full border-4 transition-all duration-200 ${
                  selectedColor === color 
                    ? "border-primary shadow-lg scale-110" 
                    : "border-white shadow-sm hover:border-primary/50"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Canvas */}
<div className="relative">
          <h3 className="font-medium text-gray-900 mb-3">Product Preview:</h3>
          <div 
            ref={canvasRef}
            className="design-canvas bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl relative mx-auto border-2 border-dashed border-transparent hover:border-primary/30 transition-all duration-200"
            style={{ width: "400px", height: "500px" }}
            onMouseDown={handleMouseDown}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Download Mockup Button */}
            {design && (
              <div className="absolute top-3 right-3 z-10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDownloadMockup}
                  icon="Download"
                  className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm"
                >
                  Download Mockup
                </Button>
              </div>
            )}
            {/* Product Mockup */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-xl"
              style={{ 
                backgroundImage: `url(${product.mockupUrl})`,
                filter: selectedColor !== "#FFFFFF" ? `hue-rotate(${getColorHue(selectedColor)}deg)` : "none"
              }}
            />
            
            {/* Design Overlay */}
            {design && (
              <div
                className="draggable-design"
                style={{
                  left: design.position.x,
                  top: design.position.y,
                  width: design.size.width,
                  height: design.size.height,
                  transform: `rotate(${design.rotation}deg)`,
                  cursor: isDragging ? "grabbing" : "grab"
                }}
              >
                <img
                  src={design.imageUrl}
                  alt="Design"
                  className="w-full h-full object-contain pointer-events-none"
                  draggable={false}
                />
                
{/* Resize Handles - Only show when hovered or dragging */}
                {(isHovered || isDragging) && (
                  <>
                    <div className="resize-handle top-left animate-pulse" />
                    <div className="resize-handle top-right animate-pulse" />
                    <div className="resize-handle bottom-left animate-pulse" />
                    <div className="resize-handle bottom-right animate-pulse" />
                  </>
                )}
              </div>
            )}
            
            {/* Print Area Indicator */}
            <div className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-xl pointer-events-none" />
            
            {/* Helper Text */}
            {!design && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <ApperIcon name="Upload" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Upload a design to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Canvas Instructions */}
{design && (
          <div className="bg-primary/5 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-primary text-sm">
              <ApperIcon name="Info" className="w-4 h-4" />
              <span>Drag your design to reposition it on the product</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

DesignCanvas.displayName = "DesignCanvas";

export default DesignCanvas;