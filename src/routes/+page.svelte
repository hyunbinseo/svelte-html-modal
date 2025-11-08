<script>
	import { resolve } from '$app/paths';
	import Modal from '$lib/Modal.svelte';

	let isOpen = $state(false);

	let closeOnBackdropClick = $state(true);
	let closeOnEscapeKey = $state(true);
</script>

<button type="button" onclick={() => (isOpen = true)} data-testid="open">Open</button>
<span>/</span>
<a href={resolve('/opened-by-default')}>Opened by Default</a>

<fieldset>
	<legend>Close on</legend>
	<label>
		<input type="checkbox" bind:checked={closeOnBackdropClick} data-testid="backdrop" />
		<span>Backdrop Click</span>
	</label>
	<br />
	<label>
		<input type="checkbox" bind:checked={closeOnEscapeKey} data-testid="esc" />
		<span>Escape Key</span>
	</label>
</fieldset>

<div class="modal-wrapper">
	<Modal bind:isOpen {closeOnBackdropClick} {closeOnEscapeKey}>
		<strong>Close the Modal</strong>
		<ul>
			{#if closeOnBackdropClick}
				<li>Click on the backdrop</li>
			{/if}
			{#if closeOnEscapeKey}
				<li>Press the <kbd>Esc</kbd> key</li>
			{/if}
			<li>
				<button type="button" onclick={() => (isOpen = false)} data-testid="close">
					JavaScript Button
				</button>
			</li>
			<li>
				<form method="dialog">
					<button data-testid="submit">Submit Button</button>
				</form>
			</li>
		</ul>
	</Modal>
</div>

<style lang="postcss">
	:root {
		font-family: system-ui;
	}
	fieldset {
		width: fit-content;
		margin-top: 1rem;
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
