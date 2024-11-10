import { writable, type Writable } from 'svelte/store';

export const userId: Writable<string> = writable();
