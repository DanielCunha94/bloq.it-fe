import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { isOnline } from '$lib/stores/conection';
import { describe, expect, it, vi } from 'vitest';
import PokemonCard from './pokemonCard.svelte';
import type { Pokemon } from '$lib/models/pokemon';

describe('PokemonCard', () => {
	const mockPokemon: Pokemon = {
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
		imgUrl: null,
		types: ['grass'],
		captured: false
	};

	it('should display "Add to my pokedex" button when pokemon is not captured and online', async () => {
		isOnline.set(true);
		const user = userEvent.setup();

		const { component } = render(PokemonCard, {
			props: { pokemon: mockPokemon }
		});

		const addButton = screen.getByText('Add to my pokedex');
		expect(addButton).toBeInTheDocument();
		expect(addButton).not.toBeDisabled();

		const addHandler = vi.fn();
		component.$on('addToPokedex', addHandler);
		await user.click(addButton);

		expect(addHandler).toHaveBeenCalled();
	});

	it('should disable button when offline', async () => {
		isOnline.set(false);
		render(PokemonCard, {
			props: { pokemon: mockPokemon }
		});

		const addButton = screen.getByText('Add to my pokedex');
		expect(addButton).toBeDisabled();
	});

	it('should display CheckCircled icon when pokemon is captured', () => {
		const capturedPokemon = { ...mockPokemon, captured: true };

		const { queryByText } = render(PokemonCard, {
			props: { pokemon: capturedPokemon }
		});

		expect(queryByText('Add to my pokedex')).not.toBeInTheDocument();
		expect(screen.getByTestId('CheckCircled')).toBeInTheDocument();
	});
});
