<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	let isOpen = false;

	function toggleMenu() {
		isOpen = !isOpen;
	}
</script>

<nav class="bg-card text-foreground">
	<div class="container mx-auto px-4 py-4 flex justify-between items-center">
		<div class="text-2xl font-semibold">
			<p>Bloq.it</p>
		</div>

		<!-- Menu Items (Desktop) -->
		<div class="hidden md:flex space-x-8 bg-card text-card-foreground">
			<a
				href="/"
				class={`transition duration-300 hover:text-primary ${$page.url.pathname == '/' ? 'text-primary' : ''}`}
				>Pokémon</a
			>
			<a
				href="/pokedex"
				class={`transition duration-300 hover:text-primary ${$page.url.pathname == '/pokedex' ? 'text-primary' : ''}`}
			>
				My Pokédex</a
			>
			<form method="post" action="?/logout" use:enhance>
				<button>Sign out</button>
			</form>
		</div>

		<!-- Hamburger Icon (Mobile) -->
		<button
			class="md:hidden focus:outline-none focus:ring-2 focus:ring-gray-600"
			on:click={toggleMenu}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16M4 18h16"
				/>
			</svg>
		</button>
	</div>

	<!-- Mobile Menu -->
	<div class={`md:hidden ${isOpen ? 'block' : 'hidden'}  text-foreground`}>
		<a
			href="/"
			class={`block px-4 py-2 transition duration-300 hover:text-primary ${$page.url.pathname == '/' ? 'text-primary' : ''}`}
			>Pokémon</a
		>
		<a
			href="/pokedex"
			class={`block px-4 py-2 transition duration-300 hover:text-primary ${$page.url.pathname == '/pokedex' ? 'text-primary' : ''}`}
			>My Pokédex</a
		>
		<form method="post" action="?/logout" use:enhance>
			<button class="px-4 py-2"> Sign out</button>
		</form>
	</div>
</nav>
