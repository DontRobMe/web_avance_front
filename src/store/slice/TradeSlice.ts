import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TradeProposal, TradeHistoryEntry } from '../../types/Trade';

interface TradeState {
    pendingTrades: TradeProposal[];
    tradeHistoryEntries: TradeHistoryEntry[];
}

const initialState: TradeState = {
    pendingTrades: [],
    tradeHistoryEntries: [],
};

const tradeSlice = createSlice({
    name: 'trade',
    initialState,
    reducers: {
        addTradeProposal(state, action: PayloadAction<TradeProposal>) {
            state.pendingTrades.push(action.payload);
        },
        updateTradeStatus(state, action: PayloadAction<{ id: string; status: 'accepted' | 'refused' }>) {
            const trade = state.pendingTrades.find(t => t.id === action.payload.id);
            if (trade) {
                trade.status = action.payload.status;
                if (action.payload.status === 'accepted') {
                    state.tradeHistoryEntries.push({
                        id: trade.id,
                        fromUserId: trade.fromUserId,
                        toUserId: trade.toUserId,
                        pokemonsSent: trade.offeredPokemonIds,
                        pokemonsReceived: trade.requestedPokemonIds,
                        timestamp: new Date().toISOString(),
                    });
                    state.pendingTrades = state.pendingTrades.filter(t => t.id !== trade.id);
                }
                if (action.payload.status === 'refused') {
                    state.pendingTrades = state.pendingTrades.filter(t => t.id !== trade.id);
                }
            }
        },
        removeTradeProposal(state, action: PayloadAction<string>) {
            state.pendingTrades = state.pendingTrades.filter(t => t.id !== action.payload);
        },
        setTradeHistory(state, action: PayloadAction<TradeHistoryEntry[]>) {
            state.tradeHistoryEntries = action.payload;
        }
    },
});

export const { addTradeProposal, updateTradeStatus, removeTradeProposal, setTradeHistory } = tradeSlice.actions;
export default tradeSlice.reducer;
