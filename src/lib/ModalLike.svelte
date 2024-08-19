<script lang="ts">
	import type { Action } from 'svelte/action';

	// TODO Migrate to Svelte 5 runes API.

	export let closeWithBackdrop = false;
	export let preventCancel = false;
	export let trapFocus = true;

	let dialog: HTMLDialogElement | undefined;
	let inertElements: Element[] = [];

	const inertIsSupported = () => {
		const element = document.createElement('div');
		const isSupported = 'inert' in element;
		element.remove();
		return isSupported;
	};

	const handleModal: Action<HTMLDivElement> = (container) => {
		document.body.style.overflow = 'hidden';

		if (trapFocus && inertIsSupported()) {
			const wrapper = container.parentElement;
			const siblings = wrapper?.parentElement?.children || [];
			for (const sibling of siblings) {
				if (sibling === wrapper) continue;
				sibling.setAttribute('inert', '');
				inertElements.push(sibling);
			}
		}

		return {
			destroy: () => {
				document.body.style.overflow = 'visible';
				for (const element of inertElements) element.removeAttribute('inert');
			}
		};
	};

	// SvelteKit focuses the <body> element after each client-side routing navigation.
	// Reference https://kit.svelte.dev/docs/accessibility#focus-management

	// The <body> should not stay focused after navigating to a page with an open ModalLike component.
	// The page can be scrolled with keyboard inputs - even with the sibling elements' inert attribute.

	// Also, this is the default fallback behavior starting from Chrome 112.
	// Reference https://developer.chrome.com/blog/new-in-chrome-112#dialog

	const focusOnMount: Action<HTMLDialogElement> = (dialog) => {
		if (document.activeElement === document.body) dialog.focus();
	};
</script>

<svelte:window
	on:keydown={!preventCancel
		? (e) => {
				if (e.key === 'Escape') dialog?.close();
			}
		: null}
/>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div use:handleModal class="backdrop" on:click={closeWithBackdrop ? () => dialog?.close() : null}>
	<dialog bind:this={dialog} use:focusOnMount open on:cancel on:close on:submit>
		<slot />
	</dialog>
</div>

<style>
	*,
	*::before,
	*::after {
		box-sizing: border-box;
	}
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
		/* dialog:modal user agent style */
		max-width: calc(100% - 6px - 2em);
		max-height: calc(100% - 6px - 2em);
		/* Normalize dialog styles. */
		border-width: 0;
		padding: 0;
	}
</style>
