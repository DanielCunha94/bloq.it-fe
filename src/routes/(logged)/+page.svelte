<script lang="ts">
	import { getPokemonsList } from '$lib/services/pokemon';
	import { setCapturedPokemons, type Pokemon } from '$lib/models/pokemon';
	import Pagination from '$lib/components/pagination.svelte';
	import PokemonsTable from '$lib/components/pokemonsTable.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import type { PageData } from './$types';
	import { addPokemonToPokedex } from '$lib/services/pokedex';
	import { toast } from 'svelte-sonner';
	import { myPokemons } from '$lib/stores/pokedex';
	import { loading } from '$lib/stores/loading';
	import { pokemonsCount } from '$lib/stores/pokemon';

	export let data: PageData;

	let pokemons: Pokemon[] = [];
	let perPage: number = 10;
	let page: number = 1;

	$: loadPokemons(page);

	async function loadPokemons(page: number) {
		$loading = true;
		({ pokemons } = await getPokemonsList(perPage * (page - 1), perPage));
		setCapturedPokemons(pokemons, $myPokemons);
		pokemons = pokemons;
		$loading = false;
	}

	async function handleAddToPokedex(pokemon: Pokemon) {
		$loading = true;
		const res = await addPokemonToPokedex(data.user.id, pokemon);
		if (res.hasError) {
			toast.error('Fail to add to pokedex');
			$loading = false;
			return;
		}
		toast.success(`${pokemon.name} add to pokedex`);

		$myPokemons = [
			...$myPokemons,
			{
				...pokemon,
				note: null,
				createdAt: new Date().toISOString()
			}
		];
		setCapturedPokemons(pokemons, $myPokemons);

		pokemons = pokemons;
		$loading = false;
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
						on:addToPokedex={() => {
							handleAddToPokedex(pokemon);
						}}
					/>
				{/each}
			{/await}
		</div>
	</Tabs.Content>
</Tabs.Root>

<Pagination bind:page {perPage} totalCount={$pokemonsCount} loading={$loading} />
