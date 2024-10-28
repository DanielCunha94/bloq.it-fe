<script lang="ts">
	import { browser, dev } from '$app/environment';
	import Navbar from '$lib/components/ui/navBar/navbar.svelte';

	if (browser) {
		if ('serviceWorker' in navigator) {
			addEventListener('load', function () {
				navigator.serviceWorker.register('/service-worker.js', {
					type: dev ? 'module' : 'classic'
				});
			});
		}
	}
</script>

<Navbar />
<slot></slot>
