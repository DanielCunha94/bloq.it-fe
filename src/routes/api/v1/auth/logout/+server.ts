import * as auth from '$lib/server/auth';
import { json, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

export async function POST(event: RequestEvent) {
	if (!event.locals.session) {
		return redirect(302, '/login');
	}
	await auth.invalidateSession(event.locals.session.id);
	event.cookies.delete(auth.sessionCookieName, { path: '/' });

	return json({ message: 'logout success' }, { status: 200 });
}
