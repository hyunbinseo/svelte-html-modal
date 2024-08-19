<script lang="ts">
	import { enhance } from '$app/forms';
	import { createFormState, Modal } from '$lib/index.svelte';
	import { tick } from 'svelte';

	let { form } = $props();
	let showModal = $state(false);
	const formState = createFormState();
</script>

<button type="button" onclick={() => (showModal = true)}>Show Modal</button>

<div class="modal-wrapper">
	<Modal
		bind:showModal
		onclose={formState.reset}
		preventCancel={formState.isSubmitting}
		closeWithBackdrop={!formState.isSubmitting}
	>
		<form
			method="post"
			use:enhance={async () => {
				formState.setSubmitting();
				// Show the submitting state for a minimum of 1000ms.
				const timer = new Promise((resolve) => setTimeout(resolve, 1000));
				return async ({ update }) => {
					await timer;
					await update();
					await tick(); // Update the exported form object.
					formState.setSubmitted();
				};
			}}
		>
			<!-- Resets the form properly by recreating the input fields. -->
			<!-- Reference https://github.com/sveltejs/svelte/issues/8220 -->
			{#if !formState.hasSubmitted}
				<input type="text" name="message" size="10" value="Hello, World!" required />
				<button disabled={formState.isSubmitting}>
					{!formState.isSubmitting ? 'Submit' : 'Submitting'}
				</button>
			{:else if form?.now}
				<p>Submitted at {form.now.toISOString()}</p>
			{/if}
			<button type="button" disabled={formState.isSubmitting} onclick={() => (showModal = false)}>
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
