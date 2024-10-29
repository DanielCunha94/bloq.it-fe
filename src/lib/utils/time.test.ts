import { describe, expect, it } from 'vitest';
import { formatDate, isSameDay } from './time';

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

describe('isSameDay', () => {
	it('should return true for the same date', () => {
		expect(isSameDay('2024-10-29', new Date('2024-10-29'))).toBe(true);
		expect(isSameDay(new Date('2024-10-29'), '2024-10-29')).toBe(true);
		expect(isSameDay(new Date('2024-10-29T00:00:00Z'), new Date('2024-10-29'))).toBe(true);
	});

	it('should return false for different dates', () => {
		expect(isSameDay('2024-10-29', new Date('2024-10-30'))).toBe(false);
		expect(isSameDay(new Date('2024-10-29'), '2024-10-28')).toBe(false);
		expect(isSameDay('2024-10-29', '2024-10-30')).toBe(false);
	});

	it('should return false for invalid dates', () => {
		expect(isSameDay('invalid-date', new Date())).toBe(false);
		expect(isSameDay(new Date(), 'invalid-date')).toBe(false);
		expect(isSameDay('2024-10-29', 'invalid-date')).toBe(false);
	});

	it('should handle various date formats', () => {
		expect(isSameDay('10/29/2024', '2024-10-29')).toBe(true);
		expect(isSameDay('2024-10-29T12:00:00', '2024-10-29')).toBe(true);
	});
});
