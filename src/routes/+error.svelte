<script>
	import { page } from '$app/stores';
</script>

<section class="flex items-center justify-center flex-col min-h-screen">
	<img
		loading="lazy"
		src="/pokebloq_it.png"
		class="max-w-[150px]"
		alt="the logo of the app (pokebloq.it)"
	/>

	<h1 class="text-3xl font-semibold">{$page.status} {$page?.error?.message}</h1>
</section>
