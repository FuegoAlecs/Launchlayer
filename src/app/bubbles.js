// Bubble generation and underwater effects
export function initBubbles() {
  const container = document.querySelector('.liquid-background');
  if (!container) return;

  // Clear any existing bubbles
  container.innerHTML = '';
  
  // Track bubble count for performance
  let bubbleCount = 0;
  const MAX_BUBBLES = 50;
  
  // Mouse position for interactive effects
  let mouseX = 0;
  let mouseY = 0;
  
  // Track mouse movement for interactive effects
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function createBubble() {
    if (bubbleCount >= MAX_BUBBLES) return;
    
    bubbleCount++;
    
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    // Randomize bubble properties
    const size = Math.random() * 15 + 5; // 5-20px
    const startX = Math.random() * 100; // 0-100%
    const duration = Math.random() * 10 + 15; // 15-25s
    const delay = Math.random() * 5; // 0-5s
    const opacity = Math.random() * 0.5 + 0.3; // 0.3-0.8
    const zOffset = Math.random() * 100 - 50; // -50 to 50px
    
    // Set bubble styles
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${startX}%`;
    bubble.style.bottom = '0';
    bubble.style.opacity = opacity;
    bubble.style.setProperty('--duration', `${duration}s`);
    bubble.style.setProperty('--delay', `${delay}s`);
    bubble.style.setProperty('--x-start', `${startX}%`);
    bubble.style.setProperty('--x-mid-offset', `${Math.random() * 40 - 20}%`);
    bubble.style.setProperty('--x-end', `${startX + (Math.random() * 40 - 20)}%`);
    bubble.style.setProperty('--z-offset', zOffset);
    bubble.style.animationDelay = `${delay}s`;
    
    // Add bubble to container
    container.appendChild(bubble);
    
    // Remove bubble after animation completes
    bubble.addEventListener('animationend', () => {
      bubble.remove();
      bubbleCount--;
    });
    
    // Add interactive behavior based on mouse position
    const updateBubblePosition = () => {
      if (!bubble.isConnected) return;
      
      const rect = bubble.getBoundingClientRect();
      const bubbleX = rect.left + rect.width / 2;
      const bubbleY = rect.top + rect.height / 2;
      
      // Calculate distance from mouse
      const distanceX = mouseX - bubbleX;
      const distanceY = mouseY - bubbleY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      
      // Apply force if within range
      if (distance < 200) {
        const force = (200 - distance) / 200;
        const moveX = (distanceX / distance) * force * 2;
        const moveY = (distanceY / distance) * force * 2;
        
        bubble.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
    };
    
    // Update bubble position periodically
    const intervalId = setInterval(updateBubblePosition, 100);
    
    // Clean up interval when bubble is removed
    bubble.addEventListener('remove', () => {
      clearInterval(intervalId);
    });
  }
  
  // Create initial set of bubbles
  for (let i = 0; i < 20; i++) {
    setTimeout(() => createBubble(), i * 200);
  }
  
  // Create bubbles continuously
  const interval = setInterval(() => {
    createBubble();
  }, 500);
  
  // Return cleanup function
  return () => {
    clearInterval(interval);
    container.innerHTML = '';
  };
} 