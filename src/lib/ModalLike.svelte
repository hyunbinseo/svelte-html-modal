<script lang="ts">
	import { onMount } from 'svelte';

	export let showModal: boolean;

	// Configurations
	export let closeWithBackdropClick = false;
	export let preventCancel = false;
	export let fullHeight = false;
	export let fullWidth = false;
	export let trapFocus = true;

	let container: HTMLDivElement;
	const getNeighboringElements = () => container.parentNode?.children || [];

	onMount(() => {
		if (trapFocus) {
			for (const element of getNeighboringElements()) {
				if (element !== container) element.setAttribute('inert', '');
			}
		}
		return () => {
			if (trapFocus) {
				for (const element of getNeighboringElements()) {
					element.removeAttribute('inert');
				}
			}
		};
	});
</script>

<svelte:window
	on:keydown={!preventCancel
		? (e) => {
				if (e.key === 'Escape') showModal = false;
			}
		: null}
/>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div bind:this={container} on:click={closeWithBackdropClick ? () => (showModal = false) : null}>
	<!-- Dialog can be closed using a method="dialog" form element. -->
	<!-- When this occurs, this component should be unmounted. -->
	<dialog
		open
		on:close={() => (showModal = false)}
		style:max-height={fullHeight ? '100%' : null}
		style:max-width={fullWidth ? '100%' : null}
	>
		<slot />
	</dialog>
</div>

<style>
	div {
		background: rgba(0, 0, 0, 0.1);
		display: block; /* Firefox, Safari */
		position: fixed;
		/* The inset CSS property came after the <dialog> element. */
		/* Reference https://caniuse.com/mdn-css_properties_inset */
		/* Reference https://caniuse.com/dialog */
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		user-select: none; /* Firefox */
		/* Position the dialog. */
		display: flex;
		justify-content: center;
		align-items: center;
	}
	dialog {
		overflow: auto;
		max-width: calc(100% - 6px - 2em);
		max-height: calc(100% - 6px - 2em);
		/* Normalize dialog styles. */
		border-width: 0;
		padding: 0;
	}
</style>
