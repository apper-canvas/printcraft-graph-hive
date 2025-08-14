import React from "react";

const Loading = ({ type = "products" }) => {
  if (type === "products") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
            <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300"></div>
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md w-3/4"></div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md w-20"></div>
                <div className="flex space-x-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="w-6 h-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "templates") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
            <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300"></div>
            <div className="p-3 space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
    </div>
  );
};

export default Loading;