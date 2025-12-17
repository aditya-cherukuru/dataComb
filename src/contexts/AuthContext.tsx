import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { loginWithKeychain, fetchProfile, type UserProfile } from '../lib/hive';

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    login: (username: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);

    // Check for saved session on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('datacomb_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const createDemoUser = (username: string) => {
        const demoUser: UserProfile = {
            name: username,
            reputation: 65,
            metadata: {
                profile: {
                    name: username,
                    about: 'Demo user for testing DataComb',
                }
            },
            balance: '100.000 HIVE',
            hbd_balance: '50.000 HBD',
            post_count: 42,
        };

        setUser(demoUser);
        localStorage.setItem('datacomb_user', JSON.stringify(demoUser));
    };

    const login = async (username: string) => {
        setLoading(true);
        try {
            // Check if Keychain is available
            if (!window.hive_keychain) {
                // DEMO MODE - No Keychain installed
                console.log('⚠️ Hive Keychain not found - using DEMO MODE');
                createDemoUser(username);
                setLoading(false);
                return;
            }

            // Try real Keychain login
            try {
                const result = await loginWithKeychain(username);
                if (result.success) {
                    const profile = await fetchProfile(username);
                    setUser(profile);
                    localStorage.setItem('datacomb_user', JSON.stringify(profile));
                } else {
                    // Keychain error - fall back to demo mode
                    console.log('⚠️ Keychain error - using DEMO MODE:', result.msg);
                    createDemoUser(username);
                }
            } catch (keychainError) {
                // Keychain failed - use demo mode
                console.log('⚠️ Keychain failed - using DEMO MODE');
                createDemoUser(username);
            }
        } catch (error) {
            console.error('Login error:', error);
            // Final fallback to demo mode
            createDemoUser(username);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('datacomb_user');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
