import { createContext, useState, useEffect } from 'react';
import axios from '../services/api';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
            setReady(true);
        } else {
            setReady(true);
        }
        // Optional: Verify token with backend /me endpoint if strictly standard
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('/auth/login', { email, password });
            setUser(data.data.user);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (username, email, password) => {
        try {
            const { data } = await axios.post('/auth/register', {
                username,
                email,
                password
            });
            setUser(data.data.user);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            return true;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <UserContext.Provider value={{ user, setUser, ready, login, register, logout }}>
            {children}
        </UserContext.Provider>
    );
}
