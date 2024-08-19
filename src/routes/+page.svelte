<script>
	import Modal from '$lib/Modal.svelte'; // 'svelte-html-modal'

	// JavaScript is required for the <dialog> element to be shown as a modal.
	// Even if this value is true, the modal cannot be opened until JS is loaded.

	// To open the modal in a server-rendered markup, use the <ModalLike> component.
	// Reference https://github.com/hyunbinseo/svelte-html-modal/blob/main/docs/ssr.md

	let showModal = $state(false);
</script>

<button type="button" onclick={() => (showModal = true)}>Show Modal</button>
<a href="https://github.com/hyunbinseo/svelte-html-modal#readme">GitHub</a>

<!-- Outer wrapper <div> is used for styling. -->
<!-- Reference the <style> element below. -->
<div class="modal-wrapper">
	<Modal
		bind:showModal
		closeWithBackdrop={true}
		onclose={(e) => {
			if (!(e.currentTarget instanceof HTMLDialogElement)) return;

			// Empty string if closed with JavaScript. (e.g. onclick)
			// Value of the submit button if closed with a form submit.
			console.log(`Dialog return value: ${e.currentTarget.returnValue || '<empty string>'}`);
		}}
	>
		<p>Close the modal</p>

		<!-- Close the modal with JavaScript. -->
		<ul>
			<li>Click on the backdrop</li>
			<li>
				<button type="button" onclick={() => (showModal = false)}>Close with JavaScript</button>
			</li>
		</ul>

		<!-- Close the modal without JavaScript. -->
		<!-- Reference https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method -->
		<form method="dialog">
			<!-- The button used to close the modal can be identified in the close event's return value. -->
			<!-- Reference https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/returnValue -->
			<ul>
				<li>Press the <kbd>Esc</kbd> key</li>
				<li><button value="a" formnovalidate>Close without JavaScript (A)</button></li>
				<li><button value="b">Close without JavaScript (B)</button></li>
			</ul>
		</form>
	</Modal>
</div>

<style>
	/* Only the <dialog> inside this page's .modal-wrapper is styled. */
	/* Reference https://svelte.dev/docs/svelte-components#style */
	.modal-wrapper > :global(dialog) {
		width: 20rem;
		border-radius: 0.375rem;
		/* Dialog padding has been reset to 0. Browser default style is 1em. */
		/* Reference https://github.com/tailwindlabs/tailwindcss/pull/11069 */
		/* Reference https://browserdefaultstyles.com/#dialog */
		padding: 1rem;
	}
	.modal-wrapper > :global(dialog::backdrop) {
		backdrop-filter: blur(8px) brightness(0.5);
	}
</style>
