import React, { useState, FormEvent } from 'react';
import { getAllUsers, saveUser, defaultUserData } from '../utils/auth';
import { User } from '../types';

interface HomePageProps {
  onLoginSuccess: (username: string) => void;
  onContinueAsGuest: () => void;
  currentUser: User | null;
  onEnterApp: () => void;
  onLogout: () => void;
}

const features = [
    { imageUrl: 'https://i.pinimg.com/736x/2f/72/e7/2f72e74935b7206a316a8a4ddb94668c.jpg', text: 'AI-Powered Revision', rotation: '-8deg', position: 'absolute top-[10%] left-[5%] md:top-[15%] md:left-[15%]' },
    { imageUrl: 'https://i.pinimg.com/736x/19/0d/a2/190da2d0f64cab008a6f9913eede61dc.jpg', text: 'In-Depth Study Hub', rotation: '5deg', position: 'absolute top-[60%] left-[2%] md:top-[55%] md:left-[8%]' },
    { imageUrl: 'https://i.pinimg.com/736x/2e/88/40/2e88409890631640455b243c98c36949.jpg', text: 'Customizable Dashboard', rotation: '-3deg', position: 'absolute top-[25%] right-[5%] md:top-[20%] md:right-[18%]' },
    { imageUrl: 'https://i.pinimg.com/736x/6f/03/6c/6f036c45b87129d3cd1ba5d44821ed3f.jpg', text: 'Your Media Journal', rotation: '10deg', position: 'absolute top-[65%] right-[2%] md:top-[60%] md:right-[12%]' },
];

const Polaroid: React.FC<{ imageUrl: string; text: string; rotation: string; position: string; delay: string; }> = ({ imageUrl, text, rotation, position, delay }) => (
  <figure className={`polaroid liquid-glass w-36 h-44 md:w-44 md:h-52 p-3 rounded-lg ${position}`} style={{ '--end-rotate': rotation, animationDelay: delay }}>
    <div className="bg-black/10 dark:bg-white/10 h-24 md:h-32 rounded-sm overflow-hidden">
        <img src={imageUrl} alt={text} className="w-full h-full object-cover"/>
    </div>
    <figcaption className="mt-2 text-center text-xs md:text-sm font-semibold text-stone-800 dark:text-beige-100 tracking-tight">{text}</figcaption>
  </figure>
);


const HomePage: React.FC<HomePageProps> = ({ onLoginSuccess, onContinueAsGuest, currentUser, onEnterApp, onLogout }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
        // DEV PASSWORD BYPASS
        if (password === '1234') {
            const devUsername = 'developer';
            const users = getAllUsers();
            if (!users[devUsername]) {
                const devUser: User = { 
                    username: devUsername, 
                    password: 'dev', // dummy password
                    data: { ...defaultUserData, name: 'Developer', setupCompleted: true } 
                };
                saveUser(devUser);
            }
            onLoginSuccess(devUsername);
            setLoading(false);
            return; // Exit after handling dev login
        }

        const users = getAllUsers();
        const lowerCaseUsername = username.toLowerCase().trim();

        if (isLogin) {
            const userKey = Object.keys(users).find(key => key.toLowerCase() === lowerCaseUsername);
            const user = userKey ? users[userKey] : null;

            if (user && user.password === password) {
                onLoginSuccess(user.username);
            } else {
                setError('Invalid username or password.');
            }
        } else { // Sign Up
            const userExists = Object.keys(users).some(key => key.toLowerCase() === lowerCaseUsername);

            if (userExists) {
                setError('Username already exists.');
            } else if (username.trim().length < 3) {
                setError('Username must be at least 3 characters long.');
            } else if (password.length < 4) {
                setError('Password must be at least 4 characters long.');
            } else {
                const newUser: User = { username: username.trim(), password, data: { ...defaultUserData, name: username.trim() } };
                saveUser(newUser);
                onLoginSuccess(newUser.username);
            }
        }
        setLoading(false);
    }, 500);
  };

  return (
    <div className={`relative min-h-screen flex items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 z-2 scale-90 md:scale-100 pointer-events-none">
            {features.map((feature, i) => (
                <Polaroid key={i} {...feature} delay={`${i * 0.1}s`} />
            ))}
        </div>
      
      <main className="relative z-10 w-full max-w-md mx-auto px-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <div className="liquid-glass rounded-2xl p-6 md:p-8">
            
            {currentUser ? (
                 <div className="text-center">
                    <img src="https://i.postimg.cc/c43zLgFy/Gemini-Generated-Image-vcf7cgvcf7cgvcf7-Photoroom.png" alt="Project Filmia Logo" className="h-16 w-16 mx-auto mb-2" />
                    <h1 className="text-2xl font-bold text-stone-800 dark:text-beige-100">Welcome back, {currentUser.data.name}!</h1>
                    <p className="text-stone-600 dark:text-stone-400 mt-2">Your revision hub awaits.</p>
                    <button onClick={onEnterApp} className="w-full mt-6 py-3 bg-brand-brown-700 text-white font-bold rounded-lg btn-ripple text-lg">
                        Enter Dashboard
                    </button>
                    <div className="text-center mt-4">
                        <button onClick={onLogout} className="text-xs text-stone-500 hover:underline">
                            Not {currentUser.data.name}? Log Out
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="text-center mb-6">
                        <img src="https://i.postimg.cc/c43zLgFy/Gemini-Generated-Image-vcf7cgvcf7cgvcf7-Photoroom.png" alt="Project Filmia Logo" className="h-16 w-16 mx-auto mb-2" />
                        <h1 className="text-2xl font-bold text-stone-800 dark:text-beige-100">Welcome to Project Filmia</h1>
                    </div>
                    <div className="flex mb-4 border-b border-glass-border dark:border-glass-border-dark">
                        <button onClick={() => { setIsLogin(true); setError(''); }} className={`flex-1 pb-2 text-sm font-bold transition-colors ${isLogin ? 'text-brand-brown-700 dark:text-amber-400 border-b-2 border-brand-brown-700' : 'text-stone-500'}`}>Log In</button>
                        <button onClick={() => { setIsLogin(false); setError(''); }} className={`flex-1 pb-2 text-sm font-bold transition-colors ${!isLogin ? 'text-brand-brown-700 dark:text-amber-400 border-b-2 border-brand-brown-700' : 'text-stone-500'}`}>Sign Up</button>
                    </div>
                    <form onSubmit={handleAuth} className="space-y-4">
                        <div>
                            <label className="text-sm font-bold text-stone-700 dark:text-beige-200" htmlFor="username">Username</label>
                            <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} required className="mt-1 w-full p-2 border border-glass-border rounded-md bg-glass-300 text-stone-800 dark:text-beige-100" />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-stone-700 dark:text-beige-200" htmlFor="password">Password</label>
                            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 w-full p-2 border border-glass-border rounded-md bg-glass-300 text-stone-800 dark:text-beige-100" />
                        </div>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <button type="submit" disabled={loading} className="w-full py-3 bg-brand-brown-700 text-white font-bold rounded-lg btn-ripple disabled:bg-stone-400">
                            {loading ? '...' : (isLogin ? 'Log In' : 'Create Account')}
                        </button>
                    </form>

                    <div className="relative text-center my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-glass-border dark:border-glass-border-dark"></div>
                        </div>
                        <span className="relative px-2 bg-glass-200 dark:bg-stone-800/80 text-xs text-stone-500 dark:text-stone-400">or</span>
                    </div>

                    <button onClick={onContinueAsGuest} className="w-full py-3 bg-glass-300 text-stone-700 dark:text-beige-200 font-bold rounded-lg btn-ripple">
                        Continue as Guest
                    </button>
                    
                     <div className="mt-4 p-3 bg-blue-100/50 dark:bg-blue-900/20 rounded-lg border border-blue-500/20">
                        <div className="flex items-start gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <div className="text-xs text-blue-800 dark:text-blue-200">
                                <strong className="block text-sm">AI Features In Testing</strong>
                                Please note that the AI-powered revision aids are currently in a testing phase to evaluate their effectiveness and usefulness.
                            </div>
                        </div>
                    </div>
                    <div className="mt-2 p-3 bg-amber-100/50 dark:bg-amber-900/20 rounded-lg border border-amber-500/20">
                        <div className="flex items-start gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div className="text-xs text-amber-800 dark:text-amber-200">
                                <strong className="block text-sm">Privacy First: Local Accounts</strong>
                                All your data is saved securely <strong>only on this device and in this browser</strong>. Your account will not be available on other computers or phones.
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;