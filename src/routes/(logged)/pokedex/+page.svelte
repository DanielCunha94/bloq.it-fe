<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import type { PageData } from './$types';
	import { addNoteToPokemon, deletePokemons } from '$lib/services/pokedex';
	import {
		capturedPokemonsToCSV,
		filterPokemons,
		sortPokemons,
		type CapturedPokemon
	} from '$lib/models/pokedex';
	import Button from '$lib/components/ui/button/button.svelte';
	import { downloadCSV } from '$lib/utils/csv';
	import Dowload from 'svelte-radix/Download.svelte';
	import { myPokemons } from '$lib/stores/pokedex';
	import Pagination from '$lib/components/pagination.svelte';
	import PokemonsTable from '$lib/components/pokemonsTable.svelte';
	import { toast } from 'svelte-sonner';
	import FilterAndSort from './(components)/filterAndSort.svelte';
	import type { FilterAndSortOptions, SortDirection } from '$lib/models/common';
	import Trash from 'svelte-radix/Trash.svelte';
	import { loading } from '$lib/stores/loading';

	export let data: PageData;

	let pokemons: CapturedPokemon[] = [];
	let perPage = 10;
	let page: number = 1;
	let filter: { key: FilterAndSortOptions; value: string };
	let sort: { key: FilterAndSortOptions; direction: SortDirection } = {
		key: 'name',
		direction: 'asc'
	};

	$: onChangeMyPokemons($myPokemons);

	function handleCSV() {
		downloadCSV(capturedPokemonsToCSV(pokemons), 'My_Pokemons.csv');
	}

	async function handleAddNote(note: string, pokemon: CapturedPokemon) {
		$loading = true;
		const res = await addNoteToPokemon(data.user.id, pokemon.id, note);
		if (res.hasError) {
			toast.error('Fail to add note');
			$loading = false;
			return;
		}
		toast.success(`Note added to ${pokemon.name}`);

		const indexToUpdate = $myPokemons.findIndex((p) => p.id === pokemon.id);
		if (indexToUpdate != -1) {
			$myPokemons[indexToUpdate].note = note;
		}
		$loading = false;
	}

	function filterAndSort(capturedPokemons: CapturedPokemon[]) {
		if (capturedPokemons.length === 0) {
			pokemons = [];
			return;
		}

		let filterAndSorted = [...capturedPokemons];
		if (filter?.key && filter?.value) {
			filterAndSorted = filterPokemons(filterAndSorted, filter);
		}

		if (sort?.key && sort?.direction) {
			filterAndSorted = sortPokemons(filterAndSorted, sort);
		}

		pokemons = [...filterAndSorted];
	}

	function onChangeMyPokemons(pokemons: CapturedPokemon[]) {
		filterAndSort(pokemons);
	}

	async function handleDelete() {
		$loading = true;
		const deleteIds = pokemons.filter((p) => p.checked).map((p) => p.id);
		if (deleteIds.length) {
			const res = await deletePokemons(data.user.id, deleteIds);
			if (res.hasError) {
				toast.error('Fail to delete pokemons');
				$loading = false;
				return;
			}
			toast.success(`pokemons deleted`);
			$myPokemons = $myPokemons.filter((p) => !deleteIds.includes(p.id));
		}
		$loading = false;
	}
</script>

<div class="flex justify-end mx-4 mt-3 gap-3">
	<Button aria-label="delete" variant="destructive" on:click={handleDelete}><Trash /></Button>
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
		filterAndSort($myPokemons);
	}}
	on:sort={(e) => {
		sort = { key: e.detail.key, direction: e.detail.direction };
		filterAndSort($myPokemons);
	}}
/>

<Tabs.Root value="table">
	<div class="flex justify-center">
		<Tabs.List class="mt-3   flex justify-center">
			<Tabs.Trigger value="table">Table View</Tabs.Trigger>
			<Tabs.Trigger value="card">Cards View</Tabs.Trigger>
		</Tabs.List>
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
				{#each pokemons.slice((page - 1) * perPage, page * perPage) as pokemon, i (i)}
					{#await import('./(components)/pokemonsCard.svelte') then PokemonCard}
						<PokemonCard.default
							{pokemon}
							on:addNote={(e) => {
								handleAddNote(e.detail.note, pokemon);
							}}
						/>
					{/await}
				{/each}
			{:else}
				<div class="flex justify-center items-center">
					<p class="">No pokemons added to pokédex</p>
				</div>
			{/if}
		</div>
	</Tabs.Content>
</Tabs.Root>

{#if pokemons?.length}
	<Pagination bind:page {perPage} totalCount={pokemons.length} loading={$loading} />
{/if}
