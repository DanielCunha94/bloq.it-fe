import { myPokemons } from '$lib/stores/pokedex';
import { formatDate, isSameDay } from '$lib/utils/time';
import { get } from 'svelte/store';
import type { Filter, FilterAndSortOptions, Sort, SortDirection } from './common';
import type { Pokemon } from './pokemon';

export type CapturedPokemon = Omit<Pokemon, 'captured'> & {
	createdAt: Date | string;
	note: string | null;
	toDelete?: boolean;
};

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

	switch (key) {
		case 'name':
			return pokemons.filter((pokemon) => pokemon.name.toLowerCase().includes(value.toLowerCase()));
		case 'height':
			return pokemons.filter((pokemon) => pokemon.height === parseFloat(value));
		case 'type':
			return pokemons.filter((pokemon) =>
				pokemon.types.some((type) => type.toLowerCase().includes(value.toLowerCase()))
			);
		case 'createdAt':
			return pokemons.filter((pokemon) => isSameDay(pokemon.createdAt, value));
		default:
			return pokemons;
	}
}

export function sortPokemons(
	pokemons: CapturedPokemon[],
	options: { key: FilterAndSortOptions; direction: SortDirection }
): CapturedPokemon[] {
	const { key, direction } = options;
	switch (key) {
		case 'name':
			return pokemons.toSorted((a, b) => {
				const comparison = a.name.localeCompare(b.name);
				return direction === 'asc' ? comparison : -comparison;
			});
		case 'height':
			return pokemons.toSorted((a, b) => {
				const comparison = a.height - b.height;
				return direction === 'asc' ? comparison : -comparison;
			});

		case 'createdAt':
			return pokemons.toSorted((a, b) => {
				const comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
				return direction === 'asc' ? comparison : -comparison;
			});
		default:
			return pokemons;
	}
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
