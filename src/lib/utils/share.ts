import { newErrorToast } from './toast';

export async function share(shareObject: { title: string; text: string; url?: string }) {
	try {
		if (navigator.share) {
			await navigator.share(shareObject);
		} else {
			await navigator.clipboard.writeText(shareObject.text);
		}
	} catch (e) {
		if (e != 'AbortError: Share canceled') {
			newErrorToast('share fail');
		}
	}
}
