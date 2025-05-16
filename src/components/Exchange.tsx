import React, {useContext, useState, useEffect} from 'react';
import {UserContext} from '../context/UserContext';
import {PokedexEntry} from '../types/Pokedex';
import UserSelector from './UserSelector';
import Gallery from './Gallery';
import TradeRequest from './TradeRequest';
import TradeHistory, {TradeHistoryEntry} from './TradeHistory';
import PendingTrades from './PendingTrades';
import '../styles/Exchange.css';
import {TradeProposal} from "../types/Trade.tsx";


const Exchange: React.FC = () => {
    const {currentUser, users} = useContext(UserContext);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [currentUserPokemons, setCurrentUserPokemons] = useState<PokedexEntry[]>([]);
    const [otherUserPokemons, setOtherUserPokemons] = useState<PokedexEntry[]>([]);
    const [tradeHistory, setTradeHistory] = useState<TradeHistoryEntry[]>([]);
    const [selectedMyPokemons, setSelectedMyPokemons] = useState<PokedexEntry[]>([]);
    const [selectedTheirPokemons, setSelectedTheirPokemons] = useState<PokedexEntry[]>([]);
    const [disabledPokemons, setDisabledPokemons] = useState<{ pokedex_id: number; caughtAt: number }[]>([]);

    useEffect(() => {
        if (currentUser) {
            const key = `pokedex_${currentUser.id}`;
            const stored = localStorage.getItem(key);
            const parsed = stored ? (JSON.parse(stored) as PokedexEntry[]) : [];
            const normalized: PokedexEntry[] = parsed.map(p => ({
                ...p,
                caughtAt:
                    typeof p.caughtAt === 'string'
                        ? new Date(p.caughtAt).getTime()
                        : p.caughtAt,
            }));
            setCurrentUserPokemons(normalized);
            setSelectedMyPokemons([]);
            const historyKey = `trade_history_${currentUser.id}`;
            const historyRaw = localStorage.getItem(historyKey);
            setTradeHistory(historyRaw ? JSON.parse(historyRaw) : []);
        }
    }, [currentUser]);

    useEffect(() => {
        const proposals: TradeProposal[] = JSON.parse(localStorage.getItem('trade_proposals') || '[]');

        const relevantProposals = proposals.filter(
            (p: TradeProposal) =>
                p.status === 'pending' &&
                (p.fromUserId === currentUser?.id.toString() || p.toUserId === currentUser?.id.toString())
        );

        const disabled = relevantProposals.flatMap(p => [
            ...p.mySelection,
            ...p.theirSelection,
        ]);

        setDisabledPokemons(disabled.map(p => ({
            pokedex_id: p.pokedex_id,
            caughtAt: new Date(p.caughtAt).getTime(),
        })));
    }, [currentUser]);


    useEffect(() => {
        if (selectedUserId) {
            const key = `pokedex_${selectedUserId}`;
            const stored = localStorage.getItem(key);
            const parsed = stored ? (JSON.parse(stored) as PokedexEntry[]) : [];
            const normalized = parsed.map(p => ({
                ...p,
                caughtAt: typeof p.caughtAt === 'string'
                    ? Date.parse(p.caughtAt)
                    : p.caughtAt
            }));
            setOtherUserPokemons(normalized);
            setSelectedTheirPokemons([]);
        }
    }, [selectedUserId]);

    const otherUsers = users
        .filter(u => currentUser && u.id !== currentUser.id)
        .map(u => ({
            id: u.id.toString(),
            username: u.username,
        }));

    const isDisabled = (pokemon: PokedexEntry) =>
        disabledPokemons.some(
            dp => dp.pokedex_id === pokemon.pokedex_id && dp.caughtAt === pokemon.caughtAt
        );

    const toggleSelect = (
        pokemon: PokedexEntry,
        setSelectedList: React.Dispatch<React.SetStateAction<PokedexEntry[]>>
    ) => {
        if (isDisabled(pokemon)) return;

        setSelectedList(prev =>
            prev.find(p => p.pokedex_id === pokemon.pokedex_id && p.caughtAt === pokemon.caughtAt)
                ? prev.filter(p => !(p.pokedex_id === pokemon.pokedex_id && p.caughtAt === pokemon.caughtAt))
                : [...prev, pokemon]
        );
    };

    const disabledIds = disabledPokemons.map(p => `${p.pokedex_id}-${p.caughtAt}`);


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
                    onToggleSelect={pokemon =>
                        toggleSelect(pokemon, setSelectedMyPokemons)
                    }
                    disabledItems={disabledIds}
                />
            </section>

            <section>
                <UserSelector
                    users={otherUsers}
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
                        onToggleSelect={pokemon =>
                            toggleSelect(pokemon, setSelectedTheirPokemons)
                        }
                        disabledItems={disabledIds}
                    />

                    <TradeRequest
                        myPokemons={currentUserPokemons}
                        otherPokemons={otherUserPokemons}
                        mySelection={selectedMyPokemons}
                        theirSelection={selectedTheirPokemons}
                        selectedUserId={selectedUserId}
                        onTradeComplete={(updatedMe, updatedThem) => {
                            if (!currentUser || !selectedUserId) return;

                            localStorage.setItem(`pokedex_${currentUser.id}`, JSON.stringify(updatedMe));
                            localStorage.setItem(`pokedex_${selectedUserId}`, JSON.stringify(updatedThem));

                            setCurrentUserPokemons(updatedMe);
                            setOtherUserPokemons(updatedThem);
                            setSelectedMyPokemons([]);
                            setSelectedTheirPokemons([]);

                            const newEntry = {
                                timestamp: Date.now(),
                                fromUserId: currentUser.id.toString(),
                                toUserId: selectedUserId,
                                sent: selectedMyPokemons,
                                received: selectedTheirPokemons,
                            };

                            const historyKey = `trade_history_${currentUser.id}`;
                            const currentHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
                            const updatedHistory = [...currentHistory, newEntry];
                            localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
                            setTradeHistory(updatedHistory);

                            const otherKey = `trade_history_${selectedUserId}`;
                            const otherHistory = JSON.parse(localStorage.getItem(otherKey) || '[]');
                            const updatedOtherHistory = [
                                ...otherHistory,
                                {
                                    ...newEntry,
                                    fromUserId: selectedUserId,
                                    toUserId: currentUser.id.toString(),
                                    sent: selectedTheirPokemons,
                                    received: selectedMyPokemons,
                                },
                            ];
                            localStorage.setItem(otherKey, JSON.stringify(updatedOtherHistory));
                        }}
                    />
                </section>
            )}

            <PendingTrades currentUserId={currentUser.id.toString()} onTradeAccepted={() => {
                const userKey = `pokedex_${currentUser.id}`;
                const userData = localStorage.getItem(userKey);
                setCurrentUserPokemons(userData ? JSON.parse(userData) : []);

                const historyKey = `trade_history_${currentUser.id}`;
                const historyData = localStorage.getItem(historyKey);
                setTradeHistory(historyData ? JSON.parse(historyData) : []);

                if (selectedUserId) {
                    const otherKey = `pokedex_${selectedUserId}`;
                    const otherData = localStorage.getItem(otherKey);
                    setOtherUserPokemons(otherData ? JSON.parse(otherData) : []);
                }

                setSelectedMyPokemons([]);
                setSelectedTheirPokemons([]);
            }}
            />
            <TradeHistory
                entries={tradeHistory}
                users={users.map(u => ({id: u.id.toString(), username: u.username}))}
            />
        </div>
    );
};

export default Exchange;
