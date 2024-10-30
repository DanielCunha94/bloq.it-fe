import { api } from './pokedex';

export async function logout() {
	return api.delete(`/api/v1/auth`, undefined);
}
