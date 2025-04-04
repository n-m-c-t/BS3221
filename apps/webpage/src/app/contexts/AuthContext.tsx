import { create } from "domain";
import { createContext, useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';


interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    active: boolean;
    role: string
}
interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    hasRole: (role: string) => boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    // refreshAccessToken: () => Promise<bolean>;
}

const AuthContext = createContext<AuthContextType>(null!)
export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            }) // Pass the object with email and password                })
            .then((response) => {
                if (!response.ok) {
                throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                // Store the token in local storage
                localStorage.setItem('token', data.access_token);
                storeUserDetails(data.access_token!);
                // Redirect to the dashboard or home page
                navigate('/home');
            })
            .catch((error) => {
                console.error('Error:', error);
                // setError('Invalid email or password');
            });
        }
        catch (error) {}
    };

    const logout = () => {
        setAccessToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    const hasRole = (role: string) => {
        return user?.role === role;
    };
    
    function storeUserDetails(accessToken: string) {
        const decodedToken = JSON.parse(atob(accessToken.split('.')[1]));
        const user = {
            id: decodedToken.sub,
            email: decodedToken.email,
            firstName: decodedToken.firstName,
            lastName: decodedToken.lastName,
            active: decodedToken.active,
            role: decodedToken.role
        }
        setUser(user);
    }
    
    const value = {user, accessToken, login, logout, hasRole};

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}