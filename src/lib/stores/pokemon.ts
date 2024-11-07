import { writable, type Writable } from 'svelte/store';

export const pokemonsCount: Writable<number> = writable(1000);
