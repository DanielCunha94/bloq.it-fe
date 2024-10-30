<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { logout } from '$lib/services/auth';
	import { isOnline } from '$lib/stores/conection';

	let isOpen: boolean = false;

	function toggleMenu() {
		isOpen = !isOpen;
	}

	async function handleLogout() {
		const res = await logout();
		if (!res.hasError) {
			await goto('/login');
		}
	}
</script>

<nav class="bg-card text-foreground">
	<div class="mx-auto md:mx-4 px-4 py-4 flex justify-between items-center">
		<div class="text-2xl font-semibold flex items-center gap-3">
			<img src="/pokebloq_it.png" class="max-w-[150px]" alt="the logo of the app (pokebloq.it)" />
			<div
				class="w-2 h-2 rounded-full bg-green-500"
				class:!bg-red-500={!$isOnline}
				title={$isOnline ? 'Online' : 'Offline'}
			/>
			<small class="text-sm font-medium leading-none">{$isOnline ? 'Online' : 'Offline'}</small>
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
				on:submit|preventDefault={() => {
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
