import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pokemon } from '../types/Pokemon';
import '../styles/SearchComponent.css';

const SearchComponent: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
    const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isShiny, setIsShiny] = useState<boolean>(false);
    const [typeFilter, setTypeFilter] = useState<string>('');
    const [typesList, setTypesList] = useState<string[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPokemon = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://tyradex.vercel.app/api/v1/pokemon');
                if (!response.ok) {
                    throw new Error('Échec de la récupération des Pokémon');
                }
                const data: Pokemon[] = await response.json();
                setPokemonList(data);
                setFilteredPokemon(data);

                const uniqueTypes = Array.from(
                    new Set(
                        data
                            .flatMap((p) => p.types?.map((t) => t.name) || [])
                    )
                ).sort();
                setTypesList(uniqueTypes);
            } catch (error) {
                console.error('Erreur lors de la récupération des Pokémon :', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPokemon();
    }, []);

    useEffect(() => {
        const filtered = pokemonList.filter((pokemon) => {
            if (
                pokemon.name.fr.toLowerCase() === 'missingno.' ||
                pokemon.name.en.toLowerCase() === 'missingno.'
            ) {
                return false;
            }

            const nameMatch =
                pokemon.name.fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pokemon.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pokemon.name.jp.toLowerCase().includes(searchTerm.toLowerCase());

            const typeMatch = typeFilter
                ? pokemon.types?.some((type) => type.name === typeFilter)
                : true;

            const shinyMatch = isShiny
                ? Boolean(pokemon.sprites.shiny)
                : true;

            return nameMatch && typeMatch && shinyMatch;
        });

        setFilteredPokemon(filtered);
    }, [searchTerm, isShiny, typeFilter, pokemonList]);

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
                        onChange={(e) => setIsShiny(e.target.checked)}
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
                            onClick={() => navigate(`/pokemon/${pokemon.name.en.toLowerCase()}`)}
                        >
                            <img
                                src={isShiny ? pokemon.sprites.shiny : pokemon.sprites.regular}
                                alt={pokemon.name.fr || pokemon.name.en}
                            />
                            <h3>{pokemon.name.fr || pokemon.name.en}</h3>
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
