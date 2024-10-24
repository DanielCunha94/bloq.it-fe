import { hash } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { generateUserId, validatePassword, validateUsername } from '$lib/utils/auth';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	register: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!validateUsername(username)) {
			return fail(400, { message: 'Invalid username' });
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password' });
		}

		const userId = generateUserId();
		const passwordHash = await hash(password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			await db.insert(table.user).values({ id: userId, username, passwordHash });

			const session = await auth.createSession(userId);
			event.cookies.set(auth.sessionCookieName, session.id, {
				path: '/',
				sameSite: 'lax',
				httpOnly: true,
				expires: session.expiresAt,
				secure: !dev
			});
		} catch {
			return fail(500, { message: 'An error has occurred' });
		}
		return redirect(302, '/');
	}
};
