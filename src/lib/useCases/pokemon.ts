import { type Pokemon as ExternalPokemon } from 'pokeapi-js-wrapper';
import { stats, type CapturedPokemon, type Pokemon, type Stat } from '$lib/types/pokemon';
import { loading } from '$lib/stores/loading';
import { get } from 'svelte/store';
import { myPokemons } from '$lib/stores/pokedex';
import { getPokemonsList } from '$lib/services/pokemon';

function _isValidStat(stat: string): stat is Stat {
	return stat in stats;
}

export function externalPokemonToPokemon(externalPokemon: ExternalPokemon): Pokemon {
	const pokemon: Pokemon = {
		id: externalPokemon.id.toString(),
		name: externalPokemon.name,
		height: externalPokemon.height,
		weight: externalPokemon.weight,
		health: null,
		speed: null,
		attack: null,
		defense: null,
		specialAttack: null,
		specialDefense: null,
		imgUrl: externalPokemon.sprites.front_default,
		types: []
	};
	_mapStats(externalPokemon, pokemon);
	_mapTypes(externalPokemon, pokemon);
	return pokemon;
}

function _mapStats(externalPokemon: ExternalPokemon, pokemon: Pokemon) {
	externalPokemon.stats.forEach((stat) => {
		const statName = stat.stat.name;
		if (_isValidStat(statName) && stats[statName]) {
			pokemon[stats[statName]] = stat.base_stat;
		}
	});
}

function _mapTypes(externalPokemon: ExternalPokemon, pokemon: Pokemon) {
	const types: string[] = [];
	externalPokemon.types.forEach((type) => {
		types.push(type.type.name);
	});
	pokemon.types = types;
}

export function setCapturedPokemons(pokemons: Pokemon[], capturedPokemons: CapturedPokemon[]) {
	const capturedIds = new Set(capturedPokemons?.map((captured) => captured.id));
	pokemons.forEach((pokemon) => {
		pokemon.captured = capturedIds.has(pokemon.id) || false;
	});
	return pokemons;
}

export async function getPokemons(page: number, perPage: number) {
	loading.set(true);
	const { pokemons } = await getPokemonsList(perPage * (page - 1), perPage);
	setCapturedPokemons(pokemons, get(myPokemons));

	loading.set(false);
	return pokemons;
}
