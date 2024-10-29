import { describe, expect, it } from 'vitest';
import { externalPokemonToPokemon, setCapturedPokemons, type Pokemon } from './pokemon';
import type { CapturedPokemon } from './pokedex';

import { type Pokemon as ExternalPokemon } from 'pokeapi-js-wrapper';

describe('externalPokemonToPokemon', () => {
	it('should convert an ExternalPokemon to a Pokemon', () => {
		const externalPokemon = {
			id: 1,
			name: 'bulbasaur',
			height: 7,
			weight: 69,
			sprites: {
				front_default: 'url'
			},
			stats: [
				{ base_stat: 45, stat: { name: 'hp' } },
				{ base_stat: 49, stat: { name: 'attack' } },
				{ base_stat: 49, stat: { name: 'defense' } },
				{ base_stat: 65, stat: { name: 'special-attack' } },
				{ base_stat: 65, stat: { name: 'special-defense' } },
				{ base_stat: 45, stat: { name: 'speed' } }
			],
			types: [{ type: { name: 'grass' } }]
		} as ExternalPokemon;

		const expectedPokemon: Pokemon = {
			id: '1',
			name: 'bulbasaur',
			height: 7,
			weight: 69,
			health: 45,
			speed: 45,
			attack: 49,
			defense: 49,
			specialAttack: 65,
			specialDefense: 65,
			imgUrl: 'url',
			types: ['grass']
		};

		const convertedPokemon = externalPokemonToPokemon(externalPokemon);
		expect(convertedPokemon).toEqual(expectedPokemon);
	});
});

describe('setCapturedPokemons', () => {
	it('sets captured flag for captured Pokémon', () => {
		const pokemons: Pokemon[] = [
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
				imgUrl: null,
				types: ['grass']
			},
			{
				id: '2',
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
				types: ['grass', 'poison']
			},
			{
				id: '3',
				name: 'Venusaur',
				height: 2.0,
				weight: 100.0,
				health: 80,
				speed: 80,
				attack: 82,
				defense: 83,
				specialAttack: 100,
				specialDefense: 100,
				imgUrl: null,
				types: ['grass', 'poison']
			}
		];

		const capturedPokemons: CapturedPokemon[] = [
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
				imgUrl: null,
				createdAt: new Date(),
				note: 'First capture!',
				types: ['grass']
			}
		];

		setCapturedPokemons(pokemons, capturedPokemons);

		expect(pokemons[0].captured).toBe(true);
		expect(pokemons[1].captured).toBe(false);
		expect(pokemons[2].captured).toBe(false);
	});
});
