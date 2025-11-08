<script lang="ts">
	import { BROWSER } from 'esm-env';
	import type { Snippet } from 'svelte';
	import type { HTMLDialogAttributes } from 'svelte/elements';
	import { showModalScript } from './show.ts';

	type Props = {
		isOpen: boolean;
		closeOnBackdropClick?: boolean;
		closeOnEscapeKey?: boolean;
		children?: Snippet;
	} & Partial<Pick<HTMLDialogAttributes, 'id' | 'oncancel' | 'onclose'>>;

	let {
		isOpen = $bindable<boolean>(),
		closeOnBackdropClick = false,
		closeOnEscapeKey = true,
		children,
		id,
		oncancel,
		onclose,
	}: Props = $props();

	let dialog: HTMLDialogElement;

	$effect(() => {
		if (isOpen && !dialog.open) {
			document.body.style.overflow = 'hidden';
			dialog.showModal();
		}
	});

	$effect(() => {
		// body style is handled in the close handler
		if (!isOpen && dialog.open) dialog.close();
	});
</script>

<dialog
	{id}
	bind:this={dialog}
	closedby={!closeOnEscapeKey ? 'none' : null}
	oncancel={(e) => {
		if (!closeOnEscapeKey) e.preventDefault();
		oncancel?.(e);
	}}
	onclose={async (e) => {
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
</style>
