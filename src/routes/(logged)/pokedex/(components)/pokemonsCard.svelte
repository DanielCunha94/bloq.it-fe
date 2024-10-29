<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { CapturedPokemon } from '$lib/models/pokedex';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { share } from '$lib/utils/share';
	import Share from 'svelte-radix/Share1.svelte';
	import Trash from 'svelte-radix/Trash.svelte';
	import BasePokemonCard from '$lib/components/basePokemonCard.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { FormTextareaEvent } from '$lib/components/ui/textarea';

	export let pokemon: CapturedPokemon;
	
	let note: string;

	const dispatch = createEventDispatcher<{ addNote: { note: string } }>();

	function handleShare() {
		const text = `${pokemon.name} (HP: ${pokemon.health}, Height: ${pokemon.height}, Weight: ${pokemon.weight})`;
		share({
			title: `Check out ${pokemon.name}!`,
			text,
			url: pokemon.imgUrl ? pokemon.imgUrl : undefined
		});
	}

	function handleDelete() {}

	function handleInput(e: FormTextareaEvent<InputEvent>) {
		const inputValue = (e.target as HTMLInputElement).value;
		note = inputValue ?? '';
	}

	function handleAddNote() {
		dispatch('addNote', { note });
		note = '';
	}
</script>

<Card.Root class="w-[350px]">
	<BasePokemonCard {pokemon} />
	<Card.Footer class="flex-col">
		<div>
			<Button aria-label="share" variant="outline" on:click={handleShare}><Share /></Button>
			<Button aria-label="delete" variant="destructive" on:click={handleDelete}><Trash /></Button>
		</div>

		<Textarea
			value={pokemon.note}
			class="mt-3"
			placeholder="Add a note here"
			on:input={handleInput}
		/>
		<div class="flex justify-end w-full">
			<Button
				class="mt-3"
				aria-label="share"
				variant="outline"
				disabled={!note}
				on:click={handleAddNote}
			>
				Add Note
			</Button>
		</div>
	</Card.Footer>
</Card.Root>
