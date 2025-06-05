import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { v4 as uuidv4 } from 'uuid';
import {
    fetchUserPokedex,
    fetchOtherUserPokedex,
    PokedexEntry,
} from '../store/slice/PokedexSlice';
import UserSelector from './UserSelector';
import Gallery from './Gallery';
import TradeRequest from './TradeRequest';
import PendingTrades from './PendingTrades';
import { useAppDispatch } from '../hooks/useAppDispatch';
import '../styles/Exchange.css';
import { User } from '../types/User';
import { TradeHistoryEntry, TradeProposal } from '../types/Trade';
import { addTradeProposal } from '../store/slice/TradeSlice';
import TradeHistory from "./TradeHistory";

const Exchange: React.FC = () => {
    const dispatch = useAppDispatch();
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const users = useSelector((state: RootState) => state.user.users) as User[];
    const currentUserPokemons = useSelector((state: RootState) => state.pokedex.pokemonList);
    const otherUserPokemons = useSelector((state: RootState) => state.pokedex.otherPokemonList);
    const tradeHistoryEntries = useSelector((state: RootState) => state.trade.tradeHistoryEntries);

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [selectedMyPokemons, setSelectedMyPokemons] = useState<PokedexEntry[]>([]);
    const [selectedTheirPokemons, setSelectedTheirPokemons] = useState<PokedexEntry[]>([]);

    const transformEntries = (
        entries: TradeHistoryEntry[],
        allPokemons: PokedexEntry[]
    ) => {
        return entries.map(entry => ({
            ...entry,
            pokemonsSent: entry.pokemonsSent
                .map(id => allPokemons.find(p => p.pokedex_id.toString() === id))
                .filter((p): p is PokedexEntry => p !== undefined),
            pokemonsReceived: entry.pokemonsReceived
                .map(id => allPokemons.find(p => p.pokedex_id.toString() === id))
                .filter((p): p is PokedexEntry => p !== undefined),
        }));
    };

    const allPokemons = [...currentUserPokemons, ...otherUserPokemons];
    const entriesWithPokemons = transformEntries(tradeHistoryEntries, allPokemons);

    useEffect(() => {
        if (currentUser) {
            dispatch(fetchUserPokedex(currentUser.id));
        }
    }, [currentUser, dispatch]);

    useEffect(() => {
        if (selectedUserId) {
            dispatch(fetchOtherUserPokedex(selectedUserId));
        }
    }, [selectedUserId, dispatch]);

    const handleTradeComplete = (
        offeredPokemons: PokedexEntry[],
        requestedPokemons: PokedexEntry[]
    ) => {
        if (!selectedUserId || !currentUser) return;

        const newTrade: TradeProposal = {
            id: uuidv4(),
            fromUserId: currentUser.id.toString(),
            toUserId: selectedUserId.toString(),
            offeredPokemonIds: offeredPokemons.map((p) => p.pokedex_id.toString()),
            requestedPokemonIds: requestedPokemons.map((p) => p.pokedex_id.toString()),
            status: 'pending',
        };

        const existing = JSON.parse(localStorage.getItem('trade_proposals') || '[]');
        localStorage.setItem('trade_proposals', JSON.stringify([...existing, newTrade]));

        dispatch(addTradeProposal(newTrade));
        setSelectedMyPokemons([]);
        setSelectedTheirPokemons([]);
    };

    if (!currentUser) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="exchange-container">
            <h2>Échange de Pokémon</h2>

            <section>
                <h3>Vos Pokémons</h3>
                <Gallery
                    pokemons={currentUserPokemons}
                    selected={selectedMyPokemons}
                    onToggleSelect={(pokemon) =>
                        setSelectedMyPokemons((current) =>
                            current.some((p) => p.pokedex_id === pokemon.pokedex_id)
                                ? current.filter((p) => p.pokedex_id !== pokemon.pokedex_id)
                                : [...current, pokemon]
                        )
                    }
                />
            </section>

            <section>
                <UserSelector
                    users={users
                        .filter((u) => u.id !== currentUser.id)
                        .map((user) => ({ id: user.id.toString(), username: user.username }))}
                    selectedUserId={selectedUserId}
                    onSelect={setSelectedUserId}
                />
            </section>

            {selectedUserId && (
                <section>
                    <h3>Pokémons de l'utilisateur sélectionné</h3>
                    <Gallery
                        pokemons={otherUserPokemons}
                        selected={selectedTheirPokemons}
                        onToggleSelect={(pokemon) =>
                            setSelectedTheirPokemons((current) =>
                                current.some((p) => p.pokedex_id === pokemon.pokedex_id)
                                    ? current.filter((p) => p.pokedex_id !== pokemon.pokedex_id)
                                    : [...current, pokemon]
                            )
                        }
                    />
                    <TradeRequest
                        mySelection={selectedMyPokemons}
                        theirSelection={selectedTheirPokemons}
                        onTradeComplete={handleTradeComplete}
                    />
                </section>
            )}

            <PendingTrades currentUserId={currentUser.id.toString()} otherUserPokemons={otherUserPokemons} />
            <TradeHistory entries={entriesWithPokemons} users={users} />
        </div>
    );
};

export default Exchange;
