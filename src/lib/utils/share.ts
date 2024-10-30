import { toast } from 'svelte-sonner';

export async function share(shareObject: { title: string; text: string; url?: string }) {
	try {
		if (navigator.share) {
			await navigator.share(shareObject);
		} else {
			await navigator.clipboard.writeText(shareObject.text);
		}
	} catch {
		toast.error('share fail');
	}
}
