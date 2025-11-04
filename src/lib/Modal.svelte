<script lang="ts">
	import { BROWSER } from 'esm-env';
	import type { Snippet } from 'svelte';
	import type { HTMLDialogAttributes } from 'svelte/elements';
	import { showModalScript } from './show.ts';

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

		&:modal::backdrop {
			/* Fix <body> scrolling on iOS, iPadOS Safari 16.6. */
			/* Does not work if the modal has no vertical scroll. */
			touch-action: none;
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		dialog.transition,
		dialog.transition::backdrop {
			transition-duration: 0.5s;
			transition-property: opacity, translate;
			@supports (transition-behavior: allow-discrete) and (overlay: auto) {
				transition-behavior: allow-discrete;
				transition-property: opacity, translate, display, overlay;
			}
		}

		dialog.transition {
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

			&::backdrop {
				opacity: 0;
			}
			&:modal::backdrop {
				opacity: 1;
				@starting-style {
					opacity: 0;
				}
			}
		}
	}
</style>
