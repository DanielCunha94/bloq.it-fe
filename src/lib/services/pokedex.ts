import HttpClient from '$lib/utils/http';
import { PUBLIC_BASE_URL } from '$env/static/public';
import type { CapturedPokemon, Pokemon } from '$lib/types/pokemon';

export const api = new HttpClient(PUBLIC_BASE_URL);

export async function addPokemonToPokedex(userId: string, pokemon: Pokemon) {
	return api.post<Pokemon, unknown>(`/api/v1/pokedex/${userId}`, pokemon);
}

export async function getPokemonsFromPokedex(userId: string) {
	return api.get<CapturedPokemon[]>(`/api/v1/pokedex/${userId}`);
}

export async function addNoteToPokemon(userId: string, pokemonId: string, note: string) {
	return api.patch<{ note: string }, unknown>(`/api/v1/pokedex/${userId}/pokemon/${pokemonId}`, {
		note
	});
}

export async function deletePokemons(userId: string, ids: string[]) {
	return api.delete(`/api/v1/pokedex/${userId}`, {
		ids
	});
}
