import { addNoteToPokemon, addPokemonToPokedex, deletePokemons } from '$lib/services/pokedex';
import { formatDate, isSameDay } from '$lib/utils/time';
import type { Filter, FilterAndSortOptions, Sort, SortDirection } from '../types/common';
import { setCapturedPokemons } from './pokemon';
import { myPokemons, syncPokedexWithServer } from '$lib/stores/pokedex';
import { loading } from '$lib/stores/loading';
import { get } from 'svelte/store';
import { userId } from '$lib/stores/user';
import type { CapturedPokemon, Pokemon } from '$lib/types/pokemon';
import { newErrorToast, newSuccessToast } from '$lib/utils/toast';

export function capturedPokemonsToCSV(pokemons: CapturedPokemon[]) {
	if (pokemons.length === 0) {
		return '';
	}
	const header = [
		'Name',
		'Height',
		'Weight',
		'Health',
		'Speed',
		'Attack',
		'Defense',
		'Special Attack',
		'Special Defense',
		'Created At',
		'Note'
	].join(',');

	const rows = pokemons.map((pokemon) => {
		return [
			pokemon.name,
			pokemon.height,
			pokemon.weight,
			pokemon.health !== null ? pokemon.health : '',
			pokemon.speed !== null ? pokemon.speed : '',
			pokemon.attack !== null ? pokemon.attack : '',
			pokemon.defense !== null ? pokemon.defense : '',
			pokemon.specialAttack !== null ? pokemon.specialAttack : '',
			pokemon.specialDefense !== null ? pokemon.specialDefense : '',
			formatDate(pokemon.createdAt),
			pokemon.note !== null ? pokemon.note : ''
		].join(',');
	});

	return [header, ...rows].join('\n');
}

export function filterPokemons(
	pokemons: CapturedPokemon[],
	options: { key: FilterAndSortOptions; value: string }
): CapturedPokemon[] {
	const { key, value } = options;

	if (key === 'name') {
		return pokemons.filter((pokemon) => pokemon.name.toLowerCase().includes(value.toLowerCase()));
	}

	if (key === 'height') {
		const heightValue = parseFloat(value);
		return pokemons.filter((pokemon) => pokemon.height === heightValue);
	}

	if (key === 'type') {
		return pokemons.filter((pokemon) =>
			pokemon.types.some((type) => type.toLowerCase().includes(value.toLowerCase()))
		);
	}

	if (key === 'createdAt') {
		return pokemons.filter((pokemon) => isSameDay(pokemon.createdAt, value));
	}

	return pokemons;
}

export function sortPokemons(
	pokemons: CapturedPokemon[],
	options: { key: FilterAndSortOptions; direction: SortDirection }
): CapturedPokemon[] {
	const { key, direction } = options;

	if (key === 'name') {
		return pokemons.toSorted((a, b) => {
			const comparison = a.name.localeCompare(b.name);
			return direction === 'asc' ? comparison : -comparison;
		});
	}

	if (key === 'height') {
		return pokemons.toSorted((a, b) => {
			const comparison = a.height - b.height;
			return direction === 'asc' ? comparison : -comparison;
		});
	}

	if (key === 'createdAt') {
		return pokemons.toSorted((a, b) => {
			const comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
			return direction === 'asc' ? comparison : -comparison;
		});
	}
	return pokemons;
}

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

export async function deletePokemonsFromPokedex(pokemons: CapturedPokemon[]) {
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

export function filterAndSortPokemons(filter: Filter, sort: Sort) {
	const capturedPokemons = get(myPokemons);
	if (capturedPokemons.length === 0) {
		return [];
	}

	let filteredAndSortedPokemons = capturedPokemons;
	if (filter?.key && filter?.value) {
		filteredAndSortedPokemons = filterPokemons(filteredAndSortedPokemons, filter);
	}

	if (sort?.key && sort?.direction) {
		filteredAndSortedPokemons = sortPokemons(filteredAndSortedPokemons, sort);
	}

	return filteredAndSortedPokemons;
}

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
