import { formatDate } from '$lib/utils/time';

export type CapturedPokemon = {
	id: string;
	name: string;
	height: number;
	weight: number;
	health: number | null;
	speed: number | null;
	attack: number | null;
	defense: number | null;
	specialAttack: number | null;
	specialDefense: number | null;
	imgUrl: string | null;
	createdAt: Date | string;
	note: string | null;
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
