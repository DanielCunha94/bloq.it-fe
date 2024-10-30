import * as auth from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export async function DELETE(event) {
	if (!event.locals.session) {
		return redirect(302, '/login');
	}
	await auth.invalidateSession(event.locals.session.id);
	event.cookies.delete(auth.sessionCookieName, { path: '/' });

	return redirect(302, '/login');
}
