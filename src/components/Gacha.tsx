import React, { useContext, useState, useEffect } from 'react';
import { PokedexContext } from '../context/PokedexContext';
import { UserContext } from '../context/UserContext';
import { PokedexEntry } from '../types/Pokedex';
import { Pokemon } from '../types/Pokemon';

const GachaComponent: React.FC = () => {
    const { addEntry, entries } = useContext(PokedexContext);
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [capturedPokemon, setCapturedPokemon] = useState<PokedexEntry | null>(null);
    const [canGacha, setCanGacha] = useState(true);

    useEffect(() => {
        if (currentUser) {
            const today = new Date();
            const lastGachaDate = new Date(currentUser.lastGachaDate);

            today.setHours(0, 0, 0, 0);
            lastGachaDate.setHours(0, 0, 0, 0);

            const isSameDay = today.getTime() === lastGachaDate.getTime();
            setCanGacha(!isSameDay);
        }
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
        if (!currentUser) {
            console.log("Aucun utilisateur connecté.");
            return;
        }

        console.log("Lancement gacha...");
        setLoading(true);

        try {
            const response = await fetch('https://tyradex.vercel.app/api/v1/pokemon');
            const data: Pokemon[] = await response.json();

            const randomIndex = Math.floor(Math.random() * data.length);
            const randomPokemon = data[randomIndex];
            console.log(randomPokemon);

            const isPokemonAlreadyCaptured = entries.some(entry => entry.pokedex_id === randomPokemon.pokedex_id);

            if (isPokemonAlreadyCaptured) {
                console.log("Ce Pokémon est déjà dans ton Pokédex !");
                setLoading(false);
                return;
            }

            const entry = pokemonToPokedexEntry(randomPokemon);
            addEntry(entry);
            setCapturedPokemon(entry);

            const today = new Date();
            const updatedUser = { ...currentUser, lastGachaDate: today };

            setCurrentUser(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        } catch (error) {
            console.error("Erreur lors du tirage :", error);
        }

        setLoading(false);
    };


    return (
        <div>
            <button onClick={handleGacha} disabled={loading || !canGacha}>
                {loading ? "Tirage en cours..." : canGacha ? "Tirer un Pokémon" : "Tu as déjà tiré aujourd'hui"}
            </button>

            {capturedPokemon && (
                <div>
                    <h3>Félicitations !</h3>
                    <p>Tu as capturé un Pokémon !</p>
                    <p>Nom : {capturedPokemon.name}</p>
                    <p>Shiny : {capturedPokemon.isShiny ? "Oui" : "Non"}</p>
                    <p>Niveau : {capturedPokemon.level}</p>
                    <p>Catégorie : {capturedPokemon.category}</p>
                    <p>Type : <img src={capturedPokemon.types[0].image} alt={capturedPokemon.types[0].name} /></p>
                    <p>Statistiques :</p>
                    <ul>
                        <li>HP: {capturedPokemon.stats.hp}</li>
                        <li>Attaque: {capturedPokemon.stats.atk}</li>
                        <li>Défense: {capturedPokemon.stats.def}</li>
                        <li>Vitesse: {capturedPokemon.stats.vit}</li>
                    </ul>
                    <p>Height: {capturedPokemon.height}</p>
                    <p>Weight: {capturedPokemon.weight}</p>
                </div>
            )}
        </div>
    );
};

export default GachaComponent;
