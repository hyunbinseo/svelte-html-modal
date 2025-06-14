# Svelte HTML Modal

Create modal using the [`<dialog>`] element. [Demo]

[`<dialog>`]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement
[demo]: https://svelte.dev/repl/7ffaea50f0c0466ea2b4be8e0aee20dd?version=5.2.7

## Features

Requires Svelte v5 and runes mode.

- **State Management**: Open and close modals with a single `$state(boolean)`
- **Smooth Animations**: CSS transitions with `prefers-reduced-motion` support
- **Automatic Scroll Lock**: Prevents `<body>` scrolling while the modal is open
- **Backdrop Control**: Close the modal by clicking anywhere outside of it
- **Accessibility**: Native `<dialog>` element with focus trap and <kbd>Esc</kbd> support
- **Event Handling**: `oncancel` and `onclose` event handlers are supported
- **[Browser Support]**: Works in 96.66% of browsers as of November, 2024

[Browser Support]: https://caniuse.com/dialog

## Quick Start

To upgrade from previous versions, see the [migration guide](/docs/migration.md).

```shell
pnpm add svelte-html-modal -D
npm i svelte-html-modal -D
```

```svelte
<script>
  import { Modal } from 'svelte-html-modal';

  // Client-side JavaScript is required to display the modal.
  // Even if the initial state is set to true, the modal will be displayed after hydration.
  // Reference https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal
  let isOpen = $state(false);

  const open = () => (isOpen = true);
  const close = () => (isOpen = false);
</script>

<button type="button" onclick={open}>Open Modal</button>

<!-- The wrapper <div> is used for styling. -->
<!-- Reference the <style> element below. -->
<div class="modal-wrapper">
  <Modal bind:isOpen closeOnBackdropClick={true}>
    <strong>Close the Modal</strong>
    <ul>
      <li>Click on the backdrop</li>
      <li>Press the <kbd>Esc</kbd> key</li>
      <li><button type="button" onclick={close}>JavaScript Button</button></li>
      <li>
        <!-- Reference https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method -->
        <form method="dialog">
          <button>Submit Button</button>
        </form>
      </li>
    </ul>
  </Modal>
</div>

<!-- Option 1: Vanilla CSS -->
<style>
  /* Style <dialog> within the .modal-wrapper element. */
  /* Reference https://svelte.dev/docs/svelte/scoped-styles */
  .modal-wrapper > :global(dialog) {
    width: 20rem;
    padding: 1rem;
    border-radius: 0.375rem;
    /* Override user-agent dialog:modal max-sizes. */
    max-height: 100%; /* calc((100% - 6px) - 2em); */
    max-width: 100%; /* calc((100% - 6px) - 2em); */
  }
  .modal-wrapper > :global(dialog::backdrop) {
    backdrop-filter: blur(8px) brightness(0.5);
  }
</style>
```

```html
<!-- Option 2: Tailwind CSS v4 -->
<style>
  /* https://tailwindcss.com/docs/functions-and-directives#reference-directive */
  @reference "../../app.css";

  .modal-wrapper > :global(dialog) {
    /* https://github.com/tailwindlabs/tailwindcss/issues/16372 */
    /* Reference https://github.com/tailwindlabs/tailwindcss/discussions/15205 */
    @apply m-auto w-80 rounded-md p-4 backdrop:backdrop-blur backdrop:backdrop-brightness-50;
  }
</style>
```

<!-- TODO Use attachment instead. -->
<!-- Reference https://svelte.dev/docs/svelte/@attach -->

For SvelteKit `use:enhance` usage, see [this documentation](/docs/form.md).

```svelte
<Modal bind:isOpen>
  <form use:enhance method="post">
    <!-- Fields -->
  </form>
</Modal>
```

## Component Props

```svelte
<Modal
  bind:isOpen
  closeOnBackdropClick={false}
  closeOnEscapeKey={true}
  enableTransitions={true}
  oncancel={(e) => {}}
  onclose={(e) => {}}
>
  <!-- Children -->
</Modal>
```

> [!IMPORTANT]  
> The `closeOnEscapeKey` prop has a known issue in Chrome 126 and above. The modal can be closed by pressing the `Esc` key twice. This will be resolved in a future update when the `closedby` attribute is implemented. [Learn more](https://github.com/hyunbinseo/svelte-html-modal/issues/6)
