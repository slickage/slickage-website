'use client';

import React, { useState } from 'react';
import LoadingSpinner, { LoadingSpinnerOverlay } from '@/components/ui/LoadingSpinner';
import { motion } from 'motion/react';

export default function SpinnerTestPage() {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Loading Spinner Test Gallery
        </h1>

        {/* Individual Spinners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 text-center"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-white text-lg mb-4">Small Spinner</h3>
            <div className="flex justify-center">
              <LoadingSpinner size="sm" />
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 text-center"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-white text-lg mb-4">Medium Spinner</h3>
            <div className="flex justify-center">
              <LoadingSpinner size="md" />
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 text-center"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-white text-lg mb-4">Large Spinner</h3>
            <div className="flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          </motion.div>
        </div>

        {/* Card with Overlay Example */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Card Loading State Example</h2>
          <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl h-64 overflow-hidden">
            <div className="p-6">
              <h3 className="text-white text-xl mb-2">Sample Card Content</h3>
              <p className="text-gray-400">
                This simulates how the spinner looks in a card loading state.
              </p>
              <button
                onClick={() => setShowOverlay(!showOverlay)}
                className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                {showOverlay ? 'Hide' : 'Show'} Loading Overlay
              </button>
            </div>
            {showOverlay && <LoadingSpinnerOverlay />}
          </div>
        </div>

        {/* Color Variations */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Background Variations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-8 text-center">
              <h3 className="text-gray-900 text-lg mb-4">On Light Background</h3>
              <LoadingSpinner size="lg" />
            </div>
            <div className="bg-black rounded-xl p-8 text-center">
              <h3 className="text-white text-lg mb-4">On Dark Background</h3>
              <LoadingSpinner size="lg" />
            </div>
          </div>
        </div>

        {/* Performance Note */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-blue-400 text-lg font-semibold mb-2">Performance Notes</h3>
          <ul className="text-gray-300 space-y-1">
            <li>• Uses CSS animations for optimal performance</li>
            <li>• Layered spinner effect with staggered timing</li>
            <li>• Gradient colors matching brand theme</li>
            <li>• Responsive sizing options</li>
            <li>• Reusable component with overlay variant</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
