<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import type { CapturedPokemon } from '$lib/models/pokedex';
	import type { Pokemon } from '$lib/models/pokemon';

	export let pokemons: Pokemon[] | CapturedPokemon[] = [];
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Name</Table.Head>
			<Table.Head>Height</Table.Head>
			<Table.Head>Weight</Table.Head>
			<Table.Head>Health</Table.Head>
			<Table.Head>Speed</Table.Head>
			<Table.Head>Attack</Table.Head>
			<Table.Head>Defense</Table.Head>
			<Table.Head>Special Attack</Table.Head>
			<Table.Head>Special Defense</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each pokemons as pokemon, i (i)}
			<Table.Row>
				<Table.Cell>{pokemon.name}</Table.Cell>
				<Table.Cell>{pokemon.height}</Table.Cell>
				<Table.Cell>{pokemon.weight}</Table.Cell>
				<Table.Cell>{pokemon.health}</Table.Cell>
				<Table.Cell>{pokemon.speed}</Table.Cell>
				<Table.Cell>{pokemon.attack}</Table.Cell>
				<Table.Cell>{pokemon.defense}</Table.Cell>
				<Table.Cell>{pokemon.specialAttack}</Table.Cell>
				<Table.Cell>{pokemon.specialDefense}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
