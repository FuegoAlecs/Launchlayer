// Atlantic Experience Animation Handler
export function initAtlantic() {
  if (typeof window === 'undefined') return;

  const atlanticScene = document.querySelector('.atlantic-scene');
  if (!atlanticScene) return;

  let mouseX = 0;
  let mouseY = 0;
  let currentCount = 0;
  const MAX_CURRENTS = 5;
  const MAX_SPLASHES = 3;

  // Mouse movement handler
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    // Calculate normalized mouse position (-1 to 1)
    mouseX = (clientX / innerWidth) * 2 - 1;
    mouseY = (clientY / innerHeight) * 2 - 1;
    
    // Update CSS variables for ocean movement
    document.documentElement.style.setProperty('--mouse-x-offset', `${mouseX * 20}px`);
    document.documentElement.style.setProperty('--mouse-y-offset', `${mouseY * 20}px`);
  };

  // Create ocean current
  const createOceanCurrent = () => {
    if (currentCount >= MAX_CURRENTS) return;
    
    const current = document.createElement('div');
    current.className = 'ocean-current';
    
    // Randomize current properties
    const duration = 15 + Math.random() * 10;
    const height = 50 + Math.random() * 100;
    const top = Math.random() * 100;
    const opacity = 0.1 + Math.random() * 0.2;
    
    current.style.setProperty('--duration', `${duration}s`);
    current.style.height = `${height}px`;
    current.style.top = `${top}%`;
    current.style.opacity = opacity;
    
    const oceanCurrents = atlanticScene.querySelector('.ocean-currents');
    oceanCurrents.appendChild(current);
    
    currentCount++;
    
    // Remove current after animation
    current.addEventListener('animationend', () => {
      current.remove();
      currentCount--;
    });
  };

  // Create foam splash
  const createSplash = (x, y) => {
    const splash = document.createElement('div');
    splash.className = 'splash';
    
    // Randomize splash properties
    const size = 50 + Math.random() * 100;
    splash.style.width = `${size}px`;
    splash.style.height = `${size}px`;
    splash.style.left = `${x}px`;
    splash.style.top = `${y}px`;
    
    const oceanFoam = atlanticScene.querySelector('.ocean-foam');
    oceanFoam.appendChild(splash);
    
    // Remove splash after animation
    splash.addEventListener('animationend', () => {
      splash.remove();
    });
  };

  // Create ripple effect
  const createRipple = (x, y) => {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    document.body.appendChild(ripple);
    
    // Remove ripple after animation
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  };

  // Click handler for splash effects
  const handleClick = (e) => {
    const { clientX, clientY } = e;
    createRipple(clientX, clientY);
    createSplash(clientX, clientY);
  };

  // Add event listeners
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('click', handleClick);

  // Create initial currents
  for (let i = 0; i < MAX_CURRENTS; i++) {
    setTimeout(() => createOceanCurrent(), i * 2000);
  }

  // Periodically create new currents
  const currentInterval = setInterval(() => {
    if (currentCount < MAX_CURRENTS) {
      createOceanCurrent();
    }
  }, 5000);

  // Periodically create random splashes
  const splashInterval = setInterval(() => {
    if (Math.random() > 0.7) {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      createSplash(x, y);
    }
  }, 2000);

  // Cleanup function
  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('click', handleClick);
    clearInterval(currentInterval);
    clearInterval(splashInterval);
  };
} 