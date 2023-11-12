<script lang="ts">
	import { BROWSER } from 'esm-env';

	export let showModal: boolean;

	// Configurations
	export let closeWithBackdropClick = false;
	export let fullHeight = false;
	export let fullWidth = false;

	let dialog: HTMLDialogElement;

	$: if (BROWSER && showModal) {
		document.body.style.overflowY = 'hidden';
		dialog.showModal();
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const handleDialogBackdrop = (e: { currentTarget: HTMLDialogElement }) => {
		if (closeWithBackdropClick) dialog.close();
	};

	const handleDialogClose = () => {
		document.body.style.overflowY = 'visible';
		showModal = false;
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	style:max-height={fullHeight ? '100%' : null}
	style:max-width={fullWidth ? '100%' : null}
	on:click|self={handleDialogBackdrop}
	on:close={handleDialogClose}
	on:close
	on:cancel
	on:submit
>
	<form method="dialog" on:click|stopPropagation>
		<slot />
	</form>
</dialog>

<style>
	dialog {
		/* Reference https://github.com/tailwindlabs/tailwindcss/pull/11069#issuecomment-1527384738 */
		background-color: transparent;
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
