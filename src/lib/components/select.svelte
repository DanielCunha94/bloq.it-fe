<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import { createEventDispatcher } from 'svelte';
	import { Label } from './ui/label';

	type Option = { value: string; label?: string };

	export let placeholder: string;
	export let title: string;
	export let options: Option[] = [];

	const dispatch = createEventDispatcher<{ select: Option }>();
</script>

<Label for={title}>{title}</Label>
<Select.Root
	selected={options[0]}
	onSelectedChange={(v) => {
		if (v) {
			dispatch('select', v);
		}
	}}
>
	<Select.Trigger class="w-[180px]">
		<Select.Value {placeholder} />
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.Label>{title}</Select.Label>
			{#each options as option}
				<Select.Item value={option.value} label={option.label ?? option.value}>
					{option.label ?? option.value}
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
	<Select.Input name={title} />
</Select.Root>
