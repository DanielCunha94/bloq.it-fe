import type { Pokemon } from '$lib/types/pokemon';
import { externalPokemonToPokemon } from '$lib/useCases/pokemon';
import { newErrorToast } from '$lib/utils/toast';
import { Pokedex } from 'pokeapi-js-wrapper';

const pokemonAPI = new Pokedex({
	cache: false
});

export async function getPokemonsList(
	offset = 0,
	limit = 10
): Promise<{ pokemons: Pokemon[]; hasError: boolean }> {
	try {
		const { results } = await pokemonAPI.getPokemonsList({ offset, limit });
		const promises = results.map((pokemon) => pokemonAPI.getPokemonByName(pokemon.name));
		const pokemons = (await Promise.all(promises)).map((p) => externalPokemonToPokemon(p));
		return { pokemons, hasError: false };
	} catch {
		newErrorToast('failed to load Pokémon list');
		return { pokemons: [], hasError: true };
	}
}

export async function getPokemonsCount() {
	try {
		const { count } = await pokemonAPI.getPokemonsList({ offset: 1, limit: 1 });
		return { totalCount: count, hasError: false };
	} catch {
		newErrorToast('failed to load Pokémon count ');
		return { totalCount: 0, hasError: true };
	}
}
