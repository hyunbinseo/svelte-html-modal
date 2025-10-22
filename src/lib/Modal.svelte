<script lang="ts">
	import { BROWSER } from 'esm-env';
	import type { Snippet } from 'svelte';
	import type { HTMLDialogAttributes } from 'svelte/elements';
	import { showModalScript } from './show.js';

	type Props = {
		isOpen: boolean;
		closeOnBackdropClick?: boolean;
		closeOnEscapeKey?: boolean;
		enableTransitions?: boolean;
		children?: Snippet;
		onclosed?: (event: { currentTarget: HTMLDialogElement }) => void;
	} & Partial<Pick<HTMLDialogAttributes, 'id' | 'oncancel' | 'onclose'>>;

	let {
		isOpen = $bindable<boolean>(),
		closeOnBackdropClick = false,
		closeOnEscapeKey = true,
		enableTransitions = true,
		children,
		id,
		oncancel,
		onclose,
		onclosed,
	}: Props = $props();

	let dialog: HTMLDialogElement;

	$effect(() => {
		if (isOpen && !dialog.open) {
			document.body.style.overflow = 'hidden';
			dialog.showModal();
		}

		// body style is handled in the close handler
		if (!isOpen && dialog.open) dialog.close();
	});

	const isCloseTransitionSupported =
		BROWSER &&
		CSS.supports('overlay', 'auto') &&
		CSS.supports('transition-behavior', 'allow-discrete');
</script>

<dialog
	{id}
	bind:this={dialog}
	class:transition={enableTransitions}
	closedby={!closeOnEscapeKey ? 'none' : null}
	oncancel={(e) => {
		if (!closeOnEscapeKey) e.preventDefault();
		oncancel?.(e);
	}}
	onclose={async (e) => {
		document.body.style.overflow = 'visible';
		isOpen = false;
		onclose?.(e);
		if (!isCloseTransitionSupported) onclosed?.({ currentTarget: e.currentTarget });
	}}
	ontransitionstart={isCloseTransitionSupported && onclosed
		? // Workaround for https://issues.chromium.org/issues/365565135
			(e) => {
				if (e.propertyName !== 'display' || e.currentTarget.open) return;
				let requestId: number;
				const handleOnclosed = () => {
					if (window.getComputedStyle(dialog).display !== 'none') {
						requestId = requestAnimationFrame(handleOnclosed);
						return;
					}
					onclosed({ currentTarget: e.currentTarget });
					cancelAnimationFrame(requestId);
				};
				requestId = requestAnimationFrame(handleOnclosed);
			}
		: null}
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
>
	{@render children?.()}
</dialog>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html !BROWSER && isOpen ? showModalScript : ''}

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
			transition-duration: 0.5s;
			transition-property: opacity, translate;
			transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
		}

		@supports (transition-behavior: allow-discrete) and (overlay: auto) {
			dialog.transition,
			dialog.transition::backdrop {
				transition-behavior: allow-discrete;
				transition-property: opacity, translate, display, overlay;
			}
		}
	}
</style>
