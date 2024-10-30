<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { logout } from '$lib/services/auth';

	let isOpen = false;

	function toggleMenu() {
		isOpen = !isOpen;
	}

	async function handleLogout() {
		await logout();
	}
</script>

<nav class="bg-card text-foreground">
	<div class="container mx-auto px-4 py-4 flex justify-between items-center">
		<div class="text-2xl font-semibold">
			<p>PokeBloq.it</p>
		</div>

		<div class="hidden md:flex space-x-8 bg-card text-card-foreground">
			<a
				href="/"
				class={`transition duration-300 hover:text-primary ${$page.url.pathname == '/' ? 'text-primary' : ''}`}
				>All Pokémons</a
			>
			<a
				href="/pokedex"
				class={`transition duration-300 hover:text-primary ${$page.url.pathname == '/pokedex' ? 'text-primary' : ''}`}
			>
				My Pokédex</a
			>
			<form
				method="post"
				on:submit={() => {
					handleLogout();
				}}
			>
				<button type="submit">Sign out</button>
			</form>
		</div>

		<button
			aria-label="burger-button"
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
