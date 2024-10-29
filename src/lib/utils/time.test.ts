import { describe, expect, it } from 'vitest';
import { formatDate } from './time';

describe('formatDate', () => {
	it('should format a Date object correctly', () => {
		const date = new Date('2024-10-29T12:00:00Z');
		const formattedDate = formatDate(date);
		expect(formattedDate).toBe(new Intl.DateTimeFormat().format(date));
	});

	it('should format a date string correctly', () => {
		const dateString = '2024-10-29T12:00:00Z';
		const formattedDate = formatDate(dateString);
		const date = new Date(dateString);
		expect(formattedDate).toBe(new Intl.DateTimeFormat().format(date));
	});

	it('should handle invalid dates gracefully', () => {
		const invalidDate = 'not a date';
		const formattedDate = formatDate(invalidDate);
		expect(formattedDate).toBe('Invalid Date');
	});
});
