import React, { createContext, useEffect, useState } from 'react';
import { SignupData, User } from '../types/User';

interface UserContextProps {
    users: User[];
    currentUser: User | null;
    setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
    login: (username: string, password: string) => boolean;
    logout: () => void;
    signup: (data: SignupData) => boolean;
}

export const UserContext = createContext<UserContextProps>({
    users: [],
    currentUser: null,
    setCurrentUser: () => {},
    login: () => false,
    logout: () => {},
    signup: () => false,
});

const generateId = (users: User[]): number => {
    const maxId = users.reduce((max, user) => (user.id > max ? user.id : max), 0);
    return maxId + 1;
};

interface Props {
    children: React.ReactNode;
}

export const UserProvider: React.FC<Props> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUsers = localStorage.getItem('users');
        const storedCurrentUser = localStorage.getItem('currentUser');

        if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
        }

        if (storedCurrentUser) {
            setCurrentUser(JSON.parse(storedCurrentUser));
        }
    }, []);

    useEffect(() => {
        if (users.length > 0) {
            localStorage.setItem('users', JSON.stringify(users));
        }
        if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
    }, [users, currentUser]);

    const login = (username: string, password: string): boolean => {
        const foundUser = users.find(
            (u) =>
                u.username.toLowerCase() === username.toLowerCase() && u.password === password
        );
        if (foundUser) {
            setCurrentUser(foundUser);
            return true;
        }
        return false;
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
    };

    const signup = (data: SignupData): boolean => {
        const exists = users.some(
            (u) => u.username.toLowerCase() === data.username.toLowerCase()
        );
        if (exists) {
            console.warn("Ce nom d’utilisateur est déjà pris.");
            return false;
        }

        const newUser: User = {
            id: generateId(users),
            username: data.username,
            email: data.email,
            password: data.password,
            level: 1,
            capturedPokemons: 0,
            wins: 0,
            losses: 0,
            pokedex: [],
            lastGachaDate: new Date(0),
        };

        setUsers((prevUsers) => {
            const updatedUsers = [...prevUsers, newUser];
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            return updatedUsers;
        });

        setCurrentUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        return true;
    };


    return (
        <UserContext.Provider value={{ users, currentUser, login, logout, signup, setCurrentUser }}>
            {children}
        </UserContext.Provider>
    );
};
