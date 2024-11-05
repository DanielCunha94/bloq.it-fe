<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { CapturedPokemon } from '$lib/models/pokedex';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { share } from '$lib/utils/share';
	import Share from 'svelte-radix/Share1.svelte';
	import BasePokemonCard from '$lib/components/basePokemonCard.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { FormTextareaEvent } from '$lib/components/ui/textarea';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { isOnline } from '$lib/stores/conection';

	export let pokemon: CapturedPokemon;

	let note: string;

	const dispatch = createEventDispatcher<{ addNote: { note: string } }>();

	function handleShare() {
		const text = `${pokemon.name} (HP: ${pokemon.health}, Height: ${pokemon.height}, Weight: ${pokemon.weight})`;
		share({
			title: `Check out my ${pokemon.name}!`,
			text,
			url: pokemon.imgUrl ? pokemon.imgUrl : undefined
		});
	}

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
		<Button
			aria-label="share"
			data-testid="share"
			variant="outline"
			disabled={!$isOnline}
			on:click={handleShare}
		>
			<Share />
		</Button>

		<div class="flex items-center space-x-2 mt-3">
			<Checkbox id="terms" disabled={!$isOnline} bind:checked={pokemon.toDelete} />
			<Label
				for="terms"
				class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				To delete
			</Label>
		</div>

		<Textarea
			data-testid="text-area"
			disabled={!$isOnline}
			value={pokemon.note}
			class="mt-3"
			placeholder="Add a note here"
			on:input={handleInput}
		/>
		<div class="flex justify-end w-full">
			<Button
				data-testid="button-add-note"
				class="mt-3"
				aria-label="share"
				variant="outline"
				disabled={!note || !$isOnline}
				on:click={handleAddNote}
			>
				Add Note
			</Button>
		</div>
	</Card.Footer>
</Card.Root>
