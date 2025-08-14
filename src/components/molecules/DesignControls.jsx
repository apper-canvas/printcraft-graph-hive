import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const DesignControls = ({ 
  design, 
  onSizeChange, 
  onRotationChange, 
  onPositionChange,
  onRemove 
}) => {
  if (!design) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-lg text-gray-900">Design Controls</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          icon="Trash2"
          className="text-error hover:text-error hover:bg-error/5"
        />
      </div>

      <div className="space-y-4">
<div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Size: {Math.round(design.size.width)}px × {Math.round(design.size.height)}px
          </label>
          <input
            type="range"
            min="50"
            max="300"
            value={design.size.width}
            onChange={(e) => onSizeChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-primary/20 to-primary-light/20 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Rotation: {Math.round(design.rotation)}°
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={design.rotation}
            onChange={(e) => onRotationChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-accent/20 to-yellow-500/20 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">X Position</label>
            <input
              type="range"
              min="0"
              max="400"
              value={design.position.x}
              onChange={(e) => onPositionChange({ ...design.position, x: parseFloat(e.target.value) })}
              className="w-full h-2 bg-gradient-to-r from-success/20 to-emerald-500/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Y Position</label>
            <input
              type="range"
              min="0"
              max="400"
              value={design.position.y}
              onChange={(e) => onPositionChange({ ...design.position, y: parseFloat(e.target.value) })}
              className="w-full h-2 bg-gradient-to-r from-info/20 to-blue-500/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-3">
<Button
            variant="outline"
            size="sm"
            onClick={() => onPositionChange({ x: 125, y: 175 })}
            icon="Target"
          >
            Center
          </Button>
<Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onSizeChange(150);
              onRotationChange(0);
              onPositionChange({ x: 125, y: 175 });
            }}
            icon="RotateCcw"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DesignControls;