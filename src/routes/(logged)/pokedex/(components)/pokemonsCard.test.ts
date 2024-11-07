import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { isOnline } from '$lib/stores/conection';
import { share } from '$lib/utils/share';
import { tick } from 'svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PokemonsCard from './pokemonsCard.svelte';
import type { CapturedPokemon } from '$lib/types/pokemon';

vi.mock('$lib/utils/share');

const mockPokemon: CapturedPokemon = {
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
	imgUrl: 'imgUrl',
	types: ['grass'],
	createdAt: new Date('2024-10-27'),
	note: ''
};

describe('PokemonsCard', () => {
	beforeEach(() => {
		isOnline.set(true);
	});

	it('should enable and trigger share functionality when online', async () => {
		render(PokemonsCard, {
			props: { pokemon: mockPokemon }
		});
		const user = userEvent.setup();
		const shareButton = screen.getByTestId('share');
		expect(shareButton).toBeInTheDocument();
		expect(shareButton).not.toBeDisabled();

		await user.click(shareButton);
		expect(share).toHaveBeenCalledWith({
			title: `Check out my ${mockPokemon.name}!`,
			text: `${mockPokemon.name} (HP: ${mockPokemon.health}, Height: ${mockPokemon.height}, Weight: ${mockPokemon.weight})`,
			url: mockPokemon.imgUrl
		});
	});

	it('should disable share button when offline', () => {
		isOnline.set(false);
		render(PokemonsCard, {
			props: { pokemon: mockPokemon }
		});

		const shareButton = screen.getByTestId('share');
		expect(shareButton).toBeDisabled();
	});

	it('should toggle checkbox based on online status', async () => {
		render(PokemonsCard, {
			props: { pokemon: mockPokemon }
		});
		const user = userEvent.setup();
		const checkbox = screen.getByLabelText('To delete');
		expect(checkbox).toBeInTheDocument();
		expect(checkbox).not.toBeDisabled();

		await user.click(checkbox);
		expect(mockPokemon.toDelete).toBe(true);
		isOnline.set(false);
		await tick();
		expect(checkbox).toBeDisabled();
	});

	it('should update the note in the textarea and dispatch addNote event on button click', async () => {
		const { component } = render(PokemonsCard, {
			props: { pokemon: mockPokemon }
		});
		const user = userEvent.setup();
		const textarea = screen.getByTestId('text-area');
		expect(textarea).toBeInTheDocument();
		await user.type(textarea, 'A new note');

		expect(textarea).toHaveValue('A new note');

		const addNoteButton = screen.getByTestId('button-add-note');
		expect(addNoteButton).not.toBeDisabled();

		const addNoteHandler = vi.fn();
		component.$on('addNote', addNoteHandler);

		await userEvent.click(addNoteButton);

		expect(addNoteHandler).toHaveBeenCalledWith(
			expect.objectContaining({
				detail: { note: 'A new note' }
			})
		);
	});

	it('should disable Add Note button when there is no note or offline', async () => {
		render(PokemonsCard, {
			props: { pokemon: mockPokemon }
		});
		const user = userEvent.setup();

		const addNoteButton = screen.getByTestId('button-add-note');
		expect(addNoteButton).toBeDisabled();

		const textarea = screen.getByTestId('text-area');
		await user.type(textarea, 'Test note');
		expect(addNoteButton).not.toBeDisabled();

		isOnline.set(false);
		await tick();
		expect(addNoteButton).toBeDisabled();
	});
});
