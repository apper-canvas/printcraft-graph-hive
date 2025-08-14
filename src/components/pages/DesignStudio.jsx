import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import SavedDesignsGallery from "@/components/molecules/SavedDesignsGallery";
import { productService } from "@/services/api/productService";
import { templateService } from "@/services/api/templateService";
import { cartService } from "@/services/api/cartService";
import { savedDesignService } from "@/services/api/savedDesignService";
import ApperIcon from "@/components/ApperIcon";
import DesignUploader from "@/components/organisms/DesignUploader";
import DesignCanvas from "@/components/organisms/DesignCanvas";
import DesignControls from "@/components/molecules/DesignControls";
import TemplateGallery from "@/components/molecules/TemplateGallery";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
const DesignStudio = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  // Product state
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Design state
  const [design, setDesign] = useState(null);
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  // Templates state
  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
const [savedDesigns, setSavedDesigns] = useState([]);
  const [showSavedDesigns, setShowSavedDesigns] = useState(false);
  // Load product
  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productService.getById(parseInt(productId));
      setProduct(data);
      setSelectedColor(data.colors[0] || "#FFFFFF");
      setSelectedSize(data.sizes[0] || "M");
    } catch (err) {
      setError("Failed to load product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load templates
  const loadTemplates = async () => {
    try {
      setTemplatesLoading(true);
      const data = await templateService.getAll();
      setTemplates(data);
    } catch (err) {
      toast.error("Failed to load templates");
    } finally {
      setTemplatesLoading(false);
    }
  };
async function loadSavedDesigns() {
    try {
      const designs = await savedDesignService.getAll();
      setSavedDesigns(designs);
    } catch (error) {
      console.error('Failed to load saved designs:', error);
      toast.error('Failed to load saved designs');
    }
  }
  useEffect(() => {
    loadProduct();
    loadTemplates();
}, [productId]);

  useEffect(() => {
    loadSavedDesigns();
  }, []);

  // Design handlers
  const handleDesignUpload = (newDesign) => {
    setDesign(newDesign);
    toast.success("Design uploaded successfully!");
  };

  const handleDesignUpdate = (updatedDesign) => {
    setDesign(updatedDesign);
  };

  const handleTemplateSelect = (template) => {
    const newDesign = {
      Id: Date.now(),
      imageUrl: template.designUrl,
      position: { x: 100, y: 150 },
      size: { width: 150, height: 150 },
      rotation: 0
    };
    setDesign(newDesign);
    setShowTemplates(false);
    toast.success(`Template "${template.name}" applied!`);
  };
async function handleSaveDesign() {
    if (!design) {
      toast.error('No design to save');
      return;
    }

    try {
      const designName = `Design ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
      await savedDesignService.create({
        name: designName,
        designUrl: design.url,
        thumbnailUrl: design.url,
        productId: product?.Id,
        productName: product?.name
      });
      
      toast.success('Design saved successfully!');
      loadSavedDesigns();
    } catch (error) {
      console.error('Failed to save design:', error);
      toast.error('Failed to save design');
    }
  }

  function handleSelectSavedDesign(design) {
    handleDesignUpdate({
      url: design.designUrl,
      name: design.name
    });
    setShowSavedDesigns(false);
    toast.success(`Loaded design: ${design.name}`);
  }

  async function handleDeleteSavedDesign(designId) {
    try {
      await savedDesignService.delete(designId);
      toast.success('Design deleted successfully');
      loadSavedDesigns();
    } catch (error) {
      console.error('Failed to delete design:', error);
      toast.error('Failed to delete design');
    }
  }
const handleRemoveDesign = () => {
    setDesign(null);
    toast.info("Design removed");
  };

  const calculatePrice = () => {
    const basePrice = product?.basePrice || 0;
    const designFee = design ? 5 : 0;
    return (basePrice + designFee) * quantity;
  };

  // Cart handler
  const handleAddToCart = async () => {
    if (!design) {
      toast.error("Please add a design first");
      return;
    }

    try {
      const cartItem = {
        Id: Date.now(),
        productId: product.Id,
        productName: product.name,
        design,
        color: selectedColor,
        size: selectedSize,
        quantity,
        unitPrice: product.basePrice + 5 // Add design fee
      };

      await cartService.create(cartItem);
      toast.success("Added to cart successfully!");
      
      // Optionally navigate to cart or continue designing
      // navigate("/cart");
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProduct} />;
  if (!product) return <Error message="Product not found" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-lg border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                icon="ArrowLeft"
                size="sm"
              >
                Back to Products
              </Button>
              <div className="h-8 w-px bg-gray-300"></div>
              <div>
                <h1 className="font-display font-bold text-xl text-gray-900">
                  Design {product.name}
                </h1>
                <p className="text-sm text-gray-600">
                  {selectedColor} • {selectedSize} • Qty: {quantity}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="accent" size="lg" className="font-bold">
                <ApperIcon name="DollarSign" className="w-4 h-4 mr-1" />
${calculatePrice().toFixed(2)}
              </Badge>
{design && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveDesign}
                  icon="Bookmark"
                  className="ml-2"
                >
                  Save Design
                </Button>
              )}
              <Button
                onClick={handleAddToCart}
                disabled={!design}
                icon="ShoppingCart"
                size="lg"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Canvas */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <DesignCanvas
              product={product}
              design={design}
              selectedColor={selectedColor}
              onDesignUpdate={handleDesignUpdate}
              onColorChange={setSelectedColor}
            />

            {/* Product Options */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-display font-bold text-lg text-gray-900 mb-4">Product Options</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Size Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Size:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 px-4 border rounded-lg font-medium transition-all duration-200 ${
                          selectedSize === size
                            ? "border-primary bg-primary text-white"
                            : "border-gray-300 hover:border-primary"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Quantity:</label>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <ApperIcon name="Minus" className="w-4 h-4" />
                    </Button>
                    <span className="font-bold text-xl min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <ApperIcon name="Plus" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Design Tools */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {!design ? (
              <DesignUploader
                onDesignUpload={handleDesignUpload}
                onTemplateClick={() => setShowTemplates(true)}
              />
            ) : (
              <DesignControls
                design={design}
                onSizeChange={(width) => handleDesignUpdate({
                  ...design,
                  size: { width, height: width }
                })}
                onRotationChange={(rotation) => handleDesignUpdate({
                  ...design,
                  rotation
                })}
                onPositionChange={(position) => handleDesignUpdate({
                  ...design,
                  position
                })}
                onRemove={handleRemoveDesign}
              />
            )}

            {/* Add Another Design */}
            {design && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-medium text-gray-900 mb-4">Add More Designs</h3>
                <div className="grid grid-cols-2 gap-3">
<Button
                    variant="outline"
                    onClick={() => document.querySelector('input[type="file"]')?.click()}
                    icon="Upload"
                  >
                    Upload New
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowTemplates(true)}
                    icon="Palette"
                  >
                    Templates
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowSavedDesigns(true)}
                    icon="Bookmark"
                  >
                    Saved Designs
                  </Button>
                </div>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="bg-gradient-to-r from-primary/5 to-primary-light/5 rounded-xl p-6">
              <h3 className="font-display font-bold text-lg text-gray-900 mb-4">Price Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base price ({product.name}):</span>
                  <span>${product.basePrice.toFixed(2)}</span>
                </div>
                {design && (
                  <div className="flex justify-between">
                    <span>Custom design fee:</span>
                    <span>$5.00</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span>× {quantity}</span>
                </div>
                <div className="border-t border-primary/20 pt-2 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-primary">${calculatePrice().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Template Gallery Modal */}
      <TemplateGallery
        isOpen={showTemplates}
        onClose={() => setShowTemplates(false)}
        templates={templates}
        loading={templatesLoading}
        onSelectTemplate={handleTemplateSelect}
      />
<SavedDesignsGallery
        isOpen={showSavedDesigns}
        onClose={() => setShowSavedDesigns(false)}
        savedDesigns={savedDesigns}
        loading={false}
        onSelectDesign={handleSelectSavedDesign}
        onDeleteDesign={handleDeleteSavedDesign}
      />
    </div>
  );
};

export default DesignStudio;