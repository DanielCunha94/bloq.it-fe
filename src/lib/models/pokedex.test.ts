import { describe, expect, it } from 'vitest';
import { capturedPokemonsToCSV, filterPokemons, type CapturedPokemon } from './pokedex';

describe('capturedPokemonsToCSV', () => {
	it('should return an empty string when given an empty array', () => {
		expect(capturedPokemonsToCSV([])).toBe('');
	});

	it('should convert a single CapturedPokemon to CSV format', () => {
		const pokemons: CapturedPokemon[] = [
			{
				id: '001',
				name: 'Bulbasaur',
				height: 0.7,
				weight: 6.9,
				health: 45,
				speed: 45,
				attack: 49,
				defense: 49,
				specialAttack: 65,
				specialDefense: 65,
				imgUrl: null,
				createdAt: new Date('2024-01-01T00:00:00Z'),
				note: 'First capture!',
				types: []
			}
		];

		const expectedCSV = `Name,Height,Weight,Health,Speed,Attack,Defense,Special Attack,Special Defense,Created At,Note
Bulbasaur,0.7,6.9,45,45,49,49,65,65,1/1/2024,First capture!`;

		expect(capturedPokemonsToCSV(pokemons)).toBe(expectedCSV);
	});

	it('should handle null values properly', () => {
		const pokemons: CapturedPokemon[] = [
			{
				id: '002',
				name: 'Ivysaur',
				height: 1.0,
				weight: 13.0,
				health: null,
				speed: null,
				attack: 62,
				defense: null,
				specialAttack: 80,
				specialDefense: null,
				imgUrl: null,
				createdAt: new Date('2024-02-01T00:00:00Z'),
				note: null,
				types: []
			}
		];

		const expectedCSV = `Name,Height,Weight,Health,Speed,Attack,Defense,Special Attack,Special Defense,Created At,Note
Ivysaur,1,13,,,62,,80,,2/1/2024,`;

		expect(capturedPokemonsToCSV(pokemons)).toBe(expectedCSV);
	});

	it('should convert multiple CapturedPokemons to CSV format', () => {
		const pokemons: CapturedPokemon[] = [
			{
				id: '001',
				name: 'Bulbasaur',
				height: 0.7,
				weight: 6.9,
				health: 45,
				speed: 45,
				attack: 49,
				defense: 49,
				specialAttack: 65,
				specialDefense: 65,
				imgUrl: null,
				createdAt: new Date('2024-01-01T00:00:00Z'),
				note: 'First capture!',
				types: []
			},
			{
				id: '002',
				name: 'Ivysaur',
				height: 1.0,
				weight: 13.0,
				health: 60,
				speed: 60,
				attack: 62,
				defense: 63,
				specialAttack: 80,
				specialDefense: 80,
				imgUrl: null,
				createdAt: new Date('2024-02-01T00:00:00Z'),
				note: 'Second capture!',
				types: []
			}
		];

		const expectedCSV = `Name,Height,Weight,Health,Speed,Attack,Defense,Special Attack,Special Defense,Created At,Note
Bulbasaur,0.7,6.9,45,45,49,49,65,65,1/1/2024,First capture!
Ivysaur,1,13,60,60,62,63,80,80,2/1/2024,Second capture!`;

		expect(capturedPokemonsToCSV(pokemons)).toBe(expectedCSV);
	});
});

describe('filterPokemons', () => {
	const pokemons: CapturedPokemon[] = [
		{
			id: '1',
			name: 'Bulbasaur',
			height: 0.7,
			weight: 6.9,
			health: 45,
			speed: 45,
			attack: 49,
			defense: 49,
			specialAttack: 65,
			specialDefense: 65,
			imgUrl: 'url',
			createdAt: new Date('2024-10-28'),
			note: 'First Pokémon',
			types: ['Grass', 'Poison']
		},
		{
			id: '2',
			name: 'Charmander',
			height: 0.6,
			weight: 8.5,
			health: 39,
			speed: 65,
			attack: 52,
			defense: 43,
			specialAttack: 60,
			specialDefense: 50,
			imgUrl: 'url',
			createdAt: new Date('2024-10-29'),
			note: 'Fire type',
			types: ['Fire']
		},
		{
			id: '3',
			name: 'Squirtle',
			height: 0.5,
			weight: 9.0,
			health: 44,
			speed: 43,
			attack: 48,
			defense: 65,
			specialAttack: 50,
			specialDefense: 64,
			imgUrl: 'url',
			createdAt: new Date('2024-10-27'),
			note: null,
			types: ['Water']
		}
	];

	it('should filter by name (case insensitive)', () => {
		const result = filterPokemons(pokemons, { key: 'name', value: 'bulbasaur' });
		expect(result).toEqual([pokemons[0]]);
	});

	it('should filter by height', () => {
		const result = filterPokemons(pokemons, { key: 'height', value: '0.6' });
		expect(result).toEqual([pokemons[1]]);
	});

	it('should filter by type (case insensitive)', () => {
		const result = filterPokemons(pokemons, { key: 'type', value: 'fire' });
		expect(result).toEqual([pokemons[1]]);
	});

	it('should filter by createdAt date', () => {
		const result = filterPokemons(pokemons, { key: 'createdAt', value: '2024-10-28' });
		expect(result).toEqual([pokemons[0]]);
	});
});
