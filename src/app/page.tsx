'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { initBubbles } from './bubbles';

const stackVariants = {
  initial: (custom: number) => ({
    opacity: 0,
    x: '120%',
    y: custom === 0 ? '-10%' : `${custom * 8}%`,
    scale: custom === 0 ? 0.9 : 0.85,
    rotateZ: custom === 0 ? 5 : custom * 3,
    rotateY: custom === 0 ? 15 : custom * 8,
    rotateX: custom === 0 ? 0 : custom * 4,
    zIndex: 3 - custom,
  }),
  animate: (custom: number) => ({
    opacity: custom === 0 ? 1 : 0.6 - (custom * 0.15),
    x: 0,
    y: `${custom * 5}%`,
    scale: custom === 0 ? 1 : 0.92 - (custom * 0.02),
    rotateZ: custom * 2,
    rotateY: custom * 4,
    rotateX: custom * 2,
    zIndex: 3 - custom,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 90,
      mass: 1,
      velocity: 2,
      restDelta: 0.001,
      delayChildren: custom * 0.1,
    }
  }),
  exit: (custom: number) => ({
    opacity: 0,
    x: '-120%',
    y: custom === 0 ? '10%' : `${custom * 8}%`,
    scale: 0.85,
    rotateZ: -5 - (custom * 2),
    rotateY: -15 - (custom * 4),
    rotateX: custom * -2,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 120,
      mass: 0.8,
      velocity: 2,
      restDelta: 0.001,
    }
  })
};

const textVariants = {
  initial: {
    opacity: 0,
    clipPath: 'inset(0 100% 0 0)',
  },
  animate: {
    opacity: 1,
    clipPath: 'inset(0 0% 0 0)',
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1],
      opacity: {
        duration: 0.2
      }
    }
  },
  exit: {
    opacity: 0,
    clipPath: 'inset(0 0 0 100%)',
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
      opacity: {
        duration: 0.1,
        delay: 0.5
      }
    }
  }
};

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  
  const phrases = [
    "Building a vibrant LaunchLayer Network",
    "Connecting innovators worldwide",
    "Empowering the next generation",
    "Creating the future together"
  ];

  const yesterdayMessages = [
    "Yesterday's Innovation",
    "Past Achievements",
    "Previous Milestones"
  ];

  const tomorrowMessages = [
    "Tomorrow's Vision",
    "Future Innovation",
    "Next Generation"
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [stacks, setStacks] = useState({
    yesterday: [0, 1, 2],
    tomorrow: [0, 1, 2]
  });

  // Fish state
  const [fishes, setFishes] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
      setStacks(prev => ({
        yesterday: [...prev.yesterday.slice(1), prev.yesterday[0]],
        tomorrow: [...prev.tomorrow.slice(1), prev.tomorrow[0]]
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const typingInterval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 4000); // Change phrase every 4 seconds

    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    const cleanup = initBubbles();
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  // Create Atlantic fish
  useEffect(() => {
    const createFish = () => {
      const newFish = {
        id: Date.now() + Math.random(),
        top: Math.random() * 80 + 10, // 10-90%
        direction: Math.random() > 0.5 ? 1 : -1,
        duration: Math.random() * 20 + 30, // 30-50s
        size: Math.random() * 15 + 10, // 10-25px
        delay: Math.random() * 5 // 0-5s
      };
      
      setFishes(prev => [...prev, newFish]);
      
      // Remove fish after animation completes
      setTimeout(() => {
        setFishes(prev => prev.filter(fish => fish.id !== newFish.id));
      }, (newFish.duration + newFish.delay) * 1000);
    };
    
    // Create initial fish
    for (let i = 0; i < 5; i++) {
      setTimeout(() => createFish(), i * 2000);
    }
    
    // Create new fish periodically
    const fishInterval = setInterval(() => {
      createFish();
    }, 8000);
    
    return () => clearInterval(fishInterval);
  }, []);

  // Add mouse tracking for the waitlist heading glow effect
  useEffect(() => {
    // Wait for the component to be fully mounted
    const timer = setTimeout(() => {
      const handleMouseMove = (e: MouseEvent) => {
        const headingElement = document.querySelector('.waitlist-heading') as HTMLElement;
        if (headingElement) {
          const rect = headingElement.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          setMousePosition({ x, y });
          
          // Update CSS variables for the glow effect
          headingElement.style.setProperty('--mouse-x', `${x}%`);
          headingElement.style.setProperty('--mouse-y', `${y}%`);
        }
      };

      window.addEventListener('mousemove', handleMouseMove);
      
      // Clean up function
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        clearTimeout(timer);
      };
    }, 500); // Small delay to ensure DOM is ready
    
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setStatus({ message: data.message, type: 'success' });
      setFormData({ name: '', email: '' });
    } catch (error: any) {
      setStatus({ message: error.message, type: 'error' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-white">
      <div className="atlantic-scene">
        <div className="ocean-surface"></div>
        <div className="ocean-currents"></div>
        <div className="ocean-depths"></div>
        <div className="ocean-foam"></div>
        
        {/* White spray effects */}
        <div className="white-spray"></div>
        
        {/* Foam particles */}
        <div className="foam-particles">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i} 
              className="foam-particle"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${Math.random() * 10 + 15}s`
              }}
            />
          ))}
        </div>
        
        {/* Atlantic Fish */}
        {fishes.map(fish => (
          <div
            key={fish.id}
            className="atlantic-fish"
            style={{
              top: `${fish.top}%`,
              width: `${fish.size}px`,
              height: `${fish.size / 2}px`,
              animationDelay: `${fish.delay}s`,
              ['--direction' as string]: fish.direction,
              ['--duration' as string]: `${fish.duration}s`
            }}
          />
        ))}
      </div>
      
      <div className="liquid-background"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Logo Section */}
        <motion.div 
          className="flex justify-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="logo-container">
            <Image
              src="/logo.png"
              alt="Logo"
              width={240}
              height={53}
              className="h-auto"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Yesterday Stack */}
          <div className="relative">
            <div className="stack-header mb-6 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={`yesterday-title-${activeIndex}`}
                  variants={textVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="text-xl"
                >
                  {yesterdayMessages[activeIndex]}
                </motion.h2>
              </AnimatePresence>
            </div>
            
            <div className="stack-container relative h-[400px] overflow-hidden" style={{ perspective: '1200px' }}>
              <div className="stack-particles">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="stack-particle"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      ['--x-end' as string]: `${Math.random() * 200 - 100}px`,
                      ['--y-end' as string]: `${Math.random() * 200 - 100}px`,
                      animationDelay: `${Math.random() * 15}s`,
                      animationDuration: `${Math.random() * 10 + 10}s`
                    } as React.CSSProperties}
                  />
                ))}
              </div>
              <AnimatePresence mode="popLayout" initial={false}>
                {stacks.yesterday.map((index, arrayIndex) => (
                  <motion.div
                    key={`yesterday-${index}`}
                    className="stack-item"
                    custom={arrayIndex}
                    variants={stackVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      transformOrigin: 'center center',
                    }}
                  >
                    <motion.div 
                      className="glass-card rounded-lg overflow-hidden w-full h-full"
                      style={{
                        willChange: 'transform'
                      }}
                    >
                      <Image
                        src={`/yesterday${index + 1}.png`}
                        alt={`Yesterday ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Updated Today/Waitlist Section */}
          <div className="relative z-10">
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold mb-4 waitlist-heading">
                Join the Waitlist
              </h2>
              <div className="typing-container">
                <motion.p
                  key={currentPhraseIndex}
                  className="sub-heading typing-effect text-lg font-medium"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  exit={{ width: "0%" }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    type: "spring",
                    stiffness: 50
                  }}
                >
                  {phrases[currentPhraseIndex]}
                </motion.p>
              </div>
            </motion.div>

            <motion.div
              className="glass-card-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-group">
                  <label htmlFor="name" className="block text-sm font-medium text-white mb-1">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-1">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    required
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>
                {status && (
                  <div className={`text-center ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {status.message}
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-white text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                >
                  Join Waitlist
                </button>
              </form>
            </motion.div>
          </div>

          {/* Tomorrow Stack */}
          <div className="relative">
            <div className="stack-header mb-6 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={`tomorrow-title-${activeIndex}`}
                  variants={textVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="text-xl"
                >
                  {tomorrowMessages[activeIndex]}
                </motion.h2>
              </AnimatePresence>
            </div>
            
            <div className="stack-container relative h-[400px] overflow-hidden" style={{ perspective: '1200px' }}>
              <div className="stack-particles">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="stack-particle"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      ['--x-end' as string]: `${Math.random() * 200 - 100}px`,
                      ['--y-end' as string]: `${Math.random() * 200 - 100}px`,
                      animationDelay: `${Math.random() * 15}s`,
                      animationDuration: `${Math.random() * 10 + 10}s`
                    } as React.CSSProperties}
                  />
                ))}
              </div>
              <AnimatePresence mode="popLayout" initial={false}>
                {stacks.tomorrow.map((index, arrayIndex) => (
                  <motion.div
                    key={`tomorrow-${index}`}
                    className="stack-item"
                    custom={arrayIndex}
                    variants={stackVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      transformOrigin: 'center center',
                    }}
                  >
                    <motion.div 
                      className="glass-card rounded-lg overflow-hidden w-full h-full"
                      style={{
                        willChange: 'transform'
                      }}
                    >
                      <Image
                        src={`/tomorrow${index + 1}.png`}
                        alt={`Tomorrow ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}