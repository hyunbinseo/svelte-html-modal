<script lang="ts">
	import Modal from '$lib/Modal.svelte';

	let isOpen = $state(false);

	const transitions = ['fly-up', 'slide-right'] as const;
	let transition = $state<(typeof transitions)[number]>(transitions[0]);
</script>

<button type="button" onclick={() => (isOpen = true)}>Open Modal</button>

<fieldset style:width="fit-content" style:margin-top="1rem" style:padding-right="4rem">
	<legend>Transition</legend>
	<!-- eslint-disable-next-line svelte/require-each-key -->
	{#each transitions as value}
		<label>
			<input type="radio" {value} bind:group={transition} />
			<span>{value}</span>
		</label>
		<br />
	{/each}
</fieldset>

<div class={['modal-wrapper', transition]}>
	<Modal bind:isOpen closeOnBackdropClick={true}>
		Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nobis eius fugiat, perspiciatis
		aliquam, eum sit sequi sunt suscipit, ratione similique rerum debitis? Harum id tenetur, animi
		illo ipsam accusantium aliquid?
		<button
			type="button"
			onclick={() => (isOpen = false)}
			style:display="block"
			style:margin-top="1rem"
		>
			Close
		</button>
	</Modal>
</div>

<style lang="postcss">
	.modal-wrapper :global > dialog {
		padding: 1rem;
		&::backdrop {
			backdrop-filter: blur(8px) brightness(0.5);
		}

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
		width: 25rem;
		border-radius: 0.375rem;

		/* iPhone 16 Pro Max */
		@media (width <= 27.5rem) {
			/* bottom sheet */
			margin-bottom: 0;
			width: 100%;
			max-width: 100%;
			min-height: 80svh;
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
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

	.modal-wrapper.slide-right :global > dialog {
		margin: 0;
		margin-left: auto;
		width: 25rem;
		height: 100%;
		max-height: none;

		/* dialog transition */
		transition-duration: 0.3s;
		opacity: 0;
		translate: 100% 0;
		&:modal {
			opacity: 1;
			translate: 0;
			@starting-style {
				opacity: 0;
				translate: 100% 0;
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
