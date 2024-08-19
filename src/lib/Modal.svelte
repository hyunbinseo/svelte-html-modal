<script lang="ts">
	type EventHandler = (e: Event & { currentTarget: EventTarget & HTMLDialogElement }) => unknown;

	let {
		showModal = $bindable<boolean>() as boolean,
		closeWithBackdropClick = false,
		preventCancel = false,
		showFlyInAnimation = false,
		oncancel = (() => {}) as EventHandler,
		onclose = (() => {}) as EventHandler,
		// FIXME Properly type children and make it optional.
		// Workaround to allow empty slot rendering in tests.
		children = undefined as unknown
	} = $props();

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
		oncancel(e);
	}}
	onclose={(e) => {
		document.body.style.overflow = 'visible';
		showModal = false;
		onclose(e);
	}}
	onclick={(e) => {
		if (closeWithBackdropClick && e.currentTarget === e.target) dialog?.close();
	}}
	class:fly={showFlyInAnimation}
>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div onclick={(e) => e.stopPropagation()}>
		<!-- FIXME 'children' is of type 'unknown' -->
		<!-- Reference https://github.com/sveltejs/language-tools/issues/2466 -->
		{@render children()}
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
	dialog[open]::backdrop {
		/* Fix <body> scrolling on iOS, iPadOS Safari 16.6. */
		/* Does not work if the modal has no vertical scroll. */
		touch-action: none;
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
</style>
