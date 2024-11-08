import type { CapturedPokemon } from '$lib/models/pokedex';
import { addNoteToPokemon } from '$lib/services/pokedex';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { addNoteToMyPokemon } from './addNoteToMyPokemon';
import { loading } from '$lib/stores/loading';
import { newErrorToast, newSuccessToast } from '$lib/utils/toast';
import { myPokemons, syncPokedexWithServer } from '$lib/stores/pokedex';

vi.mock('svelte/store', () => ({ get: vi.fn(), writable: vi.fn() }));

vi.mock('$lib/services/pokedex', () => ({
	addNoteToPokemon: vi.fn()
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
