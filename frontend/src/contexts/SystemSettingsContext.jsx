import { createContext, useContext, useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const SystemSettingsContext = createContext();

export function useSystemSettings() {
    return useContext(SystemSettingsContext);
}

export function SystemSettingsProvider({ children }) {
    const [settings, setSettings] = useState({
        siteName: 'Monex',
        siteDescription: 'Quản lý chi tiêu cá nhân',
        // Default values for other settings to avoid undefined errors
        general: {},
        notification: {},
        database: {}
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getSettings(); // Ensure this matches your API response structure
            if (response.data && response.data.data) {
                const { general, notification, database } = response.data.data;
                setSettings(prev => ({
                    ...prev,
                    general: general || {},
                    notification: notification || {},
                    database: database || {},
                    // Flatten important settings for easier access
                    siteName: general?.siteName || 'Monex',
                    siteDescription: general?.siteDescription || 'Quản lý chi tiêu cá nhân'
                }));
            }
        } catch (error) {
            console.error('Error fetching system settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateSystemSettings = async (newSettings) => {
        try {
            // Optimistic update for UI responsiveness
            setSettings(prev => ({
                ...prev,
                general: newSettings.general || prev.general,
                notification: newSettings.notification || prev.notification,
                database: newSettings.database || prev.database,
                siteName: newSettings.general?.siteName || prev.siteName,
                siteDescription: newSettings.general?.siteDescription || prev.siteDescription
            }));

            // Call API
            await adminAPI.updateSettings(newSettings);

            // Re-fetch to ensure sync with backend (optional, but good for consistency)
            // await fetchSettings(); 
        } catch (error) {
            console.error('Error updating system settings:', error);
            // Revert state if needed (advanced implementation)
            throw error;
        }
    };

    const value = {
        settings,
        loading,
        updateSystemSettings,
        fetchSettings
    };

    return (
        <SystemSettingsContext.Provider value={value}>
            {children}
        </SystemSettingsContext.Provider>
    );
}
