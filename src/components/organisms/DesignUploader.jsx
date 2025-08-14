import React, { useRef, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const DesignUploader = ({ onDesignUpload, onTemplateClick }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    const file = files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, GIF)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    // Create object URL for preview
    const imageUrl = URL.createObjectURL(file);
    
    // Create design object
    const design = {
      Id: Date.now(),
      imageUrl,
      position: { x: 100, y: 150 },
      size: { width: 150, height: 150 },
      rotation: 0
    };

    onDesignUpload(design);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <div>
        <h3 className="font-display font-bold text-lg text-gray-900 mb-2">Add Your Design</h3>
        <p className="text-gray-600 text-sm">Upload your artwork or choose from our templates</p>
      </div>

      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          isDragging 
            ? "border-primary bg-primary/5 scale-105" 
            : "border-gray-300 hover:border-primary hover:bg-primary/5"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-primary/10 to-primary-light/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name="Upload" className="w-8 h-8 text-primary" />
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {isDragging ? "Drop your file here" : "Upload Your Design"}
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Drag and drop your image here, or click to browse
            </p>
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="primary"
              icon="FolderOpen"
            >
              Choose File
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>

          <div className="text-xs text-gray-500">
            Supported formats: PNG, JPG, GIF • Max size: 5MB
          </div>
        </div>
      </div>

      {/* Templates Section */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Or use a template</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={onTemplateClick}
            icon="Palette"
          >
            Browse All
          </Button>
        </div>
        
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <button
              key={i}
              className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg hover:from-primary/10 hover:to-primary-light/10 transition-all duration-200 flex items-center justify-center group"
              onClick={onTemplateClick}
            >
              <ApperIcon name="Image" className="w-6 h-6 text-gray-400 group-hover:text-primary" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesignUploader;