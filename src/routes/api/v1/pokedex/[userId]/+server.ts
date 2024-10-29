import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { capturedPokemon } from '$lib/server/db/schema';
import type { Pokemon } from '$lib/models/pokemon';
import { eq } from 'drizzle-orm';
import type { CapturedPokemon } from '$lib/models/pokedex';

type Params = {
	userId: string;
};

export const POST: RequestHandler<Params> = async ({ params, request }) => {
	const { userId } = params;
	const {
		id,
		name,
		height,
		weight,
		health,
		speed,
		attack,
		defense,
		specialAttack,
		specialDefense,
		imgUrl
	} = (await request.json()) as Pokemon;

	if (!userId || !name || !height || !weight) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}

	try {
		await db.insert(capturedPokemon).values({
			id,
			userId,
			name,
			height,
			weight,
			health,
			speed,
			attack,
			defense,
			specialAttack,
			specialDefense,
			imgUrl,
			createdAt: new Date(),
			note: undefined
		});

		return json({ status: 201 });
	} catch (error) {
		console.error('Error adding Pokémon:', error);
		return json({ error: 'Internal Server Error' }, { status: 500 });
	}
};

export const GET: RequestHandler<Params> = async ({ params }) => {
	const { userId } = params;

	if (!userId) {
		return json({ error: 'Missing userId' }, { status: 400 });
	}

	try {
		const pokemons: CapturedPokemon[] = await db
			.select()
			.from(capturedPokemon)
			.where(eq(capturedPokemon.userId, userId));

		return json(pokemons);
	} catch (error) {
		console.error('Error retrieving Pokémon:', error);
		return json({ error: 'Internal Server Error' }, { status: 500 });
	}
};
