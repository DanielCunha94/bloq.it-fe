<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import type { PageData } from './$types';
	import { addNoteToPokemon } from '$lib/services/pokedex';
	import PokemonsCard from './(components)/pokemonsCard.svelte';
	import { capturedPokemonsToCSV, type CapturedPokemon } from '$lib/models/pokedex';
	import Button from '$lib/components/ui/button/button.svelte';

	import { downloadCSV } from '$lib/utils/csv';
	import Dowload from 'svelte-radix/Download.svelte';
	import { myPokemons } from '$lib/stores/pokedex';

	export let data: PageData;

	let pokemons: CapturedPokemon[] = [];

	$: pokemons = $myPokemons;

	function handleCSV() {
		downloadCSV(capturedPokemonsToCSV(pokemons), 'My_Pokemons.csv');
	}

	async function handleAddNote(note: string, pokemon: CapturedPokemon) {
		const res = await addNoteToPokemon(data.user.id, pokemon.id, note);
	}
</script>

<div class="flex justify-end mx-4 mt-3">
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

<Tabs.Root value="table">
	<div class="flex justify-center">
		<Tabs.List class="mt-3   flex justify-center">
			<Tabs.Trigger value="table">Table View</Tabs.Trigger>
			<Tabs.Trigger value="card">Cards View</Tabs.Trigger>
		</Tabs.List>
	</div>
	<Tabs.Content value="table"></Tabs.Content>
	<Tabs.Content value="card">
		<div class="flex flex-wrap gap-4 justify-center">
			{#each pokemons as pokemon, i (i)}
				<PokemonsCard
					{pokemon}
					on:addNote={(e) => {
						handleAddNote(e.detail.note, pokemon);
					}}
				/>
			{/each}
		</div>
	</Tabs.Content>
</Tabs.Root>
