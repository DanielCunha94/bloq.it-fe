import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Loading from './loading.svelte';

describe('Loading Component', () => {
	it('should not  display overlay and pokeball when loading is true', () => {
		const { container } = render(Loading, { loading: false });
		const overlay = container.querySelector('.fixed');
		const pokeball = container.querySelector('.pokeball');

		expect(overlay).not.toBeInTheDocument();
		expect(pokeball).not.toBeInTheDocument();
	});

	it('should display overlay and pokeball when loading is true', () => {
		const { container } = render(Loading, { loading: true });
		const overlay = container.querySelector('.fixed');
		const pokeball = container.querySelector('.pokeball');

		expect(overlay).toBeInTheDocument();
		expect(pokeball).toBeInTheDocument();
	});
});
