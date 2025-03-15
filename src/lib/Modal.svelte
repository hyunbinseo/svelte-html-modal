<script lang="ts">
	import { browser } from '$app/environment';
	import type { Snippet } from 'svelte';
	import type { HTMLDialogAttributes } from 'svelte/elements';
	import { getTransitionDuration } from './utilities.js';

	type Props = {
		isOpen: boolean;
		closeOnBackdropClick?: boolean;
		closeOnEscapeKey?: boolean;
		enableTransitions?: boolean;
		children?: Snippet;
		onclosed?: (event: { currentTarget: HTMLDialogElement }) => void;
	} & Partial<Pick<HTMLDialogAttributes, 'oncancel' | 'onclose'>>;

	let {
		isOpen = $bindable<boolean>(),
		closeOnBackdropClick = false,
		closeOnEscapeKey = true,
		enableTransitions = true,
		children,
		oncancel,
		onclose,
		onclosed: _onclosed
	}: Props = $props();

	let dialog: HTMLDialogElement;

	$effect(() => {
		if (isOpen) isOnclosedInvoked = false;
		if (isOpen && !dialog.open) {
			document.body.style.overflow = 'hidden';
			dialog.showModal();
		}
		// Reference the dialog close event handler.
		if (!isOpen && dialog.open) dialog.close();
	});

	const isCloseTransitionSupported = $derived(
		browser &&
			CSS.supports('overlay', 'auto') &&
			CSS.supports('transition-behavior', 'allow-discrete')
	);

	let isOnclosedInvoked = false;

	const onclosed = () => {
		if (!_onclosed || isOnclosedInvoked) return;
		_onclosed({ currentTarget: dialog });
		isOnclosedInvoked = true;
	};
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	oncancel={(e) => {
		if (!closeOnEscapeKey) e.preventDefault();
		oncancel?.(e);
	}}
	onclose={async (e) => {
		document.body.style.overflow = 'visible';
		isOpen = false;

		const duration =
			!enableTransitions || !isCloseTransitionSupported
				? 0
				: Math.max(
						getTransitionDuration(dialog), //
						getTransitionDuration(dialog, '::backdrop')
					);

		const delay = duration
			? new Promise((resolve) => setTimeout(resolve, duration))
			: Promise.resolve();

		delay.then(onclosed);
		onclose?.(e);
	}}
	ontransitionend={(e) => {
		if (getComputedStyle(e.currentTarget).display === 'none') onclosed();
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
