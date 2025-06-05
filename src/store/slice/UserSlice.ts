import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {PokedexEntry} from "./PokedexSlice.ts";

export interface User {
    id: string;
    username: string;
    email: string;
    password?: string;
    pokedex: PokedexEntry[];
    lastGachaDate: string | null
}

interface UserState {
    currentUser: User | null;
    users: User[];
    signupError: string | null;
}

const initialState: UserState = {
    currentUser: JSON.parse(localStorage.getItem('user') || 'null'),
    users: JSON.parse(localStorage.getItem('users') || '[]'),
    signupError: null,
};

export const signupUser = createAsyncThunk<
    User,
    { username: string; email: string; password: string },
    { rejectValue: string }
>('user/signupUser', async (userData, { rejectWithValue }) => {
    try {
        const usersStr = localStorage.getItem('users');
        const users: User[] = usersStr ? JSON.parse(usersStr) : [];

        const exists = users.some(
            (u) => u.username === userData.username || u.email === userData.email
        );

        if (exists) {
            return rejectWithValue('Un utilisateur avec ce nom ou cet email existe déjà');
        }

        const newUser: User = {
            id: Date.now().toString(),
            username: userData.username,
            email: userData.email,
            password: userData.password,
            pokedex: [],
            lastGachaDate: null,
        };

        const updatedUsers = [...users, newUser];
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        localStorage.setItem('user', JSON.stringify(newUser));

        return newUser;
    } catch (error: unknown) {
        if (error instanceof Error) {
            return rejectWithValue(error.message);
        }
        return rejectWithValue('Erreur inconnue lors de l’inscription');
    }

});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCurrentUser(state, action: PayloadAction<User | null>) {
            state.currentUser = action.payload;
            if (action.payload) {
                localStorage.setItem('user', JSON.stringify(action.payload));
            } else {
                localStorage.removeItem('user');
            }
        },
        setUsers(state, action: PayloadAction<User[]>) {
            state.users = action.payload;
            localStorage.setItem('users', JSON.stringify(action.payload));
        },
        logout(state) {
            state.currentUser = null;
            localStorage.removeItem('user');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signupUser.fulfilled, (state, action) => {
                state.currentUser = action.payload;
                state.signupError = null;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.signupError = action.payload || 'Erreur lors de l’inscription';
            });
    },
});

export const { setCurrentUser, setUsers, logout } = userSlice.actions;
export const selectSignupError = (state: { user: UserState }) => state.user.signupError;
export const selectCurrentUser = (state: { user: UserState }) => state.user.currentUser;
export const selectUsers = (state: { user: UserState }) => state.user.users;

export default userSlice.reducer;