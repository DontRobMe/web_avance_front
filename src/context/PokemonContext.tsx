import React, { createContext, useContext } from 'react';
import { Pokemon } from '../types/Pokemon';

const allPokemons: Pokemon[] = [
    {
        pokedex_id: 1,
        generation: 1,
        category: "Pokémon Graine",
        name: {
            fr: "Bulbizarre",
            en: "Bulbasaur",
            jp: "フシギダネ"
        },
        sprites: {
            regular: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png",
            shiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png",
            gmax: null
        },
        types: [
            { name: "Plante", image: "https://..." },
            { name: "Poison", image: "https://..." }
        ],
        talents: [
            { name: "Engrais", tc: false },
            { name: "Chlorophylle", tc: true }
        ],
        stats: {
            hp: 45,
            atk: 49,
            def: 49,
            spe_atk: 65,
            spe_def: 65,
            vit: 45
        },
        resistances: [
            { name: "Eau", multiplier: 0.5 },
            { name: "Électrik", multiplier: 0.5 },
            { name: "Feu", multiplier: 2 }
        ],
        evolution: {
            pre: [],
            next: { pokedex_id: 2, name: "Herbizarre" },
            mega: null
        },
        height: "0.7 m",
        weight: "6.9 kg",
        egg_groups: ["Monstrueux", "Plante"],
        sexe: {
            male: 87.5,
            female: 12.5
        },
        catch_rate: 45,
        level_100: 1059860,
        formes: null
    }
];

export const PokemonContext = createContext<Pokemon[]>([]);

export const PokemonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <PokemonContext.Provider value={allPokemons}>
            {children}
        </PokemonContext.Provider>
    );
};

export const usePokemonContext = () => useContext(PokemonContext);
