<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input';
	import Label from '$lib/components/ui/label/label.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<div class="flex items-center justify-center min-h-screen">
	<form method="post" action="?/login" use:enhance>
		<Card.Root class="w-[350px]">
			<Card.Header>
				<div class="flex justify-center">
					<img
						loading="lazy"
						src="/pokebloq_it.png"
						class="max-w-[150px]"
						alt="the logo of the app (pokebloq.it)"
					/>
				</div>
				<Card.Title>Login</Card.Title>
				<Card.Description>Gotta Catch 'Em All</Card.Description>
			</Card.Header>
			<Card.Content>
				<Label for="Username">Username</Label>
				<Input id="Username" name="username" placeholder="Username" />
				<Label for="passoword">Password</Label>
				<Input id="passoword" type="password" name="password" placeholder="Password" />
				<p class="text-sm font-medium leading-none text-red-500 mt-1">{form?.message ?? ''}</p>
				<div class="mt-2">
					<a class="text-sm font-medium leading-none" href="/register"> Don't have an account? </a>
				</div>
			</Card.Content>
			<Card.Footer class="flex justify-end">
				<Button type="submit">login</Button>
			</Card.Footer>
		</Card.Root>
	</form>
</div>
