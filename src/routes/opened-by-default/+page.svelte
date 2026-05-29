<script lang="ts">
	import { resolve } from '$app/paths';
	import Modal from '$lib/Modal.svelte';

	let dialog = $state<HTMLDialogElement>();
	let isOpen = $state(true);

	$effect(() => {
		if (!dialog) return;
		dialog.dataset.isOpen = String(isOpen);
	});
</script>

<button type="button" onclick={() => (isOpen = true)}>Open</button>
<span>/</span>
<a href={resolve('/')}>Home</a>

<div class="modal-wrapper">
	<Modal bind:dialog bind:isOpen>
		<form method="dialog">
			<button>Close</button>
		</form>
	</Modal>
</div>

<style lang="postcss">
	:root {
		font-family: system-ui;
	}
	.modal-wrapper :global {
		> dialog {
			width: 20rem;
			padding: 1rem;
			border-radius: 0.375rem;
			&::backdrop {
				backdrop-filter: blur(8px) brightness(0.5);
			}
		}
	}
</style>
