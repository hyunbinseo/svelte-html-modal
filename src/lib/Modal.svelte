<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLDialogAttributes } from 'svelte/elements';

	let {
		showModal = $bindable<boolean>(),
		closeWithBackdrop = false,
		preventCancel = false,
		showTransition = true,
		children,
		oncancel,
		onclose
	}: { showModal: boolean } & Partial<
		{
			closeWithBackdrop: boolean;
			preventCancel: boolean;
			showTransition: boolean;
			children: Snippet;
		} & Pick<HTMLDialogAttributes, 'oncancel' | 'onclose'>
	> = $props();

	let dialog: HTMLDialogElement | undefined;

	$effect(() => {
		if (!dialog) return;
		if (!showModal && dialog.open) {
			// body.overflow is handled in onclose.
			dialog.close();
		}
		if (showModal && !dialog.open) {
			document.body.style.overflow = 'hidden';
			dialog.showModal();
		}
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	oncancel={(e) => {
		if (preventCancel) e.preventDefault();
		oncancel?.(e);
	}}
	onclose={(e) => {
		document.body.style.overflow = 'visible';
		showModal = false;
		onclose?.(e);
	}}
	onclick={(e) => {
		if (closeWithBackdrop && e.currentTarget === e.target) dialog?.close();
	}}
	class:show-transition={showTransition}
>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div onclick={(e) => e.stopPropagation()}>
		{@render children?.()}
	</div>
</dialog>

<style>
	*,
	*::before,
	*::after {
		box-sizing: border-box;
	}
	dialog {
		/* Border-width and padding is set to 0 in the Tailwind CSS preflight. */
		/* Reference https://github.com/tailwindlabs/tailwindcss/blob/master/src/css/preflight.css */
		/* Reference https://github.com/tailwindlabs/tailwindcss/pull/11069#issuecomment-1527384738 */
		border-width: 0;
		padding: 0;
	}
	dialog[open]::backdrop {
		/* Fix <body> scrolling on iOS, iPadOS Safari 16.6. */
		/* Does not work if the modal has no vertical scroll. */
		touch-action: none;
	}
	dialog > div {
		display: contents;
	}
	@media (prefers-reduced-motion: no-preference) {
		dialog.show-transition {
			translate: 0 2rem;
		}
		dialog.show-transition,
		dialog.show-transition::backdrop {
			opacity: 0;
			/* Provide cross-browser support */
			transition: opacity, translate, display, overlay;
			transition:
				opacity,
				translate,
				display allow-discrete,
				overlay allow-discrete;
			transition-duration: 0.5s;
			transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
		}
	}
	@media (prefers-reduced-motion: no-preference) {
		dialog[open].show-transition {
			translate: 0 0;
		}
		dialog[open].show-transition,
		dialog[open].show-transition::backdrop {
			opacity: 1;
		}
	}
	/* svelte-check warns with `Unknown at rule @starting-style (css)` */
	/* Blocked by https://github.com/microsoft/vscode-css-languageservice/issues/403 */
	@starting-style {
		dialog[open].show-transition {
			translate: 0 2rem;
		}
		dialog[open].show-transition,
		dialog[open].show-transition::backdrop {
			opacity: 0;
		}
	}
</style>
