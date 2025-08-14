import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Marketplace from "@/components/pages/Marketplace";
import Header from "@/components/organisms/Header";
import CartSidebar from "@/components/molecules/CartSidebar";
import DesignStudio from "@/components/pages/DesignStudio";
import ProductCatalog from "@/components/pages/ProductCatalog";
import { cartService } from "@/services/cartService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart items
  const loadCartItems = async () => {
    try {
      const items = await cartService.getAll();
      setCartItems(items);
    } catch (err) {
      console.error("Failed to load cart items:", err);
    }
  };

  useEffect(() => {
    loadCartItems();
  }, []);

  // Cart handlers
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      await cartService.update(itemId, { quantity: newQuantity });
      setCartItems(items => 
        items.map(item => 
          item.Id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      toast.success("Quantity updated");
    } catch (err) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await cartService.delete(itemId);
      setCartItems(items => items.filter(item => item.Id !== itemId));
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header 
          cartItemCount={cartItems.length}
          onCartOpen={() => setIsCartOpen(true)}
        />
        
        <main>
<Routes>
<Route path="/" element={<ProductCatalog />} />
<Route path="/design/:productId" element={<DesignStudio />} />
<Route path="/marketplace" element={<Marketplace />} />
</Routes>
</main>

        <CartSidebar
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;