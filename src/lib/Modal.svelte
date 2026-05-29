<script lang="ts">
	import { BROWSER } from 'esm-env';
	import type { Snippet } from 'svelte';
	import type { HTMLDialogAttributes } from 'svelte/elements';
	import { showModalScript } from './show.ts';

	type Props = {
		dialog?: HTMLDialogElement | undefined;
		isOpen?: boolean;
		closeOnBackdropClick?: boolean | undefined;
		closeOnEscapeKey?: boolean | undefined;
		class?: HTMLDialogAttributes['class'] | undefined;
		children?: Snippet | undefined;
	} & Partial<Pick<HTMLDialogAttributes, 'id' | 'oncancel' | 'onclose'>>;

	let {
		dialog = $bindable(),
		isOpen = $bindable(false),
		closeOnBackdropClick = false,
		closeOnEscapeKey = true,
		class: className,
		children,
		id,
		oncancel,
		onclose,
	}: Props = $props();

	export const close = () => (isOpen = false);
	export const show = () => (isOpen = true);

	// NOTE `shown()` should not be exported (e.g. `{modal.shown()}`):
	// - `modal` is updated but not declared as `$state()` - warning
	// - `modal` is initially undefined - runtime error

	$effect(() => {
		if (!dialog) return;
		if (isOpen === dialog.open) return;
		if (isOpen) {
			dialog.showModal();
		} else {
			dialog.close();
		}
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
		isOpen = false;
		onclose?.(e);
	}}
	onclick={!closeOnBackdropClick
		? null
		: (e) => {
				if (!dialog) return;
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
