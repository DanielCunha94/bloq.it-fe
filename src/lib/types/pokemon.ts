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
	types: string[];
	captured?: boolean;
};

export const stats = {
	hp: 'health',
	attack: 'attack',
	defense: 'defense',
	'special-attack': 'specialAttack',
	'special-defense': 'specialDefense',
	speed: 'speed'
} as const;

export type Stat = keyof typeof stats;

export type CapturedPokemon = Omit<Pokemon, 'captured'> & {
	createdAt: Date | string;
	note: string | null;
	toDelete?: boolean;
};
