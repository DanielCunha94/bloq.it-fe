<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { CapturedPokemon } from '$lib/models/pokedex';
	import type { Pokemon } from '$lib/models/pokemon';
	import { formatDate } from '$lib/utils/time';
	import Badge from './ui/badge/badge.svelte';;
	import { Progress } from './ui/progress';

	export let pokemon: Pokemon | CapturedPokemon;

	const stats = [
		{ title: 'Attack', key: 'attack' },
		{ title: 'Defense', key: 'defense' },
		{ title: 'Speed', key: 'speed' },
		{ title: 'S.Attack', key: 'specialAttack' },
		{ title: 'S. Defense', key: 'specialDefense' }
	] as const;
</script>

<Card.Header class="flex flex-col items-center">
	<img
		src={pokemon.imgUrl}
		alt={'A pic of ' + pokemon.name}
		class="w-24 h-24 object-contain mb-2"
	/>
	<Card.Title class="text-lg font-bold text-center capitalize">{pokemon.name}</Card.Title>
</Card.Header>
<Card.Content class="space-y-2">
	{#if 'createdAt' in pokemon && pokemon.createdAt}
		<div>
			<p class="text-lg font-semibold">
				{`Added in: ${formatDate(pokemon.createdAt)}`}
			</p>
		</div>
	{/if}

	<div class="flex justify-between space-y-1 items-center">
		<p class="text-lg font-semibold">{`HP: ${pokemon.health}`}</p>
		<p class="text-lg font-semibold">{`Height: ${pokemon.height}`}</p>
		<p class="text-lg font-semibold">{`Weight: ${pokemon.weight}`}</p>
	</div>

	{#if pokemon.types}
		<div class="flex justify-center gap-1 space-y-1 items-baseline">
			{#each pokemon.types as type}
				<Badge class="bg-yellow-300" ariant="secondary">{type}</Badge>
			{/each}
		</div>
	{/if}

	{#each stats as stat}
		<div class="flex justify-between space-y-1 items-center">
			<p class=" font-semibold">{stat.title}</p>
			<Progress value={pokemon[stat.key]} max={100} class="w-[60%]" />
			<p>{pokemon[stat.key]}</p>
		</div>
	{/each}
</Card.Content>
