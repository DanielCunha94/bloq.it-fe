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
	import { userId } from '$lib/stores/user';
	import { newErrorToast, newSuccessToast } from '$lib/utils/toast';

	export let data: LayoutData;

	let layoutLoading: boolean = false;

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
		$userId = data.user.id;
		handleOnline();
		load();
	});

	async function load() {
		layoutLoading = true;
		const [countRes, pokedexRes] = await Promise.all([
			getPokemonsCount(),
			getPokemonsFromPokedex(data.user.id)
		]);

		if (!countRes.hasError) {
			$pokemonsCount = countRes.totalCount ?? 0;
		}
		if (!pokedexRes.hasError) {
			$myPokemons = pokedexRes.data ?? [];
		}

		layoutLoading = false;
	}

	async function handleOnline() {
		$isOnline = navigator.onLine;
		window.addEventListener('online', () => {
			$isOnline = true;
			newSuccessToast('Your connection was restored');
		});
		window.addEventListener('offline', () => {
			$isOnline = false;
			newErrorToast('No connection available, limited functionality');
		});
	}
</script>

<Navbar />
<Loading loading={$loading || layoutLoading} />
<slot></slot>
