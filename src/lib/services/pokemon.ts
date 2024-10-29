import { externalPokemonToPokemon, type Pokemon } from '$lib/models/pokemon';
import { Pokedex } from 'pokeapi-js-wrapper';
import { toast } from 'svelte-sonner';

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
		toast.error('failed to load Pokémon list');
		return { totalCount: 0, pokemons: [] };
	}
}
