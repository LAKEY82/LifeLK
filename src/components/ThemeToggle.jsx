import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
      setIsLight(true);
      document.body.classList.add('light-mode');
    } else {
      setIsLight(false);
      document.body.classList.remove('light-mode');
    }
  }, []);

  const toggleTheme = () => {
    if (isLight) {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
      setIsLight(false);
    } else {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
      setIsLight(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl border bg-slate-900/40 hover:bg-slate-800/80 dark:border-slate-800 light-mode:bg-white/40 light-mode:border-slate-200 light-mode:hover:bg-white/80 transition-all duration-300 cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 shadow-lg shadow-black/10 focus:outline-none"
      aria-label="Toggle theme mode"
    >
      {isLight ? (
        <Moon className="h-5 w-5 text-indigo-600 hover:rotate-12 transition-transform duration-300" />
      ) : (
        <Sun className="h-5 w-5 text-amber-400 animate-[spin_12s_linear_infinite]" />
      )}
    </button>
  );
}
