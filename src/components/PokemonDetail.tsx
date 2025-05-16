import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Pokemon } from '../types/Pokemon';
import '../styles/PokemonDetail.css';

const PokemonDetail: React.FC = () => {
    const { name } = useParams<{ name: string }>();
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isShiny, setIsShiny] = useState<boolean>(false);

    useEffect(() => {
        const fetchPokemon = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`https://tyradex.vercel.app/api/v1/pokemon/${name}`);
                if (!response.ok) {
                    throw new Error('Échec de la récupération du Pokémon');
                }
                const data: Pokemon = await response.json();
                setPokemon(data);
            } finally {
                setLoading(false);
            }
        };

        if (name) {
            fetchPokemon();
        }
    }, [name]);

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!pokemon) {
        return <div>Pokémon non trouvé.</div>;
    }

    return (
        <div className="pokemon-detail">
            <button onClick={() => window.history.back()}>Retour</button>

            <div className="detail-card">
                <img
                    src={isShiny ? pokemon.sprites.shiny : pokemon.sprites.regular}
                    alt={pokemon.name.fr}
                    className="pokemon-image"
                />
                <h2>{pokemon.name.fr} {isShiny && <span className="shiny-star">✨</span>}</h2>
                <p><strong>Catégorie:</strong> {pokemon.category}</p>
                <p><strong>Hauteur:</strong> {pokemon.height}</p>
                <p><strong>Poids:</strong> {pokemon.weight}</p>

                <h3>Types</h3>
                <div className="pokemon-types">
                    {pokemon.types.map(type => (
                        <img
                            key={type.name}
                            src={type.image}
                            alt={type.name}
                            className="type-icon"
                        />
                    ))}
                </div>

                <h3>Stats</h3>
                <ul>
                    <li>HP: {pokemon.stats.hp}</li>
                    <li>ATK: {pokemon.stats.atk}</li>
                    <li>DEF: {pokemon.stats.def}</li>
                    <li>SPE ATK: {pokemon.stats.spe_atk}</li>
                    <li>SPE DEF: {pokemon.stats.spe_def}</li>
                    <li>VIT: {pokemon.stats.vit}</li>
                </ul>

                <button onClick={() => setIsShiny(!isShiny)}>
                    {isShiny ? "Voir Pokémon normal" : "Voir Pokémon shiny"}
                </button>
            </div>
        </div>
    );
};

export default PokemonDetail;
