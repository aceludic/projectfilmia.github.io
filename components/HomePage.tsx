

import React, { useState, useEffect, useLayoutEffect } from 'react';

interface HomePageProps {
  onEnter: (skipSetup?: boolean) => void;
}

const mediaTerms = [
    'Mise-en-scène', 'Semiotics', 'Binary Opposites', 'Hegemony', 'Postmodernism', 'Intertextuality',
    'Representation', 'Genre Theory', 'Narrative', 'Audience Positioning', 'Ideology', 'Feminist Theory',
    'Post-colonialism', 'Synergy', 'Convergence', 'Regulation', 'Public Service Broadcasting', 'Neoliberalism',
    'Moral Panic', 'Fandom', 'Participatory Culture', 'Textual Poaching', 'Uses and Gratifications', 'Cultivation Theory',
    'The Male Gaze', 'Simulacra', 'Hyperreality', 'Bricolage', 'Pastiche', 'Denotation', 'Connotation',
];

const features = [
    {
        imageUrl: 'https://i.pinimg.com/736x/2f/72/e7/2f72e74935b7206a316a8a4ddb94668c.jpg',
        text: 'AI-Powered Revision',
        rotation: '-8deg',
        position: 'absolute top-[10%] left-[15%] md:top-[15%] md:left-[20%]',
        delay: '0s',
    },
    {
        imageUrl: 'https://i.pinimg.com/736x/19/0d/a2/190da2d0f64cab008a6f9913eede61dc.jpg',
        text: 'In-Depth Study Hub',
        rotation: '5deg',
        position: 'absolute top-[60%] left-[5%] md:top-[55%] md:left-[10%]',
        delay: '0.2s',
    },
    {
        imageUrl: 'https://i.pinimg.com/736x/2e/88/40/2e88409890631640455b243c98c36949.jpg',
        text: 'Customizable Dashboard',
        rotation: '-3deg',
        position: 'absolute top-[25%] right-[15%] md:top-[20%] md:right-[22%]',
        delay: '0.1s',
    },
    {
        imageUrl: 'https://i.pinimg.com/736x/6f/03/6c/6f036c45b87129d3cd1ba5d44821ed3f.jpg',
        text: 'Your Media Journal',
        rotation: '10deg',
        position: 'absolute top-[65%] right-[8%] md:top-[60%] md:right-[15%]',
        delay: '0.3s',
    },
    {
        imageUrl: 'https://i.pinimg.com/736x/50/1a/a0/501aa065d6b8cff07c13ba5833de47c6.jpg',
        text: 'Private & Local Storage',
        rotation: '-5deg',
        position: 'absolute bottom-[5%] left-[50%] -translate-x-1/2',
        delay: '0.4s',
    },
];

const BackgroundTerminology: React.FC = () => {
    // Create lines of text that will scroll up, making a wide wall of text.
    const terms = Array(150).fill(mediaTerms).flat(); // Make a very long list of terms
    const lines: string[] = [];
    const termsPerLine = 15; // Number of terms to join into a single line

    // Group terms into lines
    for (let i = 0; i < terms.length; i += termsPerLine) {
        lines.push(terms.slice(i, i + termsPerLine).join('       ')); // Use large spaces to separate
    }

    return (
        <div className="intro-terminology-bg">
            <div className="w-full h-full flex flex-col overflow-hidden">
                <div className="w-full text-center font-bold whitespace-nowrap">
                    <div className={'pulsating-scroll-text'}>
                        {/* Duplicate the content for seamless scrolling */}
                        <div>{lines.map((line, i) => <p key={i} className="py-2">{line}</p>)}</div>
                        <div>{lines.map((line, i) => <p key={i} className="py-2">{line}</p>)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const Polaroid: React.FC<{ imageUrl: string; text: string; rotation: string; position: string; delay: string; index: number }> = ({ imageUrl, text, rotation, position, delay, index }) => (
  <figure
    data-index={index}
    className={`polaroid w-36 h-44 md:w-44 md:h-52 bg-white p-3 shadow-2xl ${position}`}
    style={{
      '--end-rotate': rotation, // CSS custom property for animation
      animationDelay: `${delay}`, // Initial delay for floatIn, will be updated by JS
    }}
  >
    <div className="bg-stone-200 h-24 md:h-32">
        <img src={imageUrl} alt={text} className="w-full h-full object-cover"/>
    </div>
    <figcaption className="mt-2 text-center text-xs md:text-sm font-semibold text-stone-800 tracking-tight">
      {text}
    </figcaption>
  </figure>
);


const HomePage: React.FC<HomePageProps> = ({ onEnter }) => {
  const [isEntering, setIsEntering] = useState(false);
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [isUpgradeWarningVisible, setIsUpgradeWarningVisible] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (password === '1234') {
      onEnter(true); // Skip setup
    }
  }, [password, onEnter]);

  useEffect(() => {
    const hasDismissed = sessionStorage.getItem('hasDismissedEarlyAccessWarning');
    if (!hasDismissed) {
      // Show after a slight delay to not be too jarring
      const timer = setTimeout(() => setIsWarningVisible(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);
  
  useEffect(() => {
    const hasDismissedUpgrade = sessionStorage.getItem('hasDismissedUpgradeWarning');
    if (!hasDismissedUpgrade) {
        setIsUpgradeWarningVisible(true);
    }
  }, []);

  const handleDismissWarning = () => {
    sessionStorage.setItem('hasDismissedEarlyAccessWarning', 'true');
    setIsWarningVisible(false);
  };
  
  const handleDismissUpgradeWarning = () => {
    sessionStorage.setItem('hasDismissedUpgradeWarning', 'true');
    setIsUpgradeWarningVisible(false);
  };


  useLayoutEffect(() => {
    // Defer to allow elements to render and get correct positions
    const timeoutId = setTimeout(() => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const waveSpeed = 600; // pixels per second

        features.forEach((feature, i) => {
            const element = document.querySelector(`.polaroid[data-index='${i}']`) as HTMLElement;
            if (!element) return;

            const rect = element.getBoundingClientRect();
            if (rect.width === 0) return; // Skip if not rendered
            
            const elCenterX = rect.left + rect.width / 2;
            const elCenterY = rect.top + rect.height / 2;
            const distance = Math.sqrt(Math.pow(elCenterX - centerX, 2) + Math.pow(elCenterY - centerY, 2));
            
            const waveDelay = distance / waveSpeed;
            const baseDelay = parseFloat(feature.delay);
            
            // Set staggered animation delays for floatIn and the infinite wave
            element.style.animationDelay = `${baseDelay}s, ${baseDelay + 0.8 + waveDelay}s`;
        });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);


  // Ripple Canvas Effect
  useEffect(() => {
    const canvas = document.getElementById('ripple-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let animationFrameId: number;
    
    const resizeHandler = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeHandler);

    interface Ripple {
        x: number; y: number; radius: number; opacity: number; speed: number; fade: number; lineWidth: number;
    }
    
    let ripples: Ripple[] = [];
    let frameCount = 0;

    function animate() {
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);
        frameCount++;

        if (frameCount % 150 === 0) { // Add a new ripple every 2.5 seconds
             ripples.push({ 
                x: width / 2, 
                y: height / 2, 
                radius: 0, 
                opacity: 1, 
                speed: 4, // Faster expansion
                fade: 0.002, // Slower fade for longer life
                lineWidth: Math.random() * 2 + 1,
             });
        }
        
        ripples.forEach((r, i) => {
            r.radius += r.speed;
            r.opacity -= r.fade;
            if (r.opacity <= 0) {
                ripples.splice(i, 1);
            } else {
                ctx.beginPath();
                ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
                const isDark = document.documentElement.classList.contains('dark');
                const color = isDark ? `rgba(255, 255, 255, ${r.opacity * 0.1})` : `rgba(0, 0, 0, ${r.opacity * 0.05})`;
                ctx.strokeStyle = color;
                ctx.lineWidth = r.lineWidth;
                ctx.stroke();
            }
        });
        
        animationFrameId = requestAnimationFrame(animate);
    }
    
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resizeHandler);
    };

  }, []);


  const handleDiveIn = () => {
    setIsEntering(true);
    setTimeout(() => {
        onEnter(false);
    }, 250); // 0.25 second animation
  };

  return (
    <div className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-opacity duration-500 ${isEntering ? 'opacity-0' : 'opacity-100'}`}>
        {isUpgradeWarningVisible && (
            <div className="fixed top-0 left-0 right-0 z-[60] bg-indigo-600 text-white p-3 text-center animate-slide-down shadow-lg">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <p className="text-sm font-medium flex-grow text-center">
                        <strong>Heads Up!</strong> Elements are being worked on, and over the next day core features may not work as we upgrade them. Check back again soon for updates.
                    </p>
                    <button onClick={handleDismissUpgradeWarning} className="ml-4 text-2xl font-light leading-none hover:opacity-75 transition-opacity">&times;</button>
                </div>
            </div>
        )}
        <>
            <canvas id="ripple-canvas" className="absolute inset-0 z-[-1]"></canvas>
            <BackgroundTerminology />
            <div className="intro-light-leak" />
            <div className="intro-light-leak-2" />
            <div className="intro-light-leak-3" />
            <div className="film-scratches-overlay" />
            <div className="absolute inset-0 z-2 scale-90 md:scale-100">
                {features.map((feature, i) => (
                    <Polaroid key={i} index={i} {...feature} />
                ))}
            </div>
        </>

      <div className="relative z-20 text-center px-4">
        <div className="animate-fade-in" style={{ animationDelay: '1.5s' }}>
            <h1 
              className="text-5xl md:text-7xl font-black tracking-tight mb-4 text-stone-800 dark:text-beige-100 uppercase text-glow-deep"
            >
              Discover Your Media Story
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-stone-700 dark:text-stone-300 mb-8">
              Your essential toolkit for media and film studies. No sign-up required.
            </p>
            
            <button
              onClick={handleDiveIn}
              disabled={isEntering}
              className="relative w-48 h-16 px-6 py-3 text-xl font-black text-white bg-brand-brown-700 rounded-lg shadow-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-brown-700"
            >
              <span className={`transition-opacity duration-300 ${isEntering ? 'opacity-0' : 'opacity-100'}`}>Dive In</span>
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isEntering ? 'opacity-100' : 'opacity-0'}`}>
                <div className="w-full bg-brand-brown-800/50 h-full absolute left-0 top-0">
                  <div className="h-full bg-brand-brown-600 animate-loading-bar"></div>
                </div>
                <span className="relative z-10 text-sm tracking-widest uppercase">Loading...</span>
              </div>
            </button>
            <div className="mt-8 opacity-50">
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Master Password"
                    className="mx-auto block w-64 px-4 py-2 border border-glass-border dark:border-glass-border-dark rounded-lg bg-glass-300 text-stone-800 dark:text-beige-100 placeholder-stone-500 dark:placeholder-stone-400 focus:ring-2 focus:ring-brand-brown-700 focus:border-transparent text-center"
                    aria-label="Master password for troubleshooting"
                />
            </div>
        </div>
      </div>
       {isWarningVisible && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:max-w-md z-30 bg-glass-200 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 border border-glass-border dark:border-glass-border-dark animate-fade-in-up glass-reflective">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Temporary Notice</p>
              <h3 className="text-lg font-bold text-stone-800 dark:text-beige-100 mt-1">Early Access Warning</h3>
              <p className="text-sm text-stone-700 dark:text-stone-300 mt-2">
                This website is in active development. You may encounter issues, glitches, and incorrect information. The full release is coming soon. See the "Things to Come" schedule in the top bar to find out more.
                <br /><br />
                Please report any problems you find in the Settings menu. Thank you for your feedback!
              </p>
            </div>
            <button
              onClick={handleDismissWarning}
              className="ml-4 flex-shrink-0 p-1.5 rounded-full text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-white hover:bg-white/20 transition-colors"
              aria-label="Dismiss warning"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;