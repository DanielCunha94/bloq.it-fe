import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import {
	addNoteToMyPokemon,
	addToPokedex,
	capturedPokemonsToCSV,
	deletePokemonsFromPokedex,
	filterPokemons
} from './pokedex';
import type { CapturedPokemon, Pokemon } from '$lib/types/pokemon';
import { addNoteToPokemon, addPokemonToPokedex, deletePokemons } from '$lib/services/pokedex';
import { loading } from '$lib/stores/loading';
import { newSuccessToast, newErrorToast } from '$lib/utils/toast';
import { myPokemons, syncPokedexWithServer } from '$lib/stores/pokedex';
import { get } from 'svelte/store';

vi.mock('svelte/store', () => ({ get: vi.fn(), writable: vi.fn() }));

vi.mock('$lib/services/pokedex', () => ({
	addPokemonToPokedex: vi.fn(),
	addNoteToPokemon: vi.fn(),
	deletePokemons: vi.fn()
}));
vi.mock('$lib/stores/loading', () => ({
	loading: { set: vi.fn() }
}));

vi.mock('$lib/stores/pokedex', () => ({
	myPokemons: { subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })), update: vi.fn(), get: vi.fn() },
	syncPokedexWithServer: vi.fn()
}));

vi.mock('$lib/utils/toast', () => ({
	newSuccessToast: vi.fn(),
	newErrorToast: vi.fn()
}));

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

describe('addToPokedex', () => {
	const mockPokemon: Pokemon = {
		id: '1',
		name: 'Bulbasaur',
		height: 7,
		weight: 69,
		health: 45,
		speed: 45,
		attack: 49,
		defense: 49,
		specialAttack: 65,
		specialDefense: 65,
		imgUrl: 'http://example.com/bulbasaur.png',
		types: ['Grass', 'Poison']
	};

	const pokemonsList: Pokemon[] = [
		{
			id: '1',
			name: 'Bulbasaur',
			height: 7,
			weight: 69,
			health: 45,
			speed: 45,
			attack: 49,
			defense: 49,
			specialAttack: 65,
			specialDefense: 65,
			imgUrl: 'http://example.com/bulbasaur.png',
			types: ['Grass', 'Poison'],
			captured: false
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
			types: ['Water']
		}
	];

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('successfully adds a pokemon to the pokedex', async () => {
		(addPokemonToPokedex as Mock).mockResolvedValue({ hasError: false });
		(get as Mock).mockReturnValue([
			{
				...mockPokemon,
				note: null,
				createdAt: '12/12/2012'
			}
		]);
		const updatedPokemons = await addToPokedex(pokemonsList, mockPokemon);

		expect(loading.set).toHaveBeenNthCalledWith(1, true);
		expect(loading.set).toHaveBeenNthCalledWith(2, false);
		expect(newSuccessToast).toHaveBeenCalledWith('Bulbasaur add to pokedex');
		expect(myPokemons.update).toHaveBeenCalled();
		expect(syncPokedexWithServer).toHaveBeenCalled();
		expect(updatedPokemons[0].captured).toBe(true);
	});

	it('handles failure to add a pokemon to the pokedex', async () => {
		(addPokemonToPokedex as Mock).mockResolvedValue({ hasError: true });

		const updatedPokemons = await addToPokedex(pokemonsList, mockPokemon);

		expect(loading.set).toHaveBeenNthCalledWith(1, true);
		expect(loading.set).toHaveBeenNthCalledWith(2, false);
		expect(newErrorToast).toHaveBeenCalledWith('Fail to add to pokedex');
		expect(myPokemons.update).not.toHaveBeenCalled();
		expect(syncPokedexWithServer).not.toHaveBeenCalled();
		expect(updatedPokemons).toEqual(pokemonsList);
	});
});

describe('deletePokemonsFromPokedex', () => {
	const mockPokemons: CapturedPokemon[] = [
		{
			id: '001',
			name: 'Bulbasaur',
			height: 7,
			weight: 69,
			health: 45,
			speed: 45,
			attack: 49,
			defense: 49,
			specialAttack: 65,
			specialDefense: 65,
			imgUrl: 'http://example.com/bulbasaur.png',
			types: ['Grass', 'Poison'],
			createdAt: new Date(),
			note: null,
			toDelete: true
		},
		{
			id: '002',
			name: 'Ivysaur',
			height: 10,
			weight: 130,
			health: 60,
			speed: 60,
			attack: 62,
			defense: 63,
			specialAttack: 80,
			specialDefense: 80,
			imgUrl: 'http://example.com/ivysaur.png',
			types: ['Grass', 'Poison'],
			createdAt: new Date(),
			note: null,
			toDelete: false
		}
	];

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('successfully deletes selected pokemons', async () => {
		(deletePokemons as Mock).mockResolvedValue({ hasError: false });

		await deletePokemonsFromPokedex(mockPokemons);

		expect(loading.set).toHaveBeenNthCalledWith(1, true);
		expect(loading.set).toHaveBeenNthCalledWith(2, false);

		expect(newSuccessToast).toHaveBeenCalledWith('pokemons deleted');
		expect(myPokemons.update).toHaveBeenCalled();
		expect(syncPokedexWithServer).toHaveBeenCalled();
	});

	it('handles failure to delete pokemons', async () => {
		(deletePokemons as Mock).mockResolvedValue({ hasError: true });

		await deletePokemonsFromPokedex(mockPokemons);

		expect(loading.set).toHaveBeenNthCalledWith(1, true);
		expect(loading.set).toHaveBeenNthCalledWith(2, false);

		expect(newErrorToast).toHaveBeenCalledWith('Fail to delete pokemons');
		expect(myPokemons.update).not.toHaveBeenCalled();
		expect(syncPokedexWithServer).not.toHaveBeenCalled();
	});

	it('does nothing when no pokemons are marked for deletion', async () => {
		await deletePokemonsFromPokedex([mockPokemons[1]]);

		expect(myPokemons.update).not.toHaveBeenCalled();
		expect(syncPokedexWithServer).not.toHaveBeenCalled();
	});
});

describe('addNoteToMyPokemon', () => {
	const mockPokemon: CapturedPokemon = {
		id: '001',
		name: 'Bulbasaur',
		height: 7,
		weight: 69,
		health: 45,
		speed: 45,
		attack: 49,
		defense: 49,
		specialAttack: 65,
		specialDefense: 65,
		imgUrl: 'imgURL',
		types: ['Grass', 'Poison'],
		createdAt: new Date(),
		note: null,
		toDelete: false
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('successfully adds a note to a Pokemon', async () => {
		(addNoteToPokemon as Mock).mockResolvedValue({ hasError: false });
		await addNoteToMyPokemon('New note', mockPokemon);

		expect(loading.set).toHaveBeenNthCalledWith(1, true);
		expect(loading.set).toHaveBeenNthCalledWith(2, false);
		expect(newSuccessToast).toHaveBeenCalledWith('Note added to Bulbasaur');
		expect(myPokemons.update).toHaveBeenCalledWith(expect.any(Function));
		expect(syncPokedexWithServer).toHaveBeenCalled();
	});

	it('handles failure to add a note', async () => {
		(addNoteToPokemon as Mock).mockResolvedValue({ hasError: true });
		await addNoteToMyPokemon('Failed note', mockPokemon);

		expect(loading.set).toHaveBeenNthCalledWith(1, true);
		expect(loading.set).toHaveBeenNthCalledWith(2, false);
		expect(newErrorToast).toHaveBeenCalledWith('Fail to add note');
		expect(myPokemons.update).not.toHaveBeenCalled();
		expect(syncPokedexWithServer).not.toHaveBeenCalled();
	});
});
