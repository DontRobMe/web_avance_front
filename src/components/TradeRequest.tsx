import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/slice/UserSlice';
import { PokedexEntry } from '../types/Pokedex';
import Gallery from './Gallery';

interface Props {
    mySelection: PokedexEntry[];
    theirSelection: PokedexEntry[];
    onTradeComplete: (offeredPokemons: PokedexEntry[], requestedPokemons: PokedexEntry[]) => void;
}

const TradeRequest: React.FC<Props> = ({
                                           mySelection,
                                           theirSelection,
                                           onTradeComplete,
                                       }) => {
    const currentUser = useSelector(selectCurrentUser);

    const handleProposeTrade = () => {
        if (!currentUser) return;

        onTradeComplete(mySelection, theirSelection);
        alert('Proposition envoyée ! En attente de réponse.');
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
