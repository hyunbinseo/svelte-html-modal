<script lang="ts">
	import { enhance } from '$app/forms';
	import { createModalFormState, Modal } from '$lib/index.svelte';
	import { tick } from 'svelte';

	let { form } = $props();
	const modalForm = createModalFormState();
</script>

<button type="button" onclick={modalForm.show}>Show Modal</button>

<div class="modal-wrapper">
	<Modal
		bind:showModal={modalForm.isShown}
		preventCancel={modalForm.isSubmitting}
		closeWithBackdrop={!modalForm.isSubmitting}
	>
		<form
			method="post"
			use:enhance={async () => {
				modalForm.set.submitting();
				// Show the submitting state for a minimum of 1000ms.
				const timer = new Promise((resolve) => setTimeout(resolve, 1000));
				return async ({ update }) => {
					await timer;
					await update();
					await tick(); // Update the exported form object.
					modalForm.set.submitted();
				};
			}}
		>
			<!-- Resets the form properly by recreating the input fields. -->
			<!-- Reference https://github.com/sveltejs/svelte/issues/8220 -->
			{#if !modalForm.hasSubmitted}
				<input type="text" name="message" size="10" value="Hello, World!" required />
				<button disabled={modalForm.isSubmitting}>
					{!modalForm.isSubmitting ? 'Submit' : 'Submitting'}
				</button>
			{:else if form?.now}
				<p>Submitted at {form.now.toISOString()}</p>
			{/if}
			<button type="button" disabled={modalForm.isSubmitting} onclick={modalForm.close}>
				Close
			</button>
		</form>
	</Modal>
</div>

<style>
	.modal-wrapper > :global(dialog) {
		width: 20rem;
		border-radius: 0.375rem;
		padding: 1rem;
	}
	.modal-wrapper > :global(dialog::backdrop) {
		backdrop-filter: blur(8px) brightness(0.5);
	}
</style>
