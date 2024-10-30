import { render, screen } from '@testing-library/svelte';
import PokemonsTable from './pokemonsTable.svelte';
import type { Pokemon } from '$lib/models/pokemon';
import { describe, expect, it } from 'vitest';

describe('PokemonTable Component', () => {
	const mockPokemons: Pokemon[] = [
		{
			id: '1',
			imgUrl: 'imgUrl',
			types: [],
			name: 'Pikachu',
			height: 4,
			weight: 60,
			health: 35,
			speed: 90,
			attack: 55,
			defense: 40,
			specialAttack: 50,
			specialDefense: 52
		},
		{
			id: '2',
			imgUrl: 'imgUrl',
			types: [],
			name: 'Bulbasaur',
			height: 7,
			weight: 69,
			health: 45,
			speed: 46,
			attack: 49,
			defense: 48,
			specialAttack: 66,
			specialDefense: 65
		}
	];

	it('renders table headers correctly', () => {
		render(PokemonsTable, { pokemons: mockPokemons });

		expect(screen.getByText('Name')).toBeInTheDocument();
		expect(screen.getByText('Height')).toBeInTheDocument();
		expect(screen.getByText('Weight')).toBeInTheDocument();
		expect(screen.getByText('Health')).toBeInTheDocument();
		expect(screen.getByText('Speed')).toBeInTheDocument();
		expect(screen.getByText('Attack')).toBeInTheDocument();
		expect(screen.getByText('Defense')).toBeInTheDocument();
		expect(screen.getByText('Special Attack')).toBeInTheDocument();
		expect(screen.getByText('Special Defense')).toBeInTheDocument();
	});

	it('renders the correct number of rows based on pokemons array', () => {
		render(PokemonsTable, { pokemons: mockPokemons });

		const rows = screen.getAllByRole('row');
		expect(rows.length).toBe(mockPokemons.length + 1);
	});

	it('displays the correct pokemon data in each cell', () => {
		render(PokemonsTable, { pokemons: mockPokemons });

		expect(screen.getByText('Pikachu')).toBeInTheDocument();
		expect(screen.getByText('4')).toBeInTheDocument(); // height
		expect(screen.getByText('60')).toBeInTheDocument(); // weight
		expect(screen.getByText('35')).toBeInTheDocument(); // health
		expect(screen.getByText('90')).toBeInTheDocument(); // speed
		expect(screen.getByText('55')).toBeInTheDocument(); // attack
		expect(screen.getByText('40')).toBeInTheDocument(); // defense
		expect(screen.getByText('50')).toBeInTheDocument(); // special attack
		expect(screen.getByText('52')).toBeInTheDocument(); // special defense

		expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
		expect(screen.getByText('7')).toBeInTheDocument(); // height
		expect(screen.getByText('69')).toBeInTheDocument(); // weight
		expect(screen.getByText('45')).toBeInTheDocument(); // health
		expect(screen.getByText('46')).toBeInTheDocument(); // speed
		expect(screen.getByText('49')).toBeInTheDocument(); // attack
		expect(screen.getByText('48')).toBeInTheDocument(); // defense
		expect(screen.getByText('66')).toBeInTheDocument(); // special attack
		expect(screen.getByText('65')).toBeInTheDocument(); // special defense
	});
});
