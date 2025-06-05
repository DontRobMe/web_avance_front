
export interface TradeProposal {
    id: string;
    fromUserId: string;
    toUserId: string;
    offeredPokemonIds: string[];
    requestedPokemonIds: string[];
    status: 'pending' | 'accepted' | 'refused';
}


export interface TradeHistoryEntry {
    id: string;
    fromUserId: string;
    toUserId: string;
    pokemonsSent: string[];
    pokemonsReceived: string[];
    timestamp: string;
}

