import { PokedexEntry } from './Pokedex';

export interface TradeProposal {
    id: string;
    fromUserId: string;
    toUserId: string;
    mySelection: PokedexEntry[];
    theirSelection: PokedexEntry[];
    timestamp: number;
    status: 'pending' | 'accepted' | 'rejected';
}
