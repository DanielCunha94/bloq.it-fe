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
	<form method="post" action="?/register" use:enhance>
		<Card.Root class="w-[350px]">
			<Card.Header>
				<Card.Title>Register</Card.Title>
				<Card.Description>Gotta Catch 'Em All</Card.Description>
			</Card.Header>
			<Card.Content>
				<Label for="Username">Username</Label>
				<Input id="Username" name="username" placeholder="Username" />
				<Label for="passoword">Password</Label>
				<Input id="passoword" type="password" name="password" placeholder="Password" />
				<p class="text-sm font-medium leading-none mt-1 text-red-500">{form?.message ?? ''}</p>
				<div class="mt-2">
					<a class="text-sm font-medium leading-none cursor-pointer" href="/login">
						Already have an account?
					</a>
				</div>
			</Card.Content>
			<Card.Footer class="flex justify-end gap-3">
				<Button type="submit">register</Button>
			</Card.Footer>
		</Card.Root>
	</form>
</div>
