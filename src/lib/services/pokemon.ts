import { externalPokemonToPokemon, type Pokemon } from '$lib/models/pokemon';
import { Pokedex } from 'pokeapi-js-wrapper';
import { toast } from 'svelte-sonner';

const pokemonAPI = new Pokedex({
	cache: false
});

export async function getPokemonsList(
	offset = 0,
	limit = 10
): Promise<{ totalCount: number; pokemons: Pokemon[]; hasError: boolean }> {
	try {
		const pokemonsList = await pokemonAPI.getPokemonsList({ offset, limit });
		const totalCount = pokemonsList.count;
		const promises = pokemonsList.results.map((pokemon) =>
			pokemonAPI.getPokemonByName(pokemon.name)
		);
		const externalPokemons = await Promise.all(promises);
		const pokemons = externalPokemons.map((p) => externalPokemonToPokemon(p));
		return { totalCount, pokemons, hasError: false };
	} catch {
		toast.error('failed to load Pokémon list');
		return { totalCount: 0, pokemons: [], hasError: true };
	}
}

export async function getPokemonsCount() {
	try {
		const pokemonsList = await pokemonAPI.getPokemonsList({ offset: 1, limit: 1 });
		const totalCount = pokemonsList.count;
		return { totalCount, hasError: false };
	} catch {
		toast.error('failed to load Pokémon count ');
		return { totalCount: 0, hasError: true };
	}
}
