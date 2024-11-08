import type { CapturedPokemon } from '$lib/models/pokedex';
import { addNoteToPokemon } from '$lib/services/pokedex';
import { loading } from '$lib/stores/loading';
import { myPokemons, syncPokedexWithServer } from '$lib/stores/pokedex';
import { userId } from '$lib/stores/user';
import { newErrorToast, newSuccessToast } from '$lib/utils/toast';
import { get } from 'svelte/store';

export async function addNoteToMyPokemon(note: string, pokemon: CapturedPokemon) {
	loading.set(true);
	const _userId = get(userId);
	const res = await addNoteToPokemon(_userId, pokemon.id, note);
	if (res.hasError) {
		newErrorToast('Fail to add note');
		loading.set(false);
		return;
	}
	newSuccessToast(`Note added to ${pokemon.name}`);
	myPokemons.update((pokemons) => {
		const indexToUpdate = pokemons.findIndex((p) => p.id === pokemon.id);
		if (indexToUpdate !== -1) {
			pokemons[indexToUpdate] = {
				...pokemons[indexToUpdate],
				note
			};
		}
		return pokemons;
	});
	loading.set(false);
	syncPokedexWithServer(_userId);
}
