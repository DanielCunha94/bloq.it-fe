import type { Pokemon } from '$lib/models/pokemon';
import { addPokemonToPokedex } from '$lib/services/pokedex';
import { get } from 'svelte/store';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { addToPokedex } from './addToPokedex';
import { loading } from '$lib/stores/loading';
import { newErrorToast, newSuccessToast } from '$lib/utils/toast';
import { myPokemons, syncPokedexWithServer } from '$lib/stores/pokedex';

vi.mock('svelte/store', () => ({ get: vi.fn(), writable: vi.fn() }));

vi.mock('$lib/services/pokedex', () => ({
	addPokemonToPokedex: vi.fn()
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
		imgUrl: 'imgUrl',
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
			imgUrl: 'imgUrl',
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
