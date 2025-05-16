// components/TradeHistory.tsx
import React from 'react';
import { PokedexEntry } from '../types/Pokedex';

export interface TradeHistoryEntry {
    timestamp: number;
    fromUserId: string;
    toUserId: string;
    sent: PokedexEntry[];
    received: PokedexEntry[];
}

interface Props {
    entries: TradeHistoryEntry[];
    users: { id: string, username: string }[];
}

const TradeHistory: React.FC<Props> = ({ entries, users }) => {
    const formatDate = (timestamp: number) =>
        new Date(timestamp).toLocaleString();

    const getUsername = (id: string) =>
        users.find(u => u.id === id)?.username || 'Inconnu';

    return (
        <div className="trade-history">
            <h3>Historique des échanges</h3>
            {entries.length === 0 ? (
                <p>Aucun échange effectué.</p>
            ) : (
                entries.slice().reverse().map((entry, i) => (
                    <div key={i} className="trade-entry">
                        <p>
                            <strong>{formatDate(entry.timestamp)}</strong><br />
                            Avec <strong>{getUsername(entry.toUserId)}</strong>
                        </p>
                        <div className="trade-cards">
                            <div>
                                <p>Donné :</p>
                                {entry.sent.map((p, idx) => (
                                    <img key={idx} src={p.isShiny ? p.sprites.shiny : p.sprites.regular} alt={p.name} width={40} />
                                ))}
                            </div>
                            <div>
                                <p>Reçu :</p>
                                {entry.received.map((p, idx) => (
                                    <img key={idx} src={p.isShiny ? p.sprites.shiny : p.sprites.regular} alt={p.name} width={40} />
                                ))}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default TradeHistory;
