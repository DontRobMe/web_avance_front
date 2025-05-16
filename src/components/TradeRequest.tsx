import React, { useContext } from 'react';
import { PokedexEntry } from '../types/Pokedex';
import Gallery from './Gallery';
import { TradeProposal } from '../types/Trade';
import { UserContext } from '../context/UserContext';
import { v4 as uuidv4 } from 'uuid';

interface Props {
    myPokemons: PokedexEntry[];
    otherPokemons: PokedexEntry[];
    mySelection: PokedexEntry[];
    theirSelection: PokedexEntry[];
    selectedUserId: string;
    onTradeComplete: (updatedMe: PokedexEntry[], updatedThem: PokedexEntry[]) => void;
}

const TradeRequest: React.FC<Props> = ({
                                           mySelection,
                                           theirSelection,
                                           selectedUserId,
                                       }) => {
    const { currentUser } = useContext(UserContext);

    const handleProposeTrade = () => {
        if (!currentUser) return;

        const proposal: TradeProposal = {
            id: uuidv4(),
            fromUserId: currentUser.id.toString(),
            toUserId: selectedUserId,
            mySelection,
            theirSelection,
            timestamp: Date.now(),
            status: 'pending',
        };
        alert('Proposition envoyée ! En attente de réponse.');

        const existing = JSON.parse(localStorage.getItem('trade_proposals') || '[]');
        localStorage.setItem('trade_proposals', JSON.stringify([...existing, proposal]));

    };



    return (
        <div className="trade-request">
            <h4>Proposition d’échange</h4>

            <div className="trade-selection">
                <div>
                    <h5>Ce que vous donnez</h5>
                    <Gallery pokemons={mySelection} />
                </div>
                <div>
                    <h5>Ce que vous recevez</h5>
                    <Gallery pokemons={theirSelection} />
                </div>
            </div>

            <button
                onClick={handleProposeTrade}
                disabled={mySelection.length === 0 || theirSelection.length === 0}
            >
                Proposer l’échange
            </button>
        </div>
    );
};

export default TradeRequest;
