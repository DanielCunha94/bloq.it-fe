import { formatDate, isSameDay } from '$lib/utils/time';
import type { FilterAndSortOptions, SortDirection } from './common';
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
