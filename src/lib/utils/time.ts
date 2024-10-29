export function formatDate(date: string | Date) {
	if (new Date(date).toString() === 'Invalid Date') {
		return 'Invalid Date';
	}
	return new Intl.DateTimeFormat().format(new Date(date));
}
