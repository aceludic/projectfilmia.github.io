import React, { useState } from 'react';

interface HomePageProps {
  onEnter: () => void;
}

const Feature: React.FC<{ icon: React.ReactNode; title: string; children: string }> = ({ icon, title, children }) => (
    <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-brand-brown-700/10 text-brand-brown-700">
            {icon}
        </div>
        <div>
            <h3 className="text-md font-bold text-stone-800 dark:text-beige-100">{title}</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{children}</p>
        </div>
    </div>
);

const HomePage: React.FC<HomePageProps> = ({ onEnter }) => {
  const [isEntering, setIsEntering] = useState(false);
  
  const handleDiveIn = () => {
    setIsEntering(true);
    setTimeout(() => {
        onEnter();
    }, 250); // 0.25 second animation
  };

  return (
    <div className={`relative min-h-screen flex items-center justify-center overflow-hidden pt-20 transition-opacity duration-500 ${isEntering ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute top-1/2 left-1/2 w-1 h-1">
        <div className="absolute w-[50vmax] h-[50vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-beige-300 dark:border-stone-700 animate-ripple" style={{ animationDelay: '0s' }}></div>
        <div className="absolute w-[50vmax] h-[50vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-beige-300/80 dark:border-stone-700/80 animate-ripple" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-[50vmax] h-[50vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-beige-300/60 dark:border-stone-700/60 animate-ripple" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-20 text-center px-4 animate-fade-in-up">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-brown-800 to-brand-brown-600 uppercase">
          Discover Your Media Story
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-stone-700 dark:text-stone-300 mb-8">
          Your essential toolkit for media and film studies. No sign-up required.
        </p>

        <div className="max-w-2xl mx-auto my-8 p-4 bg-red-100/50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-800 dark:text-red-300 rounded-r-lg" role="alert">
            <p className="font-bold">Early Access Warning</p>
            <p className="text-sm mt-1">
                This website is in active development. You may encounter issues, glitches, and incorrect information. The full release is coming soon. <strong>See the "Full Release" schedule in the top bar to find out more.</strong>
                Please report any problems you find in the <strong>Settings menu</strong>. Thank you for your feedback!
            </p>
        </div>
        
        <div className="max-w-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-12">
            <Feature icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>} title="Privacy-Focused">
                Enjoy complete peace of mind. All your data is stored locally on your device, not on our servers.
            </Feature>
            <Feature icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>} title="Instant Access">
                No accounts, no passwords. Jump straight into the content and start exploring without any barriers.
            </Feature>
        </div>

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

      </div>
    </div>
  );
};

export default HomePage;