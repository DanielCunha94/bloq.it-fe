<script lang="ts">
	import { browser, dev } from '$app/environment';
	import Navbar from '$lib/components/ui/navBar/navbar.svelte';
	import { onMount } from 'svelte';
	import { getPokemonsFromPokedex } from '$lib/services/pokedex';
	import type { LayoutData } from './$types';
	import { myPokemons } from '$lib/stores/pokedex';

	export let data: LayoutData;

	if (browser) {
		if ('serviceWorker' in navigator) {
			addEventListener('load', function () {
				navigator.serviceWorker.register('/service-worker.js', {
					type: dev ? 'module' : 'classic'
				});
			});
		}
	}

	onMount(async () => {
		const res = await getPokemonsFromPokedex(data.user.id);
		if (!res.hasError) {
			$myPokemons = res.data ?? [];
		}
	});
</script>

<Navbar />
<slot></slot>
