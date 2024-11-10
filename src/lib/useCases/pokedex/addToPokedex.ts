import { setCapturedPokemons, type Pokemon } from '$lib/models/pokemon';
import { addPokemonToPokedex } from '$lib/services/pokedex';
import { loading } from '$lib/stores/loading';
import { myPokemons, syncPokedexWithServer } from '$lib/stores/pokedex';
import { userId } from '$lib/stores/user';
import { newErrorToast, newSuccessToast } from '$lib/utils/toast';
import { get } from 'svelte/store';

export async function addToPokedex(pokemons: Pokemon[], pokemon: Pokemon) {
	loading.set(true);
	const _userId = get(userId);
	const res = await addPokemonToPokedex(_userId, pokemon);
	if (res.hasError) {
		newErrorToast('Fail to add to pokedex');
		loading.set(false);
		return pokemons;
	}
	newSuccessToast(`${pokemon.name} add to pokedex`);

	myPokemons.update((currentPokemons) => [
		...currentPokemons,
		{
			...pokemon,
			note: null,
			createdAt: new Date().toISOString()
		}
	]);
	loading.set(false);
	syncPokedexWithServer(_userId);
	return setCapturedPokemons(pokemons, get(myPokemons));
}
