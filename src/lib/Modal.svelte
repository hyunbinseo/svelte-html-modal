<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLDialogAttributes } from 'svelte/elements';

	type Props = {
		isOpen: boolean;
		closeOnBackdropClick?: boolean;
		closeOnEscapeKey?: boolean;
		enableTransitions?: boolean;
		children?: Snippet;
	} & Partial<Pick<HTMLDialogAttributes, 'oncancel' | 'onclose'>>;

	let {
		isOpen = $bindable<boolean>(),
		closeOnBackdropClick = false,
		closeOnEscapeKey = true,
		enableTransitions = true,
		children,
		oncancel,
		onclose
	}: Props = $props();

	let dialog: HTMLDialogElement;

	$effect(() => {
		// Reference the dialog close event handler.
		if (!isOpen && dialog.open) dialog.close();
		if (isOpen && !dialog.open) {
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
		if (!closeOnEscapeKey) e.preventDefault();
		oncancel?.(e);
	}}
	onclose={(e) => {
		document.body.style.overflow = 'visible';
		isOpen = false;
		onclose?.(e);
	}}
	onclick={!closeOnBackdropClick
		? null
		: (e) => {
				if (e.currentTarget !== e.target) return;
				const rect = dialog.getBoundingClientRect();
				const isBackdropClick =
					e.clientX < rect.left ||
					e.clientX > rect.right ||
					e.clientY < rect.top ||
					e.clientY > rect.bottom;
				if (isBackdropClick) dialog.close();
			}}
	class:transition={enableTransitions}
>
	{@render children?.()}
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

	@media (prefers-reduced-motion: no-preference) {
		dialog[open].transition {
			translate: 0 0;
		}

		dialog[open].transition,
		dialog[open].transition::backdrop {
			opacity: 1;
		}
	}

	/* svelte-check warns with `Unknown at rule @starting-style (css)` */
	/* Blocked by https://github.com/microsoft/vscode-css-languageservice/issues/403 */

	/* Closing transition is not available in Firefox 132 due to partial support. */
	/* Reference https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style */

	@starting-style {
		dialog[open].transition {
			translate: 0 2rem;
		}

		dialog[open].transition,
		dialog[open].transition::backdrop {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		dialog.transition {
			translate: 0 2rem;
		}

		dialog.transition,
		dialog.transition::backdrop {
			opacity: 0;
			transition: opacity, translate, display, overlay; /* fallback */
			transition:
				opacity,
				translate,
				display allow-discrete,
				overlay allow-discrete;
			transition-duration: 0.5s;
			transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
		}
	}
</style>
