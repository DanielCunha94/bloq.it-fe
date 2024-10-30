import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { capturedPokemon } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

type Params = {
	userId: string;
	pokemonId: string;
};

type UpdateNotesRequestBody = {
	note: string;
};

export const PATCH: RequestHandler<Params> = async ({ params, request, locals }) => {
	if (!locals.session || !locals.session.userId) {
		throw redirect(302, '/login');
	}

	const { userId, pokemonId } = params;

	const requestBody = (await request.json()) as UpdateNotesRequestBody;

	if (!requestBody.note) {
		return json({ error: 'Notes field is required' }, { status: 400 });
	}

	try {
		await db
			.update(capturedPokemon)
			.set({ note: requestBody.note })
			.where(and(eq(capturedPokemon.userId, userId), eq(capturedPokemon.id, pokemonId)));

		return json({ success: true, message: 'Notes updated successfully' });
	} catch (error) {
		console.error('Error updating Pokémon notes:', error);
		return json({ error: 'Internal Server Error' }, { status: 500 });
	}
};
