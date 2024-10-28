import { type Pokemon as ExternalPokemon } from 'pokeapi-js-wrapper';

export type Pokemon = {
	id: string;
	name: string;
	height: number;
	weight: number;
	health: number | null;
	speed: number | null;
	attack: number | null;
	defense: number | null;
	specialAttack: number | null;
	specialDefense: number | null;
	imgUrl: string | null;
};

const stats = {
	hp: 'health',
	attack: 'attack',
	defense: 'defense',
	'special-attack': 'specialAttack',
	'special-defense': 'specialDefense',
	speed: 'speed'
} as const;

type Stat = keyof typeof stats;

function isValidStat(stat: string): stat is Stat {
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
		imgUrl: externalPokemon.sprites.front_default
	};
	mapStats(externalPokemon, pokemon);
	return pokemon;
}

function mapStats(externalPokemon: ExternalPokemon, pokemon: Pokemon) {
	externalPokemon.stats.forEach((stat) => {
		const statName = stat.stat.name;
		if (isValidStat(statName) && stats[statName]) {
			pokemon[stats[statName]] = stat.base_stat;
		}
	});
}
