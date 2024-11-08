import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { capturedPokemon } from '$lib/server/db/schema';
import { eq, inArray } from 'drizzle-orm';
import type {  Pokemon } from '$lib/models/pokemon';
import type { CapturedPokemon } from '$lib/models/pokedex';

type Params = {
	userId: string;
};

export const POST: RequestHandler<Params> = async ({ params, request, locals }) => {
	if (!locals.session || !locals.session.userId) {
		throw redirect(302, '/login');
	}

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
		imgUrl,
		types
	} = (await request.json()) as Pokemon;

	if (!userId || !name || !height || !weight) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}

	try {
		await db.insert(capturedPokemon).values({
			dbId: crypto.randomUUID(),
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
			note: undefined,
			types: JSON.stringify(types)
		});

		return json({ status: 201 });
	} catch (error) {
		console.error('Error adding Pokémon:', error);
		return json({ error: 'Internal Server Error' }, { status: 500 });
	}
};

export const GET: RequestHandler<Params> = async ({ params, locals }) => {
	if (!locals.session || !locals.session.userId) {
		throw redirect(302, '/login');
	}

	const { userId } = params;

	if (!userId) {
		return json({ error: 'Missing userId' }, { status: 400 });
	}

	try {
		const pokemons: CapturedPokemon[] = (
			await db.select().from(capturedPokemon).where(eq(capturedPokemon.userId, userId))
		).map((p) => {
			let types: string[] = [];
			if (p.types) {
				types = JSON.parse(p.types);
			}
			const capturedPokemon: CapturedPokemon = { ...p, types };
			return capturedPokemon;
		});

		return json(pokemons);
	} catch (error) {
		console.error('Error retrieving Pokémon:', error);
		return json({ error: 'Internal Server Error' }, { status: 500 });
	}
};

export async function DELETE({ request, locals }) {
	if (!locals.session || !locals.session.userId) {
		throw redirect(302, '/login');
	}

	const data = await request.json();
	const { ids } = data;

	if (!Array.isArray(ids) || ids.length === 0) {
		return json({ error: 'Invalid request. No IDs provided.' }, { status: 400 });
	}

	try {
		await db.delete(capturedPokemon).where(inArray(capturedPokemon.id, ids));

		return json({ success: true, message: 'Pokémon deleted successfully' });
	} catch (error) {
		console.error('Error deleting captured Pokémon:', error);
		return json({ error: 'An error occurred while deleting Pokémons' }, { status: 500 });
	}
}
