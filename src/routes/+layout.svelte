<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
</script>

<svelte:head>
	<title>PokeBloq.it</title>
	<meta name="description" content="the best app to manage your pokemons" />
</svelte:head>

<Toaster />
<slot></slot>
