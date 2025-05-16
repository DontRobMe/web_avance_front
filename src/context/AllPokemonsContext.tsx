import React, { createContext, useState, useEffect } from 'react';
import { Pokemon } from '../types/Pokemon';

export const AllPokemonsContext = createContext<Pokemon[]>([]);

export const AllPokemonsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('https://tyradex.vercel.app/api/v1/pokemon');
                if (!res.ok) throw new Error(`Erreur ${res.status}`);
                const data: Pokemon[] = await res.json();
                setAllPokemons(data);
            } catch (err) {
                console.error("Impossible de charger tous les Pokémons :", err);
            }
        })();
    }, []);

    return (
        <AllPokemonsContext.Provider value={allPokemons}>
            {children}
        </AllPokemonsContext.Provider>
    );
};
