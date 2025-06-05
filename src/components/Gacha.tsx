import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, setCurrentUser } from '../store/slice/UserSlice';
import {addPokemon, savePokemonToLocalPokedex, selectPokedexEntries} from '../store/slice/PokedexSlice';
import { PokedexEntry } from '../types/Pokedex';
import { Pokemon } from '../types/Pokemon';
import '../styles/GachaComponent.css';
import User from "../types/User.tsx";

const GachaComponent: React.FC = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const entries = useSelector(selectPokedexEntries);
    const [loading, setLoading] = useState(false);
    const [capturedPokemon, setCapturedPokemon] = useState<PokedexEntry | null>(null);
    const [canGacha, setCanGacha] = useState(true);

    useEffect(() => {
        if (!currentUser?.lastGachaDate) return;

        const today = new Date();
        const lastGacha = new Date(currentUser.lastGachaDate);

        today.setHours(0, 0, 0, 0);
        lastGacha.setHours(0, 0, 0, 0);

        setCanGacha(today.getTime() !== lastGacha.getTime());
    }, [currentUser]);

    const pokemonToPokedexEntry = (pokemon: Pokemon): PokedexEntry => ({
        pokedex_id: pokemon.pokedex_id,
        caughtAt: new Date(),
        name: pokemon.name.fr || pokemon.name.en || pokemon.name.jp,
        isShiny: Math.random() < 0.05,
        level: 1,
        sprites: {
            regular: pokemon.sprites.regular,
            shiny: pokemon.sprites.shiny,
        },
        types: pokemon.types,
        stats: pokemon.stats,
        evolution: pokemon.evolution,
        category: pokemon.category,
        height: pokemon.height,
        weight: pokemon.weight,
        egg_groups: pokemon.egg_groups,
        catch_rate: pokemon.catch_rate,
        level_100: pokemon.level_100,
        sexe: pokemon.sexe,
    });

    const handleGacha = async () => {
        if (!currentUser || !canGacha) return;

        setLoading(true);
        try {
            const res = await fetch('https://tyradex.vercel.app/api/v1/pokemon');
            const data: Pokemon[] = await res.json();

            const randomIndex = Math.floor(Math.random() * data.length);
            const randomPokemon = data[randomIndex];

            if (entries.some(e => e.pokedex_id === randomPokemon.pokedex_id)) {
                console.log("Déjà capturé.");
                setLoading(false);
                return;
            }

            const entry = pokemonToPokedexEntry(randomPokemon);

            dispatch(addPokemon(entry));
            setCapturedPokemon(entry);

            savePokemonToLocalPokedex(currentUser.id, entry);


            const updatedUser = {
                ...currentUser,
                lastGachaDate: new Date().toISOString(),
            };

            dispatch(setCurrentUser(updatedUser));

            const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
            const updatedUsers = users.map((u: User) =>
                u.id === (updatedUser.id) ? updatedUser : u
            );

            localStorage.setItem('users', JSON.stringify(updatedUsers));

        } catch (error) {
            console.error("Erreur gacha :", error);
        }

        setLoading(false);
    };

    return (
        <div className="gacha-container">
            <button onClick={handleGacha} disabled={loading || !canGacha}>
                {loading ? "Tirage en cours..." : canGacha ? "Tirer un Pokémon" : "Déjà tiré aujourd'hui"}
            </button>

            {capturedPokemon && (
                <div className="captured-pokemon">
                    <h3>Félicitations !</h3>
                    <p>Tu as capturé un Pokémon !</p>
                    <img
                        src={capturedPokemon.isShiny ? capturedPokemon.sprites.shiny : capturedPokemon.sprites.regular}
                        alt={capturedPokemon.name}
                    />
                    <p>Nom : {capturedPokemon.name}</p>
                    <p>Shiny : {capturedPokemon.isShiny ? "Oui" : "Non"}</p>
                    <p>Niveau : {capturedPokemon.level}</p>
                    <p>Catégorie : {capturedPokemon.category}</p>
                    <p>Type : <img src={capturedPokemon.types[0].image} alt={capturedPokemon.types[0].name} /></p>
                </div>
            )}
        </div>
    );
};

export default GachaComponent;
