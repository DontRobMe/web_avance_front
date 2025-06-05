import {PokedexEntry} from "./Pokedex.tsx";

export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    level: number;
    capturedPokemons: number;
    wins: number;
    losses: number;
    pokedex: PokedexEntry[];
    lastGachaDate: string | null
}

export default User;

export interface SignupData {
    username: string;
    email: string;
    password: string;
}

export interface SimplifiedUser {
    id: number;
    username: string;
}
