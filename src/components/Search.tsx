import React from 'react';
import { useSearch } from '../hooks/useSearch';
import { useNavigateToPokemon } from '../hooks/useNavigateToPokemon';
import '../styles/SearchComponent.css';

const SearchComponent: React.FC = () => {
    const {
        filteredPokemon,
        loading,
        searchTerm,
        isShiny,
        typeFilter,
        typesList,
        setSearchTerm,
        toggleShinyFilter,
        setTypeFilter,
    } = useSearch();

    const navigateToPokemon = useNavigateToPokemon();

    if (loading) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="search-component">
            <div className="filters">
                <input
                    type="text"
                    placeholder="Rechercher par nom"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <label>
                    <input
                        type="checkbox"
                        checked={isShiny}
                        onChange={toggleShinyFilter}
                    />
                    Afficher seulement les Pokémon shiny
                </label>
                <select onChange={(e) => setTypeFilter(e.target.value)} value={typeFilter}>
                    <option value="">Tous les types</option>
                    {typesList.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

            <div className="pokemon-grid">
                {filteredPokemon.length > 0 ? (
                    filteredPokemon.map((pokemon) => (
                        <div
                            key={pokemon.pokedex_id}
                            className="pokemon-card"
                            onClick={() => navigateToPokemon(pokemon.name)}
                        >
                            <img
                                src={isShiny ? pokemon.sprites.shiny : pokemon.sprites.regular}
                                alt={pokemon.name}
                            />
                            <h3>{pokemon.name}</h3>
                            <p>Catégorie: {pokemon.category}</p>
                            <p>
                                Types:{' '}
                                {pokemon.types?.map((t) => (
                                    <span key={t.name}>{t.name} </span>
                                )) || 'Aucun type'}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>Aucun Pokémon trouvé.</p>
                )}
            </div>
        </div>
    );
};

export default SearchComponent;
