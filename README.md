# Svelte HTML Modal

A simple wrapper component for the HTML [`<dialog>` element] - [demo]

[`<dialog>` element]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement
[demo]: https://svelte.dev/repl/7ffaea50f0c0466ea2b4be8e0aee20dd?version=4.2.3

- [Wide Support](https://caniuse.com/dialog) - 96.08% as of April, 2024
- Accessibility - focus trap, <kbd>Esc</kbd> to cancel

## Features

- Control the modal state with a single boolean
- Close the modal by clicking on the backdrop
- Disable the `<body>` scrolling when opened[^overflow]
- Forwarded DOM events (cancel, close, submit)
- CSS animation when opening the modal
- An alternative [SSR ready component](/docs/ssr.md)
- Guide for SvelteKit [`use:enhance` usage](/docs/form.md)

[^overflow]: Sets `overflow: hidden` in the `<body>` element, similar to the [Bootstrap modal].

[Bootstrap modal]: https://getbootstrap.com/docs/5.3/components/modal/#how-it-works

## Usage

```
pnpm add svelte-html-modal -D
npm i svelte-html-modal -D
```

```svelte
<script>
  import { Modal } from 'svelte-html-modal';

  // JavaScript is required for the <dialog> element to be shown as a modal.
  // Even if this value is true, the modal cannot be opened until JS is loaded.

  // To open the modal in a server-rendered markup, use the <ModalLike> component.
  // Reference https://github.com/hyunbinseo/svelte-html-modal/blob/main/docs/ssr.md

  let showModal = false;
</script>

<button type="button" on:click={() => (showModal = true)}>Show Modal</button>

<!-- Outer wrapper <div> is used for styling. -->
<!-- Reference the <style> element below. -->
<div class="modal-wrapper">
  <Modal
    bind:showModal
    closeWithBackdrop={true}
    on:close={(e) => {
      if (!(e.currentTarget instanceof HTMLDialogElement)) return;

      // Empty string if closed with JavaScript. (e.g. on:click)
      // Value of the submit button if closed with a form submit.
      e.currentTarget.returnValue; // '' | 'a' | 'b'
    }}
  >
    <!-- Closes the modal with JavaScript. -->
    <button type="button" on:click={() => (showModal = false)}>Close with JavaScript</button>

    <!-- Close the modal without JavaScript. -->
    <!-- Reference https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method -->
    <form method="dialog">
      <!-- The button used to close the modal can be identified in the close event's return value. -->
      <!-- Reference https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/returnValue -->
      <button value="a" formnovalidate>Close without JavaScript (A)</button>
      <button value="b">Close without JavaScript (B)</button>
    </form>
  </Modal>
</div>

<style>
  /* Only the <dialog> inside this page's .modal-wrapper is styled. */
  /* Reference https://svelte.dev/docs/svelte-components#style */
  .modal-wrapper > :global(dialog) {
    width: 20rem;
    border-radius: 0.375rem;
    /* Dialog padding has been reset to 0. Browser default style is 1em. */
    /* Reference https://github.com/tailwindlabs/tailwindcss/pull/11069 */
    /* Reference https://browserdefaultstyles.com/#dialog */
    padding: 1rem;
    /* (Optional) User-agent stylesheets restrict the dialog size. */
    max-height: 100%; /* max-height: calc((100% - 6px) - 2em); */
    max-width: 100%; /* max-width: calc((100% - 6px) - 2em); */
  }
  .modal-wrapper > :global(dialog::backdrop) {
    backdrop-filter: blur(8px) brightness(0.5);
  }
  /* (Optional) Make <Modal> a flex container. */
  .modal-wrapper > :global(dialog[open]) {
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
  }
</style>
```

For Tailwind CSS users, above style can be rewritten using the [`@apply` directive].

[`@apply` directive]: https://tailwindcss.com/docs/reusing-styles#extracting-classes-with-apply

```svelte
<style lang="postcss">
  .modal-wrapper > :global(dialog) {
    @apply w-80 rounded-md p-4 backdrop:backdrop-blur backdrop:backdrop-brightness-50;
  }
  .modal-wrapper > :global(dialog[open]) {
    @apply flex flex-col gap-y-4;
  }
</style>
```

## Configurations

```ts
export let closeWithBackdrop = false;
export let preventCancel = false;
export let showTransition = true;
```
