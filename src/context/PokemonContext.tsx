import React, { createContext } from 'react';
import { Pokemon } from '../types/Pokemon';

const PokemonContext = createContext<Pokemon[]>([]);

const allPokemons: Pokemon[] = [
    {
        id: 1,
        name: 'Bulbasaur',
        types: ['Grass', 'Poison'],
        description: 'Seed Pokémon...',
        imageUrl: 'https://...',
        baseStats: { hp: 45, attack: 49, defense: 49, speed: 45 },
    },
];

export const PokemonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <PokemonContext.Provider value={allPokemons}>
            {children}
        </PokemonContext.Provider>
    );
};
