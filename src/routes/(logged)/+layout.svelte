<script lang="ts">
	import { browser, dev } from '$app/environment';
	import Navbar from '$lib/components/navbar.svelte';
	import { onMount } from 'svelte';
	import { getPokemonsFromPokedex } from '$lib/services/pokedex';
	import type { LayoutData } from './$types';
	import { myPokemons } from '$lib/stores/pokedex';
	import Loading from '$lib/components/loading.svelte';
	import { loading } from '$lib/stores/loading';
	import { getPokemonsCount } from '$lib/services/pokemon';
	import { pokemonsCount } from '$lib/stores/pokemon';
	import { isOnline } from '$lib/stores/conection';

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
		handleOnline();
		load();
	});

	async function load() {
		const [countRes, pokedexRes] = await Promise.all([
			getPokemonsCount(),
			getPokemonsFromPokedex(data.user.id)
		]);

		if (!pokedexRes.hasError) {
			$myPokemons = pokedexRes.data ?? [];
		}

		if (!countRes.hasError) {
			$pokemonsCount = countRes.totalCount ?? 0;
		}
	}

	async function handleOnline() {
		$isOnline = navigator.onLine;
		window.addEventListener('online', () => {
			$isOnline = true;
		});
		window.addEventListener('offline', () => {
			$isOnline = false;
		});
	}
</script>

<Navbar />
<Loading loading={$loading} />
<slot></slot>
