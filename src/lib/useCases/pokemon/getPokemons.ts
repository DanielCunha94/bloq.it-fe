import { loading } from '$lib/stores/loading';
import { get } from 'svelte/store';
import { myPokemons } from '$lib/stores/pokedex';
import { getPokemonsList } from '$lib/services/pokemon';
import { setCapturedPokemons } from '$lib/models/pokemon';

export async function getPokemons(page: number, perPage: number) {
	loading.set(true);
	const { pokemons } = await getPokemonsList(perPage * (page - 1), perPage);
	setCapturedPokemons(pokemons, get(myPokemons));

	loading.set(false);
	return pokemons;
}
