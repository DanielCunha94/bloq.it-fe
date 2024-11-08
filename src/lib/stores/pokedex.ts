import type { CapturedPokemon } from '$lib/models/pokedex';
import { getPokemonsFromPokedex } from '$lib/services/pokedex';
import { writable, type Writable } from 'svelte/store';

export const myPokemons: Writable<CapturedPokemon[]> = writable([]);

export async function syncPokedexWithServer(userId: string) {
	const pokedexRes = await getPokemonsFromPokedex(userId);

	if (!pokedexRes.hasError) {
		myPokemons.set(pokedexRes.data ?? []);
	}
}
