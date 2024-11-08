import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { loading } from '$lib/stores/loading';
import { getPokemonsList } from '$lib/services/pokemon';
import { setCapturedPokemons, type Pokemon } from '$lib/models/pokemon';
import { getPokemons } from './getPokemons';
import { get } from 'svelte/store';

vi.mock('$lib/stores/loading', () => ({
	loading: { set: vi.fn() }
}));

vi.mock('$lib/stores/pokedex', () => ({
	myPokemons: { subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })), update: vi.fn(), get: vi.fn() }
}));

vi.mock('$lib/services/pokemon', () => ({
	getPokemonsList: vi.fn()
}));

vi.mock('$lib/models/pokemon', () => ({
	setCapturedPokemons: vi.fn()
}));

vi.mock('svelte/store', () => ({ get: vi.fn(), writable: vi.fn() }));

describe('getPokemons', () => {
	const mockPokemons: Pokemon[] = [
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
			imgUrl: 'imgUrl',
			types: ['Grass', 'Poison'],
			captured: true
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
			imgUrl: 'imgUrl',
			types: ['Grass', 'Poison'],
			captured: false
		}
	];

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should set loading to true, fetch pokemons, update captured pokemons, and set loading to false', async () => {
		const page = 1;
		const perPage = 2;
		(getPokemonsList as Mock).mockResolvedValue({ pokemons: mockPokemons });
		(get as Mock).mockReturnValue([]);

		const result = await getPokemons(page, perPage);

		expect(loading.set).toHaveBeenNthCalledWith(1, true);
		expect(getPokemonsList).toHaveBeenCalledWith(0, perPage);
		expect(setCapturedPokemons).toHaveBeenCalledWith(mockPokemons, []);
		expect(loading.set).toHaveBeenNthCalledWith(2, false);
		expect(result).toEqual(mockPokemons);
	});

	it('should handle errors gracefully and set loading to false if an error is thrown', async () => {
		(getPokemonsList as Mock).mockResolvedValue({ pokemons: [], hasError: true });
		const pokemons = await getPokemons(1, 2);
		expect(pokemons).toEqual([]);
		expect(loading.set).toHaveBeenNthCalledWith(1, true);
		expect(loading.set).toHaveBeenNthCalledWith(2, false);
	});
});
