import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DarkModeToggle() {
    const [darkMode, setDarkMode] = useState(() => {
        // Check localStorage or system preference
        const saved = localStorage.getItem('darkMode');
        if (saved !== null) {
            return saved === 'true';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        // Update document class and localStorage
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
        }
    }, [darkMode]);

    return (
        <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 
                       transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-primary"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500 transition-transform duration-200 hover:rotate-12" />
            ) : (
                <Moon className="w-5 h-5 text-gray-700 transition-transform duration-200 hover:-rotate-12" />
            )}
        </button>
    );
}
