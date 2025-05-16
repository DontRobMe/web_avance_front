// components/Gallery.tsx
import React from 'react';
import { PokedexEntry } from '../types/Pokedex';
import '../styles/Gallery.css';

interface Props {
    pokemons: PokedexEntry[];
    selected?: PokedexEntry[];
    onToggleSelect?: (pokemon: PokedexEntry) => void;
    disabledItems?: string[];
}

const Gallery: React.FC<Props> = ({
                                      pokemons,
                                      selected = [],
                                      onToggleSelect,
                                      disabledItems = []
                                  }) => {
    const isSelected = (pokemon: PokedexEntry) =>
        selected.some(
            p => p.pokedex_id === pokemon.pokedex_id && p.caughtAt === pokemon.caughtAt
        );

    const isDisabled = (pokemon: PokedexEntry) => {
        const key = `${pokemon.pokedex_id}-${pokemon.caughtAt}`;
        return disabledItems.includes(key);
    };

    return (
        <div className="gallery">
            {pokemons.map((pokemon, idx) => {
                const selectedClass = isSelected(pokemon) ? 'selected' : '';
                const disabledClass = isDisabled(pokemon) ? 'disabled' : '';

                return (
                    <div
                        key={idx}
                        className={`pokemon-card ${selectedClass} ${disabledClass}`}
                        onClick={() => {
                            if (!isDisabled(pokemon) && onToggleSelect) {
                                onToggleSelect(pokemon);
                            }
                        }}
                    >
                        <img
                            src={pokemon.isShiny ? pokemon.sprites.shiny : pokemon.sprites.regular}
                            alt={pokemon.name}
                            width={96}
                            height={96}
                        />
                        <p>{pokemon.name} (Nv. {pokemon.level})</p>
                    </div>
                );
            })}
        </div>
    );
};

export default Gallery;
