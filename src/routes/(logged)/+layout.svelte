<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<slot></slot>
<form method="post" action="?/logout" use:enhance>
	<button>Sign out</button>
</form>
