<script>
	export let loading = false;
</script>

{#if loading}
	<div class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
		<div class="pokeball animate-spin-slow" />
		<p class="invisible w-0 h-0">loading</p>
	</div>
{/if}

<style>
	@keyframes spin-slow {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	.animate-spin-slow {
		animation: spin-slow 1s linear infinite;
	}

	.pokeball {
		width: 80px;
		height: 80px;
		background: linear-gradient(to bottom, #e3350d 50%, #ffffff 50%);
		border: 4px solid black;
		border-radius: 50%;
		position: relative;
	}

	.pokeball::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 24px;
		height: 24px;
		background-color: #ffffff;
		border: 4px solid black;
		border-radius: 50%;
		z-index: 10;
	}

	.pokeball::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 0;
		width: 100%;
		height: 8px;
		background-color: black;
		transform: translateY(-50%);
	}
</style>
