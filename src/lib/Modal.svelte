<script lang="ts">
	import type { enhance } from '$app/forms';
	import { BROWSER } from 'esm-env';
	import type { Action } from 'svelte/action';
	import type { HTMLFormAttributes } from 'svelte/elements';

	type NotEnhanced = HTMLFormAttributes & { enhance?: never };
	type Enhanced = Omit<HTMLFormAttributes, 'method'> & { method: 'post'; enhance: typeof enhance };

	export let showModal: boolean;
	export let formAttributes: NotEnhanced | Enhanced = { method: 'dialog' };

	// Configurations
	export let showModalOnMount = false;
	export let closeWithBackdropClick = false;
	export let transparentBackdrop = false;
	export let fullHeight = false;
	export let fullWidth = false;

	let dialog: HTMLDialogElement;

	const handleShowModal = (element?: HTMLDialogElement) => {
		document.body.style.overflow = 'hidden';
		(element || dialog).showModal();
	};

	$: if (BROWSER && showModal) handleShowModal();

	const handleDialogMount = ((dialog) => {
		if (showModalOnMount) handleShowModal(dialog);
	}) satisfies Action<HTMLDialogElement>;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const handleDialogClose = (e: { currentTarget: HTMLDialogElement }) => {
		document.body.style.overflow = 'visible';
		showModal = false;
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const handleDialogBackdrop = (e: { currentTarget: HTMLDialogElement }) => {
		if (closeWithBackdropClick) dialog.close();
	};

	const optionalEnhance = formAttributes.enhance || (() => undefined);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	use:handleDialogMount
	style:background-color={transparentBackdrop ? 'transparent' : null}
	style:max-height={fullHeight ? '100%' : null}
	style:max-width={fullWidth ? '100%' : null}
	on:click|self={handleDialogBackdrop}
	on:close={handleDialogClose}
	on:close
	on:cancel
	on:submit
>
	<form {...formAttributes} use:optionalEnhance on:click|stopPropagation>
		<slot />
	</form>
</dialog>

<style>
	dialog {
		/* Reference https://github.com/tailwindlabs/tailwindcss/pull/11069#issuecomment-1527384738 */
		border-width: 0;
		padding: 0;
	}
	@keyframes fly {
		from {
			transform: translateY(32px);
		}
		to {
			transform: translateY(0%);
		}
	}
	dialog[open] {
		/* Animation breaks in iOS 16.3.1 but works in (16.4.1 and 15.8). */
		/* Reference https://github.com/sveltejs/svelte/pull/8200 */
		animation: fly 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		/* Reference https://easings.net/en#easeOutBack */
	}
	@media (prefers-reduced-motion) {
		dialog[open] {
			animation: none;
		}
	}
	dialog[open]::backdrop {
		/* Fix <body> scrolling on iOS, iPadOS Safari 16.6. */
		/* Does not work if the modal has no vertical scroll. */
		touch-action: none;
	}
</style>
