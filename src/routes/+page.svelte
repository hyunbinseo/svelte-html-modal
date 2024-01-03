<script>
	import Modal from '$lib/Modal.svelte';
	import ModalLike from '$lib/ModalLike.svelte';

	// If this value is true, the modal is opened immediately after the JavaScript is loaded.
	// For the modal to be opened in the server-rendered markup, use the ModalLike component.
	let showModal = false;

	// If the modal does not have to be shown on mount,
	// why not use the full-fledged Modal component instead?
	// Reference https://github.com/hyunbinseo/svelte-html-modal#readme
	let showModalLike = true;
</script>

<fieldset>
	<legend>Show</legend>
	<button type="button" on:click={() => (showModal = true)}>Modal</button>
	<button type="button" on:click={() => (showModalLike = true)}>ModalLike</button>
</fieldset>

<!-- Outer wrapper <div> is used for styling. -->
<!-- Reference the <style> element below. -->
<div class="modal-wrapper">
	<!-- Provide at least one closing method for the pointer users. -->
	<!-- Method 1: Set the close-with-backdrop-click prop. -->
	<!-- Method 2: Pass a <button> element to the slot. -->
	<Modal
		bind:showModal
		closeWithBackdropClick={true}
		on:close={(e) => {
			if (e.currentTarget instanceof HTMLDialogElement) {
				// The value of the button that was pressed to close the dialog.
				// Reference https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/returnValue
				e.currentTarget.returnValue; // bye
			}
		}}
	>
		<!-- Flex items. Reference the `:global(dialog > form)` style below. -->
		<h1>Hello, Modal!</h1>
		<!-- This button closes the modal without any JavaScript on:click handlers. -->
		<!-- To identify the button that closed the modal, use the value attribute. -->
		<button value="bye">Close</button>
	</Modal>
</div>

<!-- Outer wrapper <div> is required for the focus-trap to work. -->
<!-- It is also used for styling. Reference the <style> element below. -->
{#if showModalLike}
	<div class="modal-wrapper">
		<ModalLike bind:showModal={showModalLike}>
			<!-- Example with a nested <form> element. -->
			<!-- Elements other than <form> can be used. -->
			<form method="dialog">
				<h1>Hello, Modal!</h1>
				<!-- Closes the modal without any JavaScript. -->
				<button>Close</button>
			</form>
		</ModalLike>
	</div>
{/if}

<style>
	/* Only the <dialog> inside this page's .modal-wrapper is styled. */
	/* Reference https://svelte.dev/docs/svelte-components#style */
	.modal-wrapper :global(dialog) {
		width: 20rem;
		border-radius: 0.375rem;
		/* Dialog padding has been reset to 0. Browser default style is 1em. */
		/* Reference https://github.com/tailwindlabs/tailwindcss/pull/11069 */
		/* Reference https://browserdefaultstyles.com/#dialog */
		padding: 1rem;
	}
	.modal-wrapper :global(dialog::backdrop) {
		backdrop-filter: blur(8px) brightness(0.5);
	}

	/* dialog::backdrop only exists when opened with a `showModalLike()` method. */
	.modal-wrapper :global(.backdrop) {
		backdrop-filter: blur(8px) brightness(0.5);
	}

	.modal-wrapper :global(dialog > form) {
		/* <slot> styles */
		display: flex;
		flex-direction: column;
	}
</style>
