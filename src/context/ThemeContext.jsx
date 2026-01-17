import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { AuthService } from '../services/auth';

const ThemeContext = createContext();

export const themes = [
    { id: 'indigo', name: 'Indigo Pro', primary: '79, 71, 230', start: '#4F47E6', end: '#6D67FF', gradient: 'from-[#4F47E6] to-[#6D67FF]' },
    { id: 'ocean', name: 'Ocean Blue', primary: '14, 165, 233', start: '#0EA5E9', end: '#2563EB', gradient: 'from-[#0EA5E9] to-[#2563EB]' },
    { id: 'emerald', name: 'Emerald Green', primary: '16, 185, 129', start: '#10B981', end: '#059669', gradient: 'from-[#10B981] to-[#059669]' },
    { id: 'sunset', name: 'Sunset Orange', primary: '249, 115, 22', start: '#F97316', end: '#EA580C', gradient: 'from-[#F97316] to-[#EA580C]' },
    { id: 'rose', name: 'Rose Pink', primary: '236, 72, 153', start: '#EC4899', end: '#DB2777', gradient: 'from-[#EC4899] to-[#DB2777]' },
    { id: 'purple', name: 'Royal Purple', primary: '124, 58, 237', start: '#7C3AED', end: '#5B21B6', gradient: 'from-[#7C3AED] to-[#5B21B6]' },
    { id: 'slate', name: 'Slate Gray', primary: '51, 65, 85', start: '#334155', end: '#0F172A', gradient: 'from-[#334155] to-[#0F172A]' },
    { id: 'teal', name: 'Cyber Teal', primary: '20, 184, 166', start: '#14B8A6', end: '#0D9488', gradient: 'from-[#14B8A6] to-[#0D9488]' },
    { id: 'amber', name: 'Golden Amber', primary: '245, 158, 11', start: '#F59E0B', end: '#D97706', gradient: 'from-[#F59E0B] to-[#D97706]' },
    { id: 'crimson', name: 'Crimson Red', primary: '239, 68, 68', start: '#EF4444', end: '#B91C1C', gradient: 'from-[#EF4444] to-[#B91C1C]' },
];

export const ThemeProvider = ({ children }) => {
    const { userData, currentUser } = useAuth();

    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });

    const [currentTheme, setCurrentTheme] = useState(() => {
        const saved = localStorage.getItem('themeId');
        return saved || 'indigo';
    });

    // Sync with User Data on Login
    useEffect(() => {
        if (userData) {
            if (userData.darkMode !== undefined) setDarkMode(userData.darkMode);
            if (userData.themeId) setCurrentTheme(userData.themeId);
        }
    }, [userData]);

    useEffect(() => {
        // Toggle Dark Mode
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    useEffect(() => {
        // Apply Theme Colors
        const theme = themes.find(t => t.id === currentTheme) || themes[0];
        document.documentElement.style.setProperty('--primary', theme.primary);
        document.documentElement.style.setProperty('--primary-start', theme.start);
        document.documentElement.style.setProperty('--primary-end', theme.end);
        localStorage.setItem('themeId', currentTheme);
    }, [currentTheme]);

    const toggleDarkMode = async () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        if (currentUser) {
            try {
                await AuthService.updateSettings({ darkMode: newMode });
            } catch (err) { console.error("Settings sync failed", err); }
        }
    };

    const changeTheme = async (themeId) => {
        setCurrentTheme(themeId);
        if (currentUser) {
            try {
                await AuthService.updateSettings({ themeId });
            } catch (err) { console.error("Settings sync failed", err); }
        }
    };

    return (
        <ThemeContext.Provider value={{
            darkMode,
            toggleDarkMode,
            currentTheme,
            changeTheme,
            themes
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
