import React, { useState, FormEvent } from 'react';
import { getAllUsers, saveUser, defaultUserData } from '../utils/auth';
import { User } from '../types';

interface HomePageProps {
  onLoginSuccess: (username: string) => void;
  currentUser: User | null;
  onEnterApp: () => void;
  onLogout: () => void;
}

const mediaTerms = [
    'Mise-en-scène', 'Semiotics', 'Binary Opposites', 'Hegemony', 'Postmodernism', 'Intertextuality',
    'Representation', 'Genre Theory', 'Narrative', 'Audience Positioning', 'Ideology', 'Feminist Theory',
    'Post-colonialism', 'Synergy', 'Convergence', 'Regulation', 'Public Service Broadcasting', 'Neoliberalism',
];

const features = [
    { imageUrl: 'https://i.pinimg.com/736x/2f/72/e7/2f72e74935b7206a316a8a4ddb94668c.jpg', text: 'AI-Powered Revision', rotation: '-8deg', position: 'absolute top-[10%] left-[5%] md:top-[15%] md:left-[15%]' },
    { imageUrl: 'https://i.pinimg.com/736x/19/0d/a2/190da2d0f64cab008a6f9913eede61dc.jpg', text: 'In-Depth Study Hub', rotation: '5deg', position: 'absolute top-[60%] left-[2%] md:top-[55%] md:left-[8%]' },
    { imageUrl: 'https://i.pinimg.com/736x/2e/88/40/2e88409890631640455b243c98c36949.jpg', text: 'Customizable Dashboard', rotation: '-3deg', position: 'absolute top-[25%] right-[5%] md:top-[20%] md:right-[18%]' },
    { imageUrl: 'https://i.pinimg.com/736x/6f/03/6c/6f036c45b87129d3cd1ba5d44821ed3f.jpg', text: 'Your Media Journal', rotation: '10deg', position: 'absolute top-[65%] right-[2%] md:top-[60%] md:right-[12%]' },
];

const BackgroundTerminology: React.FC = () => {
    const terms = Array(150).fill(mediaTerms).flat();
    const lines: string[] = [];
    const termsPerLine = 15;
    for (let i = 0; i < terms.length; i += termsPerLine) {
        lines.push(terms.slice(i, i + termsPerLine).join('       '));
    }
    return (
        <div className="intro-terminology-bg">
            <div className="w-full h-full flex flex-col overflow-hidden">
                <div className="w-full text-center font-bold whitespace-nowrap">
                    <div className={'pulsating-scroll-text'}>
                        <div>{lines.map((line, i) => <p key={i} className="py-2">{line}</p>)}</div>
                        <div>{lines.map((line, i) => <p key={i} className="py-2">{line}</p>)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Polaroid: React.FC<{ imageUrl: string; text: string; rotation: string; position: string; delay: string; }> = ({ imageUrl, text, rotation, position, delay }) => (
  <figure className={`polaroid w-36 h-44 md:w-44 md:h-52 bg-white p-3 shadow-2xl ${position}`} style={{ '--end-rotate': rotation, animationDelay: delay }}>
    <div className="bg-stone-200 h-24 md:h-32"><img src={imageUrl} alt={text} className="w-full h-full object-cover"/></div>
    <figcaption className="mt-2 text-center text-xs md:text-sm font-semibold text-stone-800 tracking-tight">{text}</figcaption>
  </figure>
);


const HomePage: React.FC<HomePageProps> = ({ onLoginSuccess, currentUser, onEnterApp, onLogout }) => {
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
        const users = getAllUsers();

        if (isLogin) {
            const user = users[username];
            if (user && user.password === password) {
                onLoginSuccess(username);
            } else {
                setError('Invalid username or password.');
            }
        } else {
            if (users[username]) {
                setError('Username already exists.');
            } else if (username.length < 3) {
                setError('Username must be at least 3 characters long.');
            } else if (password.length < 4) {
                setError('Password must be at least 4 characters long.');
            } else {
                const newUser: User = { username, password, data: { ...defaultUserData, name: username } };
                saveUser(newUser);
                onLoginSuccess(username);
            }
        }
        setLoading(false);
    }, 500);
  };

  return (
    <div className={`relative min-h-screen flex items-center justify-center overflow-hidden`}>
        <BackgroundTerminology />
        <div className="intro-light-leak" />
        <div className="intro-light-leak-2" />
        <div className="film-scratches-overlay" />
        <div className="absolute inset-0 z-2 scale-90 md:scale-100 pointer-events-none">
            {features.map((feature, i) => (
                <Polaroid key={i} {...feature} delay={`${i * 0.1}s`} />
            ))}
        </div>
      
      <main className="relative z-10 w-full max-w-md mx-auto px-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <div className="bg-glass-200 dark:bg-black/20 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 md:p-8 border border-glass-border dark:border-glass-border-dark glass-reflective">
            
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
                </>
            )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;