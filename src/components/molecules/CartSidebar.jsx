import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const CartSidebar = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem }) => {
  const total = cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-xl text-gray-900">Shopping Cart</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  icon="X"
                />
              </div>
              {cartItems.length > 0 && (
                <Badge variant="primary" className="mt-2">
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                </Badge>
              )}
            </div>

            <div className="flex-1">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="bg-gradient-to-br from-primary/10 to-primary-light/10 p-6 rounded-full mb-4">
                    <ApperIcon name="ShoppingCart" className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-gray-900 mb-2">Cart is Empty</h3>
                  <p className="text-gray-600">Add some amazing designs to get started!</p>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.Id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.productName}</h4>
                          <p className="text-sm text-gray-600">
                            {item.color} • {item.size}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(item.Id)}
                          icon="Trash2"
                          className="text-error hover:text-error"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.Id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                          >
                            <ApperIcon name="Minus" className="w-4 h-4" />
                          </Button>
                          <span className="font-medium text-lg min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.Id, item.quantity + 1)}
                          >
                            <ApperIcon name="Plus" className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-primary">
                            ${(item.unitPrice * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">
                            ${item.unitPrice.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-gray-100 p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-display font-bold text-xl text-gray-900">Total:</span>
                  <span className="font-display font-bold text-2xl text-primary">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  icon="CreditCard"
                >
                  Checkout
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Secure checkout • Free shipping on orders over $50
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;