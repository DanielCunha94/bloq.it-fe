import type { Pokemon } from '$lib/types/pokemon';
import HttpClient from '$lib/utils/http';
import { PUBLIC_BASE_URL } from '$env/static/public';
import type { CapturedPokemon } from '$lib/types/pokedex';

const api = new HttpClient(PUBLIC_BASE_URL);

export async function addPokemonToPokedex(userId: string, pokemon: Pokemon) {
	return api.post<Pokemon, unknown>(`/api/v1/pokedex/${userId}`, pokemon);
}

export async function getPokemonsFromPokedex(userId: string) {
	return api.get<CapturedPokemon[]>(`/api/v1/pokedex/${userId}`);
}
