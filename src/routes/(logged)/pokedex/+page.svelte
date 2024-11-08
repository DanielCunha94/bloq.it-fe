<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { downloadCSV } from '$lib/utils/csv';
	import Dowload from 'svelte-radix/Download.svelte';
	import { myPokemons } from '$lib/stores/pokedex';
	import Pagination from '$lib/components/pagination.svelte';
	import PokemonsTable from '$lib/components/pokemonsTable.svelte';
	import FilterAndSort from './(components)/filterAndSort.svelte';
	import type { Filter, Sort } from '$lib/models/common';
	import Trash from 'svelte-radix/Trash.svelte';
	import { loading } from '$lib/stores/loading';
	import { pokemonsCount } from '$lib/stores/pokemon';
	import Progress from '$lib/components/ui/progress/progress.svelte';
	import { isOnline } from '$lib/stores/conection';
	import {
		capturedPokemonsToCSV,
		filterAndSortPokemons,
		type CapturedPokemon
	} from '$lib/models/pokedex';
	import { addNoteToMyPokemon } from '$lib/useCases/pokedex/addNoteToMyPokemon';
	import { deleteFromPokedex } from '$lib/useCases/pokedex/deleteFromPokedex';
	import { onDestroy, tick } from 'svelte';

	let debounceTimeout: NodeJS.Timeout | null = null;
	let pokemons: CapturedPokemon[] = [];
	let perPage: number = 10;
	let page: number = 1;
	let filter: Filter;
	let sort: Sort = {
		key: 'name',
		direction: 'asc'
	};

	$: onChangeMyPokemons($myPokemons);
	$: paginatedPokemons = pokemons.slice((page - 1) * perPage, page * perPage);

	onDestroy(() => {
		if (debounceTimeout) clearTimeout(debounceTimeout);
	});

	function handleCSV() {
		downloadCSV(capturedPokemonsToCSV(pokemons), 'My_Pokemons.csv');
	}

	async function handleAddNote(note: string, pokemon: CapturedPokemon) {
		await addNoteToMyPokemon(note, pokemon);
	}

	function handleFilterAndSort() {
		pokemons = filterAndSortPokemons(filter, sort);
	}

	function onChangeMyPokemons(capturedPokemons: CapturedPokemon[]) {
		pokemons = [];
		if (capturedPokemons) {
			handleFilterAndSort();
		}
	}

	async function handleDelete() {
		await deleteFromPokedex(pokemons);
	}

	function debounce(func: () => void, delay = 300) {
		if (debounceTimeout) clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			await tick();
			func();
		}, delay);
	}
</script>

<div class="flex justify-end mx-4 mt-3 gap-3">
	<Button aria-label="delete" variant="destructive" disabled={!$isOnline} on:click={handleDelete}>
		<Trash />
	</Button>
	<Button
		variant="secondary"
		on:click={() => {
			handleCSV();
		}}
	>
		Get CSV
		<Dowload class="ml-2" />
	</Button>
</div>

<FilterAndSort
	on:filter={(e) => {
		filter = { key: e.detail.key, value: e.detail.value };
		debounce(handleFilterAndSort);
	}}
	on:sort={(e) => {
		sort = { key: e.detail.key, direction: e.detail.direction };
		debounce(handleFilterAndSort);
	}}
/>

<Tabs.Root value="table">
	<div class="flex justify-center">
		<Tabs.List class="mt-3   flex justify-center">
			<Tabs.Trigger value="table">Table View</Tabs.Trigger>
			<Tabs.Trigger value="card">Cards View</Tabs.Trigger>
		</Tabs.List>
	</div>
	<div class="flex flex-col lg:flex-row justify-center mt-5 items-center gap-4">
		<Progress value={$myPokemons.length} max={$pokemonsCount} class="w-[50%]" />
		<p>{`${$myPokemons.length} of ${$pokemonsCount} pokemons added to pokédex`}</p>
	</div>
	<Tabs.Content value="table">
		<div class="mx-4 md:mx-20 mt-5">
			{#if $myPokemons?.length}
				<PokemonsTable pokemons={pokemons.slice((page - 1) * perPage, page * perPage)} />
			{:else}
				<div class="flex justify-center items-center">
					<p class="">No pokemons added to pokédex</p>
				</div>
			{/if}
		</div>
	</Tabs.Content>
	<Tabs.Content value="card">
		<div class="flex flex-wrap gap-4 justify-center mt-5">
			{#if $myPokemons?.length}
				{#await import('./(components)/pokemonsCard.svelte') then PokemonCard}
					{#each paginatedPokemons as pokemon, i (i)}
						<PokemonCard.default
							{pokemon}
							on:addNote={async (e) => {
								await handleAddNote(e.detail.note, pokemon);
							}}
						/>
					{/each}
				{/await}
			{:else}
				<div class="flex justify-center items-center">
					<p>No pokemons added to pokédex</p>
				</div>
			{/if}
		</div>
	</Tabs.Content>
</Tabs.Root>

{#if pokemons?.length}
	<Pagination bind:page {perPage} totalCount={pokemons.length} loading={$loading} />
{/if}
