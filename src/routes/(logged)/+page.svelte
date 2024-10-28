<script lang="ts">
	import { getPokemonsList } from '$lib/services/pokemon';
	import type { Pokemon } from '$lib/types/pokemon';
	import Pagination from './(components)/pagination.svelte';
	import PokemonsTable from './(components)/pokemonsTable.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import Pokemoncard from './(components)/pokemonCard.svelte';
	import type { PageData } from './$types';
	import { addPokemonToPokedex } from '$lib/services/pokedex';

	export let data: PageData;

	$: console.log(data);

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

	async function handleAddToPokedex(pokemon: Pokemon) {
		const res = await addPokemonToPokedex(data.user.id, pokemon);
	}
</script>

<Tabs.Root value="table">
	<div class="flex justify-center">
		<Tabs.List class="mt-3   flex justify-center">
			<Tabs.Trigger value="table">Table View</Tabs.Trigger>
			<Tabs.Trigger value="card">Cards View</Tabs.Trigger>
		</Tabs.List>
	</div>

	<Tabs.Content value="table">
		<div class="mx-4 lg:mx-20 mt-5">
			<PokemonsTable {pokemons} />
		</div>
	</Tabs.Content>
	<Tabs.Content value="card">
		<div class="flex flex-wrap gap-4 justify-center">
			{#each pokemons as pokemon, i (i)}
				<Pokemoncard
					{pokemon}
					on:addToPokedex={() => {
						handleAddToPokedex(pokemon);
					}}
				/>
			{/each}
		</div>
	</Tabs.Content>
</Tabs.Root>

<Pagination bind:page {perPage} {totalCount} {loading} />
