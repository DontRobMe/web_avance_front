import {PokedexEntry} from "./Pokedex.tsx";

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    level: number;
    capturedPokemons: number;
    wins: number;
    losses: number;
    pokedex: PokedexEntry[];
    lastGachaDate: Date;
}


export interface SignupData {
    username: string;
    email: string;
    password: string;
}
