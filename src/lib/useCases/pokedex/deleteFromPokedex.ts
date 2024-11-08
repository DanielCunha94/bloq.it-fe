import type { CapturedPokemon } from '$lib/models/pokedex';
import { deletePokemons } from '$lib/services/pokedex';
import { loading } from '$lib/stores/loading';
import { myPokemons, syncPokedexWithServer } from '$lib/stores/pokedex';
import { userId } from '$lib/stores/user';
import { newErrorToast, newSuccessToast } from '$lib/utils/toast';
import { get } from 'svelte/store';

export async function deleteFromPokedex(pokemons: CapturedPokemon[]) {
	loading.set(true);
	const _userId = get(userId);
	const deleteIds = pokemons.filter((p) => p.toDelete).map((p) => p.id);
	if (!deleteIds.length) {
		loading.set(false);
		return;
	}

	const res = await deletePokemons(_userId, deleteIds);
	if (res.hasError) {
		newErrorToast('Fail to delete pokemons');
		loading.set(false);
		return;
	}

	newSuccessToast(`pokemons deleted`);
	myPokemons.update((currentPokemons) => currentPokemons.filter((p) => !deleteIds.includes(p.id)));
	loading.set(false);
	syncPokedexWithServer(_userId);
}
