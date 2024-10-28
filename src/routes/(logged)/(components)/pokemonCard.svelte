<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { Pokemon } from '$lib/types/pokemon';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { createEventDispatcher } from 'svelte';

	export let pokemon: Pokemon;

	const dispatch = createEventDispatcher<{ addToPokedex: undefined }>();
	const stats = [
		{ title: 'Attack', key: 'attack' },
		{ title: 'Defense', key: 'defense' },
		{ title: 'Speed', key: 'speed' },
		{ title: 'S.Attack', key: 'specialAttack' },
		{ title: 'S. Defense', key: 'specialDefense' }
	] as const;

	function handleClick() {
		dispatch('addToPokedex');
	}
</script>

<Card.Root class="w-[350px]">
	<Card.Header class="flex flex-col items-center">
		<img
			src={pokemon.imgUrl}
			alt={'A pic of ' + pokemon.name}
			class="w-24 h-24 object-contain mb-2"
		/>
		<Card.Title class="text-lg font-bold text-center capitalize">{pokemon.name}</Card.Title>
	</Card.Header>
	<Card.Content class="space-y-2">
		<div class="flex justify-between space-y-1 items-center">
			<p class="text-lg font-semibold">HP: <span>{pokemon.health}</span></p>
			<p class="text-lg font-semibold">Height: <span>{pokemon.height}</span></p>
			<p class="text-lg font-semibold">Weight: <span>{pokemon.weight}</span></p>
		</div>
		{#each stats as stat}
			<div class="flex justify-between space-y-1 items-center">
				<p class=" font-semibold">{stat.title}</p>
				<Progress value={pokemon[stat.key]} max={100} class="w-[60%]" />
				<p>{pokemon[stat.key]}</p>
			</div>
		{/each}
	</Card.Content>
	<Card.Footer class="flex justify-end">
		<Button variant="ghost" on:click={handleClick}>Add to my pokedex</Button>
	</Card.Footer>
</Card.Root>
