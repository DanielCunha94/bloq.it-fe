import type { CapturedPokemon } from '$lib/models/pokedex';
import { writable, type Writable } from 'svelte/store';

export const myPokemons: Writable<CapturedPokemon[]> = writable([]);
