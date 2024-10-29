import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';
import FilterAndSort from './filterAndSort.svelte';

describe('YourComponent', () => {
	it('renders sorting and filtering options', () => {
		render(FilterAndSort);

		expect(screen.getByText('Sort by')).toBeInTheDocument();
		expect(screen.getByText('Filter by')).toBeInTheDocument();
	});

	it('dispatches sort event when sort option is selected', async () => {
		const { component } = render(FilterAndSort);
		const user = userEvent.setup();
		const sortSelect = screen.getAllByText('Name')[0];
		await user.click(sortSelect);
		const sortOption = screen.getByText('Height');
		await user.click(sortOption);

		component.$on('sort', (event) => {
			expect(event.detail).toEqual({ key: 'height', direction: 'asc' });
		});
	});

	it('toggles sort direction when button is clicked', async () => {
		render(FilterAndSort);
		const user = userEvent.setup();
		const sortButton = screen.getByTestId('sort-direction');

		await user.click(sortButton);
		expect(sortButton).toHaveTextContent('desc');
		await userEvent.click(sortButton);
		expect(sortButton).toHaveTextContent('asc');
	});

	it('dispatches filter event when filter input changes', async () => {
		const { component } = render(FilterAndSort);
		const user = userEvent.setup();
	
		const filterInput = screen.getByPlaceholderText('filter input');

		await user.type(filterInput, 'Ivysaur');

		component.$on('filter', (event) => {
			expect(event.detail).toEqual({ key: 'name', value: 'Ivysaur' });
		});
	});
});
