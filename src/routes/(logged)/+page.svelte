<script lang="ts">
	import { getPokemons } from '$lib/useCases/pokemon';
	import Pagination from '$lib/components/pagination.svelte';
	import PokemonsTable from '$lib/components/pokemonsTable.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { loading } from '$lib/stores/loading';
	import { pokemonsCount } from '$lib/stores/pokemon';
	import { addToPokedex } from '$lib/useCases/pokedex';
	import type { Pokemon } from '$lib/types/pokemon';

	let pokemons: Pokemon[] = [];
	let perPage: number = 10;
	let page: number = 1;

	$: loadPokemons(page);

	async function loadPokemons(page: number) {
		pokemons = await getPokemons(page, perPage);
	}

	async function handleAddToPokedex(pokemon: Pokemon) {
		pokemons = await addToPokedex(pokemons, pokemon);
		pokemons = pokemons;
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
		<div class="mx-4 md:mx-20 mt-5">
			<PokemonsTable {pokemons} />
		</div>
	</Tabs.Content>
	<Tabs.Content value="card">
		<div class="flex flex-wrap gap-4 justify-center">
			{#await import('./(components)/pokemonCard.svelte') then PokemonCard}
				{#each pokemons as pokemon, i (i)}
					<PokemonCard.default
						{pokemon}
						on:addToPokedex={async () => {
							await handleAddToPokedex(pokemon);
						}}
					/>
				{/each}
			{/await}
		</div>
	</Tabs.Content>
</Tabs.Root>

<Pagination bind:page {perPage} totalCount={$pokemonsCount} loading={$loading} />
