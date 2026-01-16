<script lang="ts">
	import { BROWSER } from 'esm-env';
	import type { Snippet } from 'svelte';
	import type { HTMLDialogAttributes } from 'svelte/elements';
	import { showModalScript } from './show.ts';

	type Props = {
		isOpen: boolean;
		closeOnBackdropClick?: boolean;
		closeOnEscapeKey?: boolean;
		class?: string;
		children?: Snippet;
	} & Partial<Pick<HTMLDialogAttributes, 'id' | 'oncancel' | 'onclose'>>;

	let {
		isOpen = $bindable<boolean>(),
		closeOnBackdropClick = false,
		closeOnEscapeKey = true,
		class: className,
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
	class={className}
>
	{@render children?.()}
</dialog>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html !BROWSER && isOpen ? showModalScript : ''}
