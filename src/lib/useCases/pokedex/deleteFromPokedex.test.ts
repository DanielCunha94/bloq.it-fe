import type { CapturedPokemon } from '$lib/models/pokedex';
import { deletePokemons } from '$lib/services/pokedex';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { deleteFromPokedex } from './deleteFromPokedex';
import { loading } from '$lib/stores/loading';
import { newErrorToast, newSuccessToast } from '$lib/utils/toast';
import { myPokemons, syncPokedexWithServer } from '$lib/stores/pokedex';

vi.mock('svelte/store', () => ({ get: vi.fn(), writable: vi.fn() }));

vi.mock('$lib/services/pokedex', () => ({
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

		await deleteFromPokedex(mockPokemons);

		expect(loading.set).toHaveBeenNthCalledWith(1, true);
		expect(loading.set).toHaveBeenNthCalledWith(2, false);

		expect(newSuccessToast).toHaveBeenCalledWith('pokemons deleted');
		expect(myPokemons.update).toHaveBeenCalled();
		expect(syncPokedexWithServer).toHaveBeenCalled();
	});

	it('handles failure to delete pokemons', async () => {
		(deletePokemons as Mock).mockResolvedValue({ hasError: true });

		await deleteFromPokedex(mockPokemons);

		expect(loading.set).toHaveBeenNthCalledWith(1, true);
		expect(loading.set).toHaveBeenNthCalledWith(2, false);

		expect(newErrorToast).toHaveBeenCalledWith('Fail to delete pokemons');
		expect(myPokemons.update).not.toHaveBeenCalled();
		expect(syncPokedexWithServer).not.toHaveBeenCalled();
	});

	it('does nothing when no pokemons are marked for deletion', async () => {
		await deleteFromPokedex([mockPokemons[1]]);

		expect(myPokemons.update).not.toHaveBeenCalled();
		expect(syncPokedexWithServer).not.toHaveBeenCalled();
	});
});
