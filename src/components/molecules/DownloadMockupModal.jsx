import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const DownloadMockupModal = ({ isOpen, onClose, canvasRef, product, design }) => {
  const [selectedResolution, setSelectedResolution] = useState('2048x2560');
  const [selectedFormat, setSelectedFormat] = useState('PNG');
  const [isDownloading, setIsDownloading] = useState(false);

  const resolutionOptions = [
    { value: '1024x1280', label: '1024×1280 (Standard)', size: '1.3 MP' },
    { value: '2048x2560', label: '2048×2560 (High)', size: '5.2 MP' },
    { value: '4096x5120', label: '4096×5120 (Ultra)', size: '21 MP' }
  ];

  const formatOptions = [
    { value: 'PNG', label: 'PNG', desc: 'Best quality, transparent background' },
    { value: 'JPG', label: 'JPG', desc: 'Smaller file size, white background' }
  ];

const handleDownload = async () => {
    if (!canvasRef?.current) {
      toast.error('Canvas not available for download');
      return;
    }
    if (!design) {
      toast.error('No design to download');
      return;
    }

    setIsDownloading(true);
    
try {
      // Dynamically import html2canvas
      const html2canvas = (await import('html2canvas')).default;
      
      const [width, height] = selectedResolution.split('x').map(Number);
      const canvas = canvasRef.current;
      
      // Create high-resolution canvas with enhanced options
      const screenshot = await html2canvas(canvas, {
        width: canvas.offsetWidth,
        height: canvas.offsetHeight,
        scale: Math.max(width / canvas.offsetWidth, height / canvas.offsetHeight),
        useCORS: true,
        allowTaint: true,
        backgroundColor: selectedFormat === 'JPG' ? '#FFFFFF' : null,
        logging: false,
        imageTimeout: 0,
        removeContainer: true
      });

// Create download link with better filename and quality
      const link = document.createElement('a');
      const sanitizedProductName = product?.name?.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'mockup';
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `${sanitizedProductName}-${timestamp}-${selectedResolution}.${selectedFormat.toLowerCase()}`;
      
      if (selectedFormat === 'PNG') {
        link.href = screenshot.toDataURL('image/png');
      } else {
        link.href = screenshot.toDataURL('image/jpeg', 0.98);
      }
      
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Mockup downloaded as ${filename}`);
      onClose();
      
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download mockup. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Download" className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-gray-900">
                    Download Mockup
                  </h3>
                  <p className="text-sm text-gray-600">
                    Choose your preferred settings
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                icon="X"
                className="text-gray-400 hover:text-gray-600"
              />
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-6">
            {/* Resolution Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Resolution
              </label>
              <div className="space-y-2">
                {resolutionOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedResolution === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="resolution"
                        value={option.value}
                        checked={selectedResolution === option.value}
                        onChange={(e) => setSelectedResolution(e.target.value)}
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {option.label}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {option.size}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Format
              </label>
              <div className="space-y-2">
                {formatOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedFormat === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="format"
                        value={option.value}
                        checked={selectedFormat === option.value}
                        onChange={(e) => setSelectedFormat(e.target.value)}
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {option.label}
                        </div>
                        <div className="text-xs text-gray-500">
                          {option.desc}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isDownloading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDownload}
                disabled={isDownloading || !design}
                icon={isDownloading ? "Loader2" : "Download"}
                className={isDownloading ? "animate-spin" : ""}
              >
                {isDownloading ? 'Downloading...' : 'Download'}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DownloadMockupModal;