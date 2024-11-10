import { toast } from 'svelte-sonner';

export function newSuccessToast(message: string) {
	toast.success(message);
}

export function newErrorToast(message: string) {
	toast.error(message);
}
