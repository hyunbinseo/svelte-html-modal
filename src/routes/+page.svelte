<script>
	import Modal from '$lib/Modal.svelte';
	// NOTE import { Modal } from 'svelte-html-modal'; in README
	// NOTE import { Modal } from 'svelte-html-modal@3'; in REPL

	// Client-side JavaScript is required to display the modal.
	// Even if the initial state is set to true, the modal will be displayed after hydration.
	// Reference https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal
	let isShown = $state(false);

	const show = () => (isShown = true);
	const close = () => (isShown = false);

	// NOTE Remove options in README
	let closeWithBackdrop = $state(false);
	let preventCancel = $state(false);
	let showTransition = $state(true);
</script>

<button type="button" onclick={show}>Show Modal</button>
<span>/</span>
<a href="https://github.com/hyunbinseo/svelte-html-modal#readme">GitHub</a>

<fieldset style:width="fit-content" style:margin-top="1rem">
	<legend>Options</legend>
	<label>
		<input type="checkbox" bind:checked={closeWithBackdrop} />
		<span>Close with Backdrop</span>
	</label>
	<br />
	<label>
		<input type="checkbox" bind:checked={preventCancel} />
		<span>Prevent Cancel (Esc)</span>
	</label>
	<br />
	<label>
		<input type="checkbox" bind:checked={showTransition} />
		<span>Show Transition</span>
	</label>
</fieldset>

<!-- The wrapper <div> is used for styling. -->
<!-- Reference the <style> element below. -->
<div class="modal-wrapper">
	<Modal
		bind:isShown
		{closeWithBackdrop}
		{preventCancel}
		{showTransition}
		oncancel={() => {}}
		onclose={(e) => {
			if (!e.currentTarget.returnValue) return;
			window.alert(`Closed with a submit button of value '${e.currentTarget.returnValue}'`);
		}}
	>
		<section>
			<p>Close the modal with JavaScript</p>
			<ul>
				{#if closeWithBackdrop}
					<li>Click on the backdrop</li>
				{/if}
				<li><button type="button" onclick={close}>JavaScript Button</button></li>
			</ul>
		</section>
		<hr />
		<section>
			<p>Close the modal without JavaScript</p>
			<!-- Reference https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method -->
			<form method="dialog">
				<ul>
					<li>Press the <kbd>Esc</kbd> key</li>
					<!-- The button used to close the modal can be identified in the close event's return value. -->
					<!-- Reference https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/returnValue -->
					<li><button value="Hello">Submit Button (1)</button></li>
					<li><button value="World">Submit Button (2)</button></li>
				</ul>
			</form>
		</section>
	</Modal>
</div>

<style>
	/* Only the <dialog> inside this page's .modal-wrapper is styled. */
	/* Reference https://svelte.dev/docs/svelte-components#style */
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
