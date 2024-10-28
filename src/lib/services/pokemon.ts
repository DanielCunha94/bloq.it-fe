import { externalPokemonToPokemon, type Pokemon } from '$lib/types/pokemon';
import { Pokedex } from 'pokeapi-js-wrapper';

const pokemonAPI = new Pokedex({
	cache: false
});

export async function getPokemonsList(
	offset = 0,
	limit = 10
): Promise<{ totalCount: number; pokemons: Pokemon[] }> {
	try {
		const pokemonsList = await pokemonAPI.getPokemonsList({ offset, limit });
		const totalCount = pokemonsList.count;
		const promises = pokemonsList.results.map((pokemon) =>
			pokemonAPI.getPokemonByName(pokemon.name)
		);
		const externalPokemons = await Promise.all(promises);
		const pokemons = externalPokemons.map((p) => externalPokemonToPokemon(p));
		return { totalCount, pokemons };
	} catch {
		return { totalCount: 0, pokemons: [] };
	}
}
