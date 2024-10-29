export function formatDate(date: string | Date) {
	if (new Date(date).toString() === 'Invalid Date') {
		return 'Invalid Date';
	}
	return new Intl.DateTimeFormat().format(new Date(date));
}

export function isSameDay(date1: string | Date, date2: string | Date): boolean {
	const d1 = new Date(date1);
	const d2 = new Date(date2);

	if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
		return false;
	}

	return (
		d1.getFullYear() === d2.getFullYear() &&
		d1.getMonth() === d2.getMonth() &&
		d1.getDate() === d2.getDate()
	);
}
