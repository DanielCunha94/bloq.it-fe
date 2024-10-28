<script lang="ts">
	import { getPokemonsList } from '$lib/services/pokemon';
	import type { Pokemon } from '$lib/types/pokemon';
	import Pagination from './(components)/pagination.svelte';
	import PokemonsTable from './(components)/pokemonsTable.svelte';

	let pokemons: Pokemon[] = [];
	let loading = false;
	let totalCount: number = 0;
	let perPage = 10;
	let page: number = 1;
	$: loadPokemons(page);

	async function loadPokemons(page: number) {
		loading = true;
		({ pokemons, totalCount } = await getPokemonsList(perPage * (page - 1), perPage));
		loading = false;
	}
</script>

<div class="mx-4 lg:mx-20 mt-5">
	<PokemonsTable {pokemons} />
</div>

<Pagination bind:page {perPage} {totalCount} {loading} />
