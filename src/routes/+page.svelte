<script>
	import Modal from '$lib/Modal.svelte';
	// NOTE import { Modal } from 'svelte-html-modal'; in README
	// NOTE import { Modal } from 'svelte-html-modal@3'; in REPL

	// Client-side JavaScript is required to display the modal.
	// Even if the initial state is set to true, the modal will be displayed after hydration.
	// Reference https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal
	let isOpen = $state(false);

	const open = () => (isOpen = true);
	const close = () => (isOpen = false);

	// NOTE Remove options in README
	let closeOnBackdropClick = $state(true);
	let closeOnEscapeKey = $state(true);
	let enableTransitions = $state(true);
</script>

<button type="button" onclick={open} data-testid="open">Open Modal</button>
<span>/</span>
<a href="https://github.com/hyunbinseo/svelte-html-modal#readme">svelte-html-modal</a>

<fieldset style:width="fit-content" style:margin-top="1rem">
	<legend>Options</legend>
	<label>
		<input type="checkbox" bind:checked={closeOnBackdropClick} data-testid="backdrop" />
		<span>Close on Backdrop Click</span>
	</label>
	<br />
	<label>
		<input type="checkbox" bind:checked={closeOnEscapeKey} data-testid="esc" />
		<span>Close on Escape Key</span>
	</label>
	<br />
	<label>
		<input type="checkbox" bind:checked={enableTransitions} />
		<span>Enable Transitions</span>
	</label>
</fieldset>

<!-- The wrapper <div> is used for styling. -->
<!-- Reference the <style> element below. -->
<div class="modal-wrapper">
	<Modal
		bind:isOpen
		{closeOnBackdropClick}
		{closeOnEscapeKey}
		{enableTransitions}
		onclose={() => console.log('closing')}
		onclosed={() => console.log('closed')}
	>
		<strong>Close the Modal</strong>
		<ul>
			{#if closeOnBackdropClick}
				<li>Click on the backdrop</li>
			{/if}
			{#if closeOnEscapeKey}
				<li>Press the <kbd>Esc</kbd> key</li>
			{/if}
			<li>
				<button type="button" onclick={close} data-testid="close">JavaScript Button</button>
			</li>
			<li>
				<!-- Reference https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method -->
				<form method="dialog">
					<button data-testid="submit">Submit Button</button>
				</form>
			</li>
		</ul>
	</Modal>
</div>

<style>
	/* Style <dialog> within the .modal-wrapper element. */
	/* Reference https://svelte.dev/docs/svelte/scoped-styles */
	.modal-wrapper > :global(dialog) {
		width: 20rem;
		padding: 1rem;
		border-radius: 0.375rem;
		/* Override user-agent dialog:modal max-sizes. */
		max-height: 100%; /* calc((100% - 6px) - 2em); */
		max-width: 100%; /* calc((100% - 6px) - 2em); */
	}
	.modal-wrapper > :global(dialog::backdrop) {
		backdrop-filter: blur(8px) brightness(0.5);
	}
</style>
