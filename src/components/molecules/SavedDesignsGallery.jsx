import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";

const SavedDesignsGallery = ({ 
  isOpen, 
  onClose, 
  savedDesigns, 
  loading, 
  onSelectDesign, 
  onDeleteDesign 
}) => {
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
                <h2 className="font-display font-bold text-2xl text-gray-900">Saved Designs</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  icon="X"
                />
              </div>
              <p className="text-gray-600 mt-2">Access your previously saved design work</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <Loading type="designs" />
              ) : savedDesigns.length === 0 ? (
                <Empty 
                  icon="Bookmark"
                  title="No Saved Designs"
                  description="Start designing and save your work to see it here"
                />
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {savedDesigns.map(design => (
                    <motion.div
                      key={design.Id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 border border-gray-100"
                    >
                      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                        {design.thumbnailUrl ? (
                          <img 
                            src={design.thumbnailUrl} 
                            alt={design.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ApperIcon name="Image" size={32} className="text-gray-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200">
                          <div className="absolute bottom-2 left-2 right-2 flex gap-2">
                            <Button 
                              size="sm" 
                              className="flex-1 text-xs"
                              onClick={() => onSelectDesign(design)}
                            >
                              Load Design
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onDeleteDesign(design.Id)}
                              icon="Trash2"
                              className="text-white hover:bg-red-500/20"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium text-sm text-gray-900 truncate">
                          {design.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(design.savedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </motion.div>
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

export default SavedDesignsGallery;