<script lang="ts">
	import { BROWSER } from 'esm-env';

	export let showModal: boolean;

	export let closeWithBackdropClick = false;
	export let preventCancel = false;

	export let fullHeight = false;
	export let fullWidth = false;
	export let showFlyInAnimation = true;

	let dialog: HTMLDialogElement;

	$: if (BROWSER && dialog) {
		if (showModal) {
			document.body.style.overflow = 'hidden';
			dialog.showModal();
		}
		if (!showModal && dialog.open) dialog.close();
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:cancel
	on:cancel={preventCancel ? (e) => e.preventDefault() : null}
	on:close
	on:close={() => {
		document.body.style.overflow = 'visible';
		showModal = false;
	}}
	on:click|self={closeWithBackdropClick ? () => dialog.close() : null}
	class:fly={showFlyInAnimation}
	style:max-height={fullHeight ? '100%' : null}
	style:max-width={fullWidth ? '100%' : null}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation>
		<slot />
	</div>
</dialog>

<style>
	dialog {
		/* Border-width and padding is set to 0 in the Tailwind CSS preflight. */
		/* Reference https://github.com/tailwindlabs/tailwindcss/blob/master/src/css/preflight.css */
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
	dialog.fly[open] {
		/* Animation breaks in iOS 16.3.1 but works in (16.4.1 and 15.8). */
		/* Reference https://github.com/sveltejs/svelte/pull/8200 */
		animation: fly 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		/* Reference https://easings.net/en#easeOutBack */
	}
	@media (prefers-reduced-motion) {
		dialog.fly[open] {
			animation: none;
		}
	}
	dialog[open]::backdrop {
		/* Fix <body> scrolling on iOS, iPadOS Safari 16.6. */
		/* Does not work if the modal has no vertical scroll. */
		touch-action: none;
	}
</style>
