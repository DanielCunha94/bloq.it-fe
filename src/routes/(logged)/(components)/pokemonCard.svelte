<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { Pokemon } from '$lib/models/pokemon';
	import Button from '$lib/components/ui/button/button.svelte';
	import { createEventDispatcher } from 'svelte';
	import BasePokemonCard from '$lib/components/basePokemonCard.svelte';
	import CheckCircled from 'svelte-radix/CheckCircled.svelte';
	import { isOnline } from '$lib/stores/conection';

	export let pokemon: Pokemon;

	const dispatch = createEventDispatcher<{ addToPokedex: undefined }>();

	function handleClick() {
		dispatch('addToPokedex');
	}
</script>

<Card.Root class="w-[350px]">
	<BasePokemonCard {pokemon} />
	<Card.Footer class="flex justify-end">
		{#if !pokemon.captured}
			<Button variant="ghost" disabled={!$isOnline} on:click={handleClick}>Add to my pokedex</Button
			>
		{:else}
			<CheckCircled />
		{/if}
	</Card.Footer>
</Card.Root>
