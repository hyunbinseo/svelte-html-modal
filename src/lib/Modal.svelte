<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';
	import { BROWSER } from 'esm-env';
	import type { Action } from 'svelte/action';
	import type { HTMLFormAttributes } from 'svelte/elements';

	// To customize the behavior, you can provide a SubmitFunction that runs immediately before the form is submitted.
	// Reference https://kit.svelte.dev/docs/form-actions#progressive-enhancement-customising-use-enhance
	type Enhance = Action<HTMLFormElement, SubmitFunction>;

	type Enhanced = Omit<HTMLFormAttributes, 'method'> & {
		method: 'post';
		enhance: Enhance;
		submitFunction?: SubmitFunction;
	};

	type NotEnhanced = HTMLFormAttributes & {
		enhance?: never;
		submitFunction?: never;
	};

	export let showModal: boolean;
	export let formAttributes: Enhanced | NotEnhanced = { method: 'dialog' };

	// Configurations
	export let closeWithBackdropClick = false;
	export let preventCancel = false;
	export let fullHeight = false;
	export let fullWidth = false;

	let dialog: HTMLDialogElement;

	$: if (BROWSER && dialog) {
		if (showModal) {
			document.body.style.overflow = 'hidden';
			dialog.showModal();
		}
		if (!showModal && dialog.open) dialog.close();
	}

	const handleDialogCancel = (e: Event & { currentTarget: HTMLDialogElement }) => {
		if (preventCancel) e.preventDefault();
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const handleDialogClose = (e: { currentTarget: HTMLDialogElement }) => {
		document.body.style.overflow = 'visible';
		showModal = false;
	};

	const optionalEnhance = formAttributes.enhance || (() => undefined);

	// export function enhance(form_element, submit = () => {}) { /* function body */ }
	// Reference https://github.com/sveltejs/kit/blob/main/packages/kit/src/runtime/app/forms.js
	const submitFunction = formAttributes.submitFunction || (() => undefined);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:cancel
	on:cancel={handleDialogCancel}
	on:click|self={closeWithBackdropClick ? () => dialog.close() : null}
	on:close
	on:close={handleDialogClose}
	on:submit
	style:max-height={fullHeight ? '100%' : null}
	style:max-width={fullWidth ? '100%' : null}
>
	<form
		{...{ ...formAttributes, enhance: null }}
		use:optionalEnhance={submitFunction}
		on:click|stopPropagation
	>
		<slot />
	</form>
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
	dialog[open] {
		/* Animation breaks in iOS 16.3.1 but works in (16.4.1 and 15.8). */
		/* Reference https://github.com/sveltejs/svelte/pull/8200 */
		animation: fly 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		/* Reference https://easings.net/en#easeOutBack */
	}
	@media (prefers-reduced-motion) {
		dialog[open] {
			animation: none;
		}
	}
	dialog[open]::backdrop {
		/* Fix <body> scrolling on iOS, iPadOS Safari 16.6. */
		/* Does not work if the modal has no vertical scroll. */
		touch-action: none;
	}
</style>
