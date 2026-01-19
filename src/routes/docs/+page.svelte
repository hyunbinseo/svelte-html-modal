<!-- NOTE Update import path in README -->
<!-- import { Modal } from 'svelte-html-modal'; -->

<script>
	import Modal from '$lib/Modal.svelte';

	// Client-side JavaScript is required to display the modal.
	// See https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal
	let isOpen = $state(false);

	const open = () => (isOpen = true);
	const close = () => (isOpen = false);
</script>

<button type="button" onclick={open}>Open Modal</button>

<!-- The wrapper <div> is used for styling. -->
<!-- See the <style> element below. -->
<div class="modal-wrapper">
	<Modal bind:isOpen closeOnBackdropClick={true} closeOnEscapeKey={true}>
		<strong>Close the Modal</strong>
		<ul>
			<li>Click on the backdrop</li>
			<li>Press the <kbd>Esc</kbd> key</li>
			<li>
				<button type="button" onclick={close}>JavaScript Button</button>
			</li>
			<li>
				<!-- See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method -->
				<form method="dialog">
					<button>Submit Button</button>
				</form>
			</li>
		</ul>
	</Modal>
</div>

<!-- Vanilla CSS -->
<style lang="postcss">
	/* Style <dialog> within the .modal-wrapper element. */
	/* See https://svelte.dev/docs/svelte/scoped-styles */
	.modal-wrapper :global {
		> dialog {
			width: 20rem;
			padding: 1rem;
			border-radius: 0.375rem;
			&:modal {
				overscroll-behavior: contain;
			}
			&::backdrop {
				backdrop-filter: blur(8px) brightness(0.5);
			}
		}
	}
</style>
