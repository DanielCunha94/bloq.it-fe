<script lang="ts">
	import * as Pagination from '$lib/components/ui/pagination';

	export let totalCount: number = 0;
	export let perPage: number = 10;
	export let page: number = 1;
	export let loading: boolean = false;
</script>

<Pagination.Root count={totalCount} {perPage} bind:page let:pages let:currentPage>
	<Pagination.Content>
		<Pagination.Item>
			<Pagination.PrevButton disabled={loading || currentPage == 1} />
		</Pagination.Item>
		{#each pages as page (page.key)}
			{#if page.type === 'ellipsis'}
				<Pagination.Item>
					<Pagination.Ellipsis />
				</Pagination.Item>
			{:else}
				<Pagination.Item isVisible={currentPage == page.value}>
					<Pagination.Link disabled={loading} {page} isActive={currentPage == page.value}>
						{page.value}
					</Pagination.Link>
				</Pagination.Item>
			{/if}
		{/each}
		<Pagination.Item>
			<Pagination.NextButton
				disabled={loading || currentPage === Math.ceil(totalCount / perPage)}
			/>
		</Pagination.Item>
	</Pagination.Content>
</Pagination.Root>
