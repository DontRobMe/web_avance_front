import {createSlice, PayloadAction, createAsyncThunk, createSelector} from '@reduxjs/toolkit';
import {RootState} from '../../store';
import {PokedexEntry} from '../../types/Pokedex';

interface PokedexState {
    loading: boolean;
    pokemonList: PokedexEntry[];
    otherPokemonList: PokedexEntry[];
    allPokemonList: PokedexEntry[];
    searchTerm: string;
    isShiny: boolean;
    typeFilter: string;
    typesList: string[];
    filteredPokemon: PokedexEntry[];
    pokemonDetail: PokedexEntry | null;
    error?: string | null;
}


const initialState: PokedexState = {
    pokemonList: [],
    otherPokemonList: [],
    allPokemonList: [],
    loading: false,
    searchTerm: '',
    isShiny: false,
    typeFilter: '',
    typesList: ['Feu', 'Eau', 'Plante', 'Électrique', 'Roche'],
    filteredPokemon: [],
    pokemonDetail: null,
    error: null,
};


export const fetchPokemonDetail = createAsyncThunk(
    'pokemon/fetchDetail',
    async (name: string, thunkAPI) => {
        const response = await fetch(`https://tyradex.vercel.app/api/v1/pokemon/${name}`);

        if (!response.ok) {
            return thunkAPI.rejectWithValue('Erreur lors de la récupération du Pokémon');
        }

        const data = await response.json();
        return data;
    }
);

export const savePokemonToLocalPokedex = (userId: string, newEntry: PokedexEntry): void => {
    const key = `pokedex_${userId}`;
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    stored.push(newEntry);
    localStorage.setItem(key, JSON.stringify(stored));
};




export const fetchUserPokedex = createAsyncThunk<PokedexEntry[], string>(
    'pokedex/fetchUserPokedex',
    async (userId, {rejectWithValue}) => {
        try {
            const key = `pokedex_${userId}`;
            const stored = localStorage.getItem(key);

            if (!stored) {
                return [];
            }

            const parsed = JSON.parse(stored);
            return parsed as PokedexEntry[];
        } catch (err) {
            console.error(err);
            return rejectWithValue('Erreur lors du chargement du pokedex local');
        }
    }
);


export const fetchOtherUserPokedex = createAsyncThunk<PokedexEntry[], string>(
    'pokedex/fetchOtherUserPokedex',
    async (userId, {rejectWithValue}) => {
        try {
            const key = `pokedex_${userId}`;
            const stored = localStorage.getItem(key);

            if (!stored) {
                return [];
            }

            const parsed = JSON.parse(stored);
            return parsed as PokedexEntry[];
        } catch (err) {
            console.error(err);
            return rejectWithValue('Erreur lors du chargement du pokedex local');
        }
    }
);


export const fetchPokemonList = createAsyncThunk<PokedexEntry[]>(
    'pokedex/fetchPokemonList',
    async () => {
        const response = await fetch('/api/pokemon');
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération de la liste des Pokémon.');
        }
        return await response.json();
    }
);

const pokedexSlice = createSlice({
    name: 'pokedex',
    initialState,
    reducers: {
        addPokemon(state, action: PayloadAction<PokedexEntry>) {
            state.pokemonList.push(action.payload);
        },
        removePokemon(state, action: PayloadAction<number>) {
            state.pokemonList = state.pokemonList.filter(pokemon => pokemon.pokedex_id !== action.payload);
        },
        setSearchTerm(state, action: PayloadAction<string>) {
            state.searchTerm = action.payload;
        },
        removePokemonsFromUser(state, action: PayloadAction<number[]>) {
            state.pokemonList = state.pokemonList.filter(
                (pokemon) => !action.payload.includes(pokemon.pokedex_id)
            );
        },
        removePokemonsFromOtherUser(state, action: PayloadAction<number[]>) {
            state.otherPokemonList = state.otherPokemonList.filter(
                (pokemon) => !action.payload.includes(pokemon.pokedex_id)
            );
        },
        setTypeFilter(state, action: PayloadAction<string>) {
            state.typeFilter = action.payload;
        },
        toggleShinyFilter(state) {
            state.isShiny = !state.isShiny;
        },
        setUserPokedex(state, action: PayloadAction<PokedexEntry[]>) {
            state.pokemonList = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserPokedex.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserPokedex.fulfilled, (state, action: PayloadAction<PokedexEntry[]>) => {
                state.loading = false;
                state.pokemonList = action.payload;
                state.allPokemonList = mergeUnique(state.otherPokemonList, action.payload);
            })
            .addCase(fetchUserPokedex.rejected, (state) => {
                state.loading = false;
            })
            .addCase(fetchOtherUserPokedex.fulfilled, (state, action: PayloadAction<PokedexEntry[]>) => {
                state.otherPokemonList = action.payload;
                state.allPokemonList = mergeUnique(state.pokemonList, action.payload);
            })
            .addCase(fetchPokemonList.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPokemonList.fulfilled, (state, action: PayloadAction<PokedexEntry[]>) => {
                state.loading = false;
                state.pokemonList = action.payload;
                state.filteredPokemon = action.payload;
            })
            .addCase(fetchPokemonList.rejected, (state) => {
                state.loading = false;
            })
            .addCase(fetchPokemonDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPokemonDetail.fulfilled, (state, action: PayloadAction<PokedexEntry>) => {
                state.loading = false;
                state.pokemonDetail = action.payload;
            })
            .addCase(fetchPokemonDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Erreur inconnue';
                state.pokemonDetail = null;
            });
    },
});

function mergeUnique(list1: PokedexEntry[], list2: PokedexEntry[]): PokedexEntry[] {
    const map = new Map();
    [...list1, ...list2].forEach((p) => map.set(p.pokedex_id, p));
    return Array.from(map.values());
}

export const selectFilteredPokemon = (state: RootState) => {
    const {pokemonList, searchTerm, isShiny, typeFilter} = state.pokedex;
    const filteredPokemon = pokemonList.filter((pokemon) => {
        const matchesSearchTerm = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter ? pokemon.types.some((t) => t.name === typeFilter) : true;
        const matchesShiny = isShiny ? pokemon.isShiny : true;
        return matchesSearchTerm && matchesType && matchesShiny;
    });

    return {
        filteredPokemon,
        loading: state.pokedex.loading,
        searchTerm: state.pokedex.searchTerm,
        isShiny: state.pokedex.isShiny,
        typeFilter: state.pokedex.typeFilter,
        typesList: state.pokedex.typesList,
    };
};
const selectPokedexState = (state: RootState) => state.pokedex;

export const selectPokemonDetail = createSelector(
    [selectPokedexState],
    (pokedexState) => {
        return {
            pokemon: pokedexState.pokemonDetail,
            loading: pokedexState.loading,
            error: pokedexState.error,
            isShiny: pokedexState.isShiny,
        };
    }
);


export const {
    addPokemon, removePokemon, setSearchTerm, setTypeFilter, toggleShinyFilter, setUserPokedex, removePokemonsFromUser,
    removePokemonsFromOtherUser
} = pokedexSlice.actions;

export const selectPokedexEntries = (state: RootState) => state.pokedex.pokemonList;
export const selectPokedexLoading = (state: RootState) => state.pokedex.loading;

export default pokedexSlice.reducer;
export type {PokedexEntry};

