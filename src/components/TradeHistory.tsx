import React from 'react';
import { TradeHistoryEntry } from '../types/Trade';
import {PokedexEntry} from "../types/Pokedex.tsx";

interface TradeHistoryEntryWithPokemons extends Omit<TradeHistoryEntry, 'pokemonsSent' | 'pokemonsReceived'> {
    pokemonsSent: PokedexEntry[];
    pokemonsReceived: PokedexEntry[];
}

interface Props {
    entries: TradeHistoryEntryWithPokemons[];
    users: { id: string, username: string }[];
}

const TradeHistory: React.FC<Props> = ({ entries, users }) => {

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
                            <strong>{entry.timestamp}</strong><br />
                            Avec <strong>{getUsername(entry.toUserId)}</strong>
                        </p>
                        <div className="trade-cards">
                            <div>
                                <p>Donné :</p>
                                {entry.pokemonsSent.map((p, idx) => (
                                    <img key={idx} src={p.isShiny ? p.sprites.shiny : p.sprites.regular} alt={p.name} width={40} />
                                ))}
                            </div>
                            <div>
                                <p>Reçu :</p>
                                {entry.pokemonsReceived.map((p, idx) => (
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
