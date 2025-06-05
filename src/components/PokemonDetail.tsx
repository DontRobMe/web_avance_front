import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchPokemonByName, toggleShiny } from '../store/slice/pokemonSlice';

const PokemonDetail: React.FC = () => {
    const { name } = useParams<{ name: string }>();
    const dispatch = useAppDispatch();
    const { selectedPokemon: pokemon, isShiny, loading, error } = useAppSelector(state => state.pokemon);

    const normalizeName = (name: string) =>
        name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    useEffect(() => {
        if (name) {
            dispatch(fetchPokemonByName(normalizeName(name)));
        }
    }, [name, dispatch]);

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;
    console.log('loading:', loading);
    console.log('error:', error);
    console.log('pokemon:', pokemon);
    if (!pokemon || !pokemon.name || !pokemon.sprites) return <div>Pokémon non trouvé.</div>;


    return (
        <div>
            <h2>{pokemon.name?.fr || "Nom inconnu"} {isShiny && <span>✨</span>}</h2>
            <img
                src={isShiny ? pokemon.sprites.shiny : pokemon.sprites.regular}
                alt={pokemon.name.fr}
                style={{ width: '200px' }}
            />
            <p>Catégorie : {pokemon.category}</p>
            <p>Hauteur : {pokemon.height}</p>
            <p>Poids : {pokemon.weight}</p>

            <button onClick={() => dispatch(toggleShiny())}>
                {isShiny ? 'Voir normal' : 'Voir shiny'}
            </button>
        </div>
    );
};

export default PokemonDetail;
