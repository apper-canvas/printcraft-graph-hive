import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gradient-to-br from-red-100 to-red-50 p-6 rounded-full mb-6">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-error" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <ApperIcon name="RefreshCw" className="w-5 h-5 inline-block mr-2" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;