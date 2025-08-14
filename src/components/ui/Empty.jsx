import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "Nothing here yet", 
  message = "Start by adding some items to get started.",
  actionLabel = "Get Started",
  onAction,
  icon = "Package"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-gradient-to-br from-primary/10 to-primary-light/10 p-8 rounded-full mb-6">
        <ApperIcon name={icon} className="w-16 h-16 text-primary" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3 font-display">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">{message}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="px-8 py-4 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-medium hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default Empty;