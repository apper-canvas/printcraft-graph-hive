import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";

const TemplateGallery = ({ isOpen, onClose, templates, loading, onSelectTemplate }) => {
  const categories = [...new Set(templates.map(t => t.category))];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-2xl text-gray-900">Design Templates</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  icon="X"
                />
              </div>
              <p className="text-gray-600 mt-2">Choose from our collection of professional designs</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <Loading type="templates" />
              ) : (
                <div className="space-y-8">
                  {categories.map(category => (
                    <div key={category}>
                      <h3 className="font-display font-semibold text-lg text-gray-900 mb-4 capitalize">
                        {category}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {templates
                          .filter(template => template.category === category)
                          .map(template => (
                            <motion.div
                              key={template.Id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.98 }}
                              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer border border-gray-100"
                              onClick={() => onSelectTemplate(template)}
                            >
                              <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                                <img 
                                  src={template.thumbnailUrl} 
                                  alt={template.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200">
                                  <div className="absolute bottom-2 left-2 right-2">
                                    <Button size="sm" className="w-full text-xs">
                                      Use Template
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              <div className="p-3">
                                <h4 className="font-medium text-sm text-gray-900 truncate">
                                  {template.name}
                                </h4>
                              </div>
                            </motion.div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TemplateGallery;