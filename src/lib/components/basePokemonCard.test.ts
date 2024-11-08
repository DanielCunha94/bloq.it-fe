import { render } from '@testing-library/svelte';
import PokemonCard from './basePokemonCard.svelte';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import type { CapturedPokemon } from '$lib/models/pokedex';

const mockedPokemon: CapturedPokemon = {
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
	imgUrl: 'url',
	createdAt: new Date().toISOString(),
	note: null,
	types: []
};

describe('PokemonCard', () => {
	it('renders the Pokemon details correctly', () => {
		const { getByAltText, getByText } = render(PokemonCard, { pokemon: mockedPokemon });

		expect(getByAltText('A pic of Bulbasaur')).toBeInTheDocument();

		expect(getByText('Bulbasaur')).toBeInTheDocument();

		expect(getByText('HP: 45')).toBeInTheDocument();
		expect(getByText('Height: 7')).toBeInTheDocument();
		expect(getByText('Weight: 69')).toBeInTheDocument();

		expect(getByText('Attack')).toBeInTheDocument();
		expect(getByText('Defense')).toBeInTheDocument();
		expect(getByText('Speed')).toBeInTheDocument();
		expect(getByText('S.Attack')).toBeInTheDocument();
		expect(getByText('S. Defense')).toBeInTheDocument();
	});

	it('displays the createdAt date when present', () => {
		const { getByText } = render(PokemonCard, { pokemon: mockedPokemon });

		expect(getByText(/Added in:/)).toBeInTheDocument();
		expect(
			getByText(new RegExp(new Date(mockedPokemon.createdAt).toLocaleDateString()))
		).toBeInTheDocument();
	});

	it('does not render createdAt if not present', () => {
		const pokemonWithoutCreatedAt = { ...mockedPokemon, createdAt: undefined };

		const { queryByText } = render(PokemonCard, { pokemon: pokemonWithoutCreatedAt });

		expect(queryByText(/Added in:/)).toBeNull();
	});
});
