'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { initAtlantic } from '../atlantic';

export default function AtlanticExperience() {
  useEffect(() => {
    const cleanup = initAtlantic();
    return () => cleanup();
  }, []);

  return (
    <div className="atlantic-scene">
      <div className="ocean-surface" />
      <div className="ocean-currents" />
      <div className="ocean-foam" />
      
      <motion.div 
        className="glass-card-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-2xl font-bold mb-4">Atlantic Experience</h2>
        <p className="text-lg mb-6">
          Dive into the depths of the Atlantic Ocean with our immersive experience.
          Watch as ocean currents flow and interact with your movements.
        </p>
        
        <div className="space-y-4">
          <div className="form-group">
            <input type="text" id="name" className="form-input" />
            <label htmlFor="name">Your Name</label>
          </div>
          
          <div className="form-group">
            <input type="email" id="email" className="form-input" />
            <label htmlFor="email">Email Address</label>
          </div>
          
          <motion.button
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Experience
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
} 