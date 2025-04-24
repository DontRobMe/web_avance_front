export interface PokedexEntry {
    pokedex_id: number;
    caughtAt: Date;
    name: string;
    isShiny: boolean;
    level: number;
    sprites: {
        regular: string;
        shiny: string;
    };
    types: {
        name: string;
        image: string;
    }[];
    stats: {
        hp: number;
        atk: number;
        def: number;
        spe_atk: number;
        spe_def: number;
        vit: number;
    };
    evolution: {
        pre: {
            pokedex_id: number;
            name: string;
            condition: string;
        }[];
        next: {
            pokedex_id: number;
            name: string;
        } | null;
        mega: null;
    } | null;
    category: string;
    height: string;
    weight: string;
    egg_groups: string[];
    catch_rate: number;
    level_100: number;
    sexe: {
        male: number;
        female: number;
    };
}
