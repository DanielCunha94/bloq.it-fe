<script lang="ts">
	import { browser, dev } from '$app/environment';
	import Navbar from '$lib/components/ui/navBar/navbar.svelte';
	import { onMount } from 'svelte';
	import { getPokemonsFromPokedex } from '$lib/services/pokedex';
	import type { LayoutData } from './$types';
	import { myPokemons } from '$lib/stores/pokedex';
	import Loading from '$lib/components/loading.svelte';
	import { loading } from '$lib/stores/loading';

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
		$loading = true;
		const res = await getPokemonsFromPokedex(data.user.id);
		if (!res.hasError) {
			$myPokemons = res.data ?? [];
		}
		$loading = false;
	});
</script>

<Navbar />
<Loading loading={$loading} />
<slot></slot>
