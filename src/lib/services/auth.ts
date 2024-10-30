import { api } from './pokedex';

export async function logout() {
	return api.post(`/api/v1/auth/logout`, undefined);
}
