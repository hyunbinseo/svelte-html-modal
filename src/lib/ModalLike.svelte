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
	let ignoredElements: Element[] = [];

	const handleFocus = (mode: 'lock' | 'unlock') => {
		if (!trapFocus) return;
		if (mode === 'unlock') {
			for (const element of ignoredElements) element.removeAttribute('inert');
			return;
		}
		const wrapper = container.parentElement;
		for (const element of wrapper?.parentElement?.children || []) {
			if (element === wrapper) continue;
			element.setAttribute('inert', '');
			ignoredElements.push(element);
		}
	};

	onMount(() => {
		handleFocus('lock');
		return () => handleFocus('unlock');
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
<div
	class="backdrop"
	bind:this={container}
	on:click={closeWithBackdropClick ? () => (showModal = false) : null}
>
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
	.backdrop {
		background: rgba(0, 0, 0, 0.1);
		/* The inset CSS property came after the <dialog> element. */
		/* Reference https://caniuse.com/mdn-css_properties_inset */
		/* Reference https://caniuse.com/dialog */
		position: fixed;
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
