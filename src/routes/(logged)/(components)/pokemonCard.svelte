<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { Pokemon } from '$lib/models/pokemon';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { createEventDispatcher } from 'svelte';
	import BasePokemonCard from '$lib/components/basePokemonCard.svelte';

	export let pokemon: Pokemon;

	const dispatch = createEventDispatcher<{ addToPokedex: undefined }>();

	function handleClick() {
		dispatch('addToPokedex');
	}
</script>

<Card.Root class="w-[350px]">
	<BasePokemonCard {pokemon} />
	<Card.Footer class="flex justify-end">
		<Button variant="ghost" on:click={handleClick}>Add to my pokedex</Button>
	</Card.Footer>
</Card.Root>
