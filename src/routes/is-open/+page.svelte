<script>
	import { resolve } from '$app/paths';
	import Modal from '$lib/Modal.svelte';

	let isOpen = $state(true);
</script>

<a href={resolve('/')}>home</a>
<button type="button" onclick={() => (isOpen = true)}>open</button>

<Modal bind:isOpen enableTransitions={false}>
	<form method="dialog">
		<button>Close</button>
	</form>
</Modal>
