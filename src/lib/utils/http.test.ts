import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import HttpClient from './http';

const BASE_URL = 'https://pokemons.com/api/v1/pokemons';

describe('HttpClient', () => {
	let httpClient: HttpClient;

	beforeEach(() => {
		httpClient = new HttpClient(BASE_URL);
		vi.stubGlobal('fetch', vi.fn());
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	it('should make a GET request and return data', async () => {
		const mockData = { id: 1, name: 'Test' };
		(fetch as Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => mockData
		});

		const response = await httpClient.get<{ id: number; name: string }>('/test');

		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/test`, expect.anything());
		expect(response).toEqual({ hasError: false, data: mockData, error: null });
	});

	it('should handle GET request errors', async () => {
		(fetch as Mock).mockResolvedValueOnce({
			ok: false,
			text: async () => 'Not Found'
		});

		const response = await httpClient.get('/not-found');

		expect(response).toEqual({ hasError: true, data: null, error: 'Not Found' });
	});

	it('should make a POST request with body and return data', async () => {
		const requestBody = { name: 'New Item' };
		const mockData = { id: 2, name: 'New Item' };

		(fetch as Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => mockData
		});

		const response = await httpClient.post<typeof requestBody, typeof mockData>(
			'/items',
			requestBody
		);

		expect(fetch).toHaveBeenCalledWith(
			`${BASE_URL}/items`,
			expect.objectContaining({
				method: 'POST',
				body: JSON.stringify(requestBody)
			})
		);
		expect(response).toEqual({ hasError: false, data: mockData, error: null });
	});

	it('should handle network errors gracefully', async () => {
		(fetch as Mock).mockRejectedValueOnce(new Error('Network Error'));

		const response = await httpClient.get('/error');

		expect(response).toEqual({ hasError: true, data: null, error: 'Request failed' });
	});

	// Similar tests can be written for PUT, DELETE, PATCH methods.

	it('should make a PUT request with body and return data', async () => {
		const requestBody = { name: 'Updated Item' };
		const mockData = { id: 1, name: 'Updated Item' };

		(fetch as Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => mockData
		});

		const response = await httpClient.put<typeof requestBody, typeof mockData>(
			'/items/1',
			requestBody
		);

		expect(fetch).toHaveBeenCalledWith(
			`${BASE_URL}/items/1`,
			expect.objectContaining({
				method: 'PUT',
				body: JSON.stringify(requestBody)
			})
		);
		expect(response).toEqual({ hasError: false, data: mockData, error: null });
	});

	it('should make a DELETE request and return data', async () => {
		const mockData = { success: true };

		(fetch as Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => mockData
		});

		const response = await httpClient.delete<{ success: boolean }>('/items/1');

		expect(fetch).toHaveBeenCalledWith(
			`${BASE_URL}/items/1`,
			expect.objectContaining({
				method: 'DELETE'
			})
		);
		expect(response).toEqual({ hasError: false, data: mockData, error: null });
	});

	it('should make a PATCH request with body and return data', async () => {
		const requestBody = { name: 'Patched Item' };
		const mockData = { id: 1, name: 'Patched Item' };

		(fetch as Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => mockData
		});

		const response = await httpClient.patch<typeof requestBody, typeof mockData>(
			'/items/1',
			requestBody
		);

		expect(fetch).toHaveBeenCalledWith(
			`${BASE_URL}/items/1`,
			expect.objectContaining({
				method: 'PATCH',
				body: JSON.stringify(requestBody)
			})
		);
		expect(response).toEqual({ hasError: false, data: mockData, error: null });
	});
});
