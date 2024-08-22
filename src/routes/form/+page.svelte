<script lang="ts">
	import { enhance } from '$app/forms';
	import { createFormState, createSubmitFunction, Modal } from '$lib/index.svelte';

	let { form } = $props();
	const userForm = createFormState();
</script>

<button type="button" onclick={userForm.show}>Show Modal</button>

<div class="modal-wrapper">
	<Modal
		bind:showModal={userForm.isShown}
		preventCancel={userForm.isSubmitting}
		closeWithBackdrop={!userForm.isSubmitting}
	>
		<form method="post" use:enhance={createSubmitFunction({ formState: userForm })}>
			<!-- Resets the form properly by recreating the input fields. -->
			<!-- Reference https://github.com/sveltejs/svelte/issues/8220 -->
			{#if !userForm.isSubmitted}
				<input type="text" name="message" size="10" value="Hello, World!" required />
				<button disabled={userForm.isSubmitting}>
					{!userForm.isSubmitting ? 'Submit' : 'Submitting'}
				</button>
			{:else if form?.now}
				<p>Submitted at {form.now.toISOString()}</p>
			{/if}
			<button type="button" disabled={userForm.isSubmitting} onclick={userForm.close}>
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
