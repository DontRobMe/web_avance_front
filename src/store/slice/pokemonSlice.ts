import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Pokemon } from '../../types/Pokemon';
import axios from 'axios';

interface PokemonState {
    selectedPokemon: Pokemon | null;
    isShiny: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: PokemonState = {
    selectedPokemon: null,
    isShiny: false,
    loading: false,
    error: null,
};

export const fetchPokemonByName = createAsyncThunk(
    'pokemon/fetchByName',
    async (nameFr: string, thunkAPI) => {
        try {
            const response = await axios.get(
                `https://tyradex.vercel.app/api/v1/pokemon/${nameFr}`
            );
            console.log(`https://tyradex.vercel.app/api/v1/pokemon/${nameFr}`)

            if (response.data.status === 404) {
                return thunkAPI.rejectWithValue(response.data.message || 'Pokémon non trouvé');
            }

            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue('Pokémon non trouvé ou erreur réseau');
        }
    }
);


const pokemonSlice = createSlice({
    name: 'pokemon',
    initialState,
    reducers: {
        toggleShiny(state) {
            state.isShiny = !state.isShiny;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchPokemonByName.pending, state => {
                state.loading = true;
                state.error = null;
                state.selectedPokemon = null;
            })
            .addCase(fetchPokemonByName.fulfilled, (state, action: PayloadAction<Pokemon>) => {
                state.loading = false;
                state.selectedPokemon = action.payload;
                state.error = null;
            })
            .addCase(fetchPokemonByName.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { toggleShiny } = pokemonSlice.actions;
export default pokemonSlice.reducer;
