<script>
	import Modal from '$lib/Modal.svelte';

	let isOpen = $state(false);
</script>

<button type="button" onclick={() => (isOpen = true)}>Open Modal</button>

<div class="modal-wrapper fly-up">
	<Modal bind:isOpen closeOnBackdropClick={true} closeOnEscapeKey={true}>
		Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nobis eius fugiat, perspiciatis
		aliquam, eum sit sequi sunt suscipit, ratione similique rerum debitis? Harum id tenetur, animi
		illo ipsam accusantium aliquid?
	</Modal>
</div>

<style lang="postcss">
	.modal-wrapper :global > dialog {
		@media (prefers-reduced-motion: no-preference) {
			&,
			&::backdrop {
				transition-property: opacity, translate;
				@supports (transition-behavior: allow-discrete) and (overlay: auto) {
					transition-behavior: allow-discrete;
					transition-property: opacity, translate, display, overlay;
				}
			}
		}
	}

	.modal-wrapper.fly-up :global > dialog {
		width: 20rem;
		padding: 1rem;
		&::backdrop {
			backdrop-filter: blur(8px) brightness(0.5);
		}

		/* dialog transition */
		transition-duration: 0.3s;
		opacity: 0;
		translate: 0 2rem;
		&:modal {
			opacity: 1;
			translate: 0;
			@starting-style {
				opacity: 0;
				translate: 0 2rem;
			}
		}

		/* backdrop transition */
		&::backdrop {
			transition-duration: 0.2s;
			opacity: 0;
		}
		&:modal::backdrop {
			opacity: 1;
			@starting-style {
				opacity: 0;
			}
		}
	}
</style>
