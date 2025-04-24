import React, { createContext, useContext, useState, useEffect } from 'react';
import { PokedexEntry } from '../types/Pokedex';
import { UserContext } from './UserContext';

interface PokedexContextType {
    entries: PokedexEntry[];
    addEntry: (entry: PokedexEntry) => void;
    clearPokedex: () => void;
}

export const PokedexContext = createContext<PokedexContextType>({
    entries: [],
    addEntry: () => {},
    clearPokedex: () => {},
} as PokedexContextType);

export const PokedexProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const [entries, setEntries] = useState<PokedexEntry[]>([]);

    useEffect(() => {
        if (currentUser) {
            const key = `pokedex_${currentUser.id}`;
            const stored = localStorage.getItem(key);
            setEntries(stored ? JSON.parse(stored) : []);
        } else {
            setEntries([]);
        }
    }, [currentUser]);

    const addEntry = (entry: PokedexEntry) => {
        if (!currentUser) return;

        const updated = [...entries, entry];
        setEntries(updated);
        localStorage.setItem(`pokedex_${currentUser.id}`, JSON.stringify(updated));

        setCurrentUser(prevUser => {
            if (!prevUser) return null;
            return {
                ...prevUser,
                pokedex: [...prevUser.pokedex, entry],
            };
        });
    };

    const clearPokedex = () => {
        if (!currentUser) return;

        setEntries([]);
        localStorage.removeItem(`pokedex_${currentUser.id}`);

        setCurrentUser(prevUser => {
            if (!prevUser) return null;
            return {
                ...prevUser,
                pokedex: [],
            };
        });
    };

    return (
        <PokedexContext.Provider value={{ entries, addEntry, clearPokedex }}>
            {children}
        </PokedexContext.Provider>
    );
};
