<script lang="ts">
	import Select from '$lib/components/select.svelte';
	import type { FilterAndSortOptions, SortDirection } from '$lib/models/common';
	import Button from '$lib/components/ui/button/button.svelte';
	import ArrowUp from 'svelte-radix/ArrowUp.svelte';
	import ArrowDown from 'svelte-radix/ArrowDown.svelte';
	import { createEventDispatcher } from 'svelte';
	import { Input } from '$lib/components/ui/input';

	let sortDirection: SortDirection = 'asc';
	let sortKey: FilterAndSortOptions = 'name';
	let filterValue: string;
	let filterOption: { value: FilterAndSortOptions; type: string } = {
		value: 'name',
		type: 'text'
	};

	const filterAndSortOptions = [
		{ value: 'name', label: 'Name' },
		{ value: 'height', label: 'Height' },
		{ value: 'createdAt', label: 'CreatedAt' },
		{ value: 'type', label: 'Type' }
	];

	const dispatchSort = createEventDispatcher<{
		sort: { key: FilterAndSortOptions; direction: SortDirection };
	}>();

	const dispatchFilter = createEventDispatcher<{
		filter: {
			key: FilterAndSortOptions;
			value: string;
		};
	}>();
</script>

{#if filterAndSortOptions}
	<div class="flex items-end gap-3 mx-3 md:mx-20">
		<Select
			title={'Sort by'}
			placeholder={'Sort by'}
			options={filterAndSortOptions.slice(0, 3)}
			on:select={(e) => {
				// @ts-expect-error type missmatch
				sortKey = e.detail.value;
				dispatchSort('sort', { key: sortKey, direction: sortDirection });
			}}
		/>

		<Button
			aria-label="sort direction "
			data-testid="sort-direction"
			variant="outline"
			size="icon"
			on:click={() => {
				sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
				dispatchSort('sort', { key: sortKey, direction: sortDirection });
			}}
		>
			{#if sortDirection === 'asc'}
				<ArrowUp class="h-4 w-4" ariaLabel="sort-asc" />
			{:else}
				<ArrowDown class="h-4 w-4" ariaLabel="sort-desc" />
			{/if}
			<p class="invisible w-0 h-0">{sortDirection}</p>
		</Button>
	</div>

	<div class="flex items-end gap-3 mx-3 md:mx-20">
		<Select
			title={'Filter by'}
			placeholder={'Filter by'}
			options={filterAndSortOptions}
			on:select={(e) => {
				filterOption = {
					// @ts-expect-error type missmatch
					value: e.detail.value,
					type: e.detail.value === 'createdAt' ? 'date' : 'text'
				};
			}}
		/>

		<Input
			type={filterOption.type}
			class="max-w-xs"
			id="filter"
			name="filter"
			placeholder="filter input"
			on:input={(e) => {
				// @ts-expect-error type missmatch
				filterValue = e.target.value;
				dispatchFilter('filter', { key: filterOption.value, value: filterValue });
			}}
		/>
	</div>
{/if}
