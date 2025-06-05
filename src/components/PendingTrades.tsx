import React, { useEffect, useState } from 'react';
import { PokedexEntry } from '../types/Pokedex';
import { TradeProposal } from '../types/Trade';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface Props {
    currentUserId: string;
    otherUserPokemons: PokedexEntry[];
}

const PendingTrades: React.FC<Props> = ({ currentUserId, otherUserPokemons }) => {
    const [pendingTrades, setPendingTrades] = useState<TradeProposal[]>([]);

    const currentUserPokemons = useSelector((state: RootState) => state.pokedex.pokemonList);
    const allUsers = useSelector((state: RootState) => state.user.users);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('trade_proposals') || '[]');
        console.log('Trades from localStorage:', stored);
        const relevant = stored.filter(
            (t: TradeProposal) => t.toUserId.toString() === currentUserId.toString() && t.status === 'pending'
        );

        console.log('Relevant trades:', relevant);
        setPendingTrades(relevant);
    }, [currentUserId]);

    const getFromOfferingUser = (id: string): PokedexEntry | undefined =>
        otherUserPokemons.find((p) => p.pokedex_id.toString() === id);

    const getFromCurrentUser = (id: string): PokedexEntry | undefined =>
        currentUserPokemons.find((p) => p.pokedex_id.toString() === id);

    return (
        <div>
            <h4>Propositions d'échange en attente</h4>
            {pendingTrades.length === 0 && <p>Aucune proposition en attente.</p>}
            {pendingTrades.map((trade) => {
                const fromUser = allUsers.find((u) => u.id.toString() === trade.fromUserId);
                return (
                    <div key={trade.id} style={{ marginBottom: '2rem' }}>
                        <p>
                            Échange proposé par {fromUser?.username || `utilisateur ${trade.fromUserId}`}:
                        </p>

                        <div>
                            <p>Offert :</p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {trade.offeredPokemonIds?.map((id) => {
                                    const poke = getFromOfferingUser(id);
                                    return poke ? (
                                        <img
                                            key={poke.pokedex_id}
                                            src={poke.isShiny ? poke.sprites.shiny : poke.sprites.regular}
                                            alt={poke.name}
                                            width={64}
                                        />
                                    ) : (
                                        <span key={id}>#{id}</span>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <p>Demandé :</p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {trade.requestedPokemonIds?.map((id) => {
                                    const poke = getFromCurrentUser(id);
                                    return poke ? (
                                        <img
                                            key={poke.pokedex_id}
                                            src={poke.isShiny ? poke.sprites.shiny : poke.sprites.regular}
                                            alt={poke.name}
                                            width={64}
                                        />
                                    ) : (
                                        <span key={id}>#{id}</span>
                                    );
                                })}
                            </div>
                        </div>

                        <button>Accepter</button>
                        <button>Refuser</button>
                    </div>
                );
            })}
        </div>
    );
};

export default PendingTrades;
