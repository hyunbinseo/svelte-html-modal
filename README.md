# Svelte HTML Modal

A simple wrapper component for the HTML [`<dialog>` element] - [demo]

[`<dialog>` element]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement
[demo]: https://svelte.dev/repl/7ffaea50f0c0466ea2b4be8e0aee20dd?version=4.2.3

## Benefits

Don't reinvent the wheel.

- [Wide Support](https://caniuse.com/dialog) - 95.84% as of Nov. 2023
- Accessibility - focus trap, `Esc` to cancel
- CSS animation when opening the modal
- Plain HTML `<button>` closes the modal
- Disables `<body>` scrolling when opened[^overflow]
- DOM events - close, cancel, and submit

[^overflow]: Sets `overflow: hidden` in the `<body>` element. Similar to how [Bootstrap modal] works.

[Bootstrap modal]: https://getbootstrap.com/docs/5.3/components/modal/#how-it-works

## HTML

This background knowledge is required to understand the `<Modal>` component.

```
Structure            | Role      | Style
-------------------- | --------- | ----------------------------------
├── dialog::backdrop | backdrop  | background-color, backdrop-filter
└── <dialog>         | root      | background-color, border-radius
    └── <form>       | container | padding, flex, flex-direction
        └── <slot>   | content   |
```

Yes, the `<dialog>` element can be a dialog or a modal based on [how it is opened].

[how it is opened]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal

Reference the [advanced](#advanced) section for the reason why a `<form>` element is nested.

## Usage

Install the [package] and copy-and-paste the starter template.

```
pnpm add svelte-html-modal -D
npm i svelte-html-modal -D
```

[package]: https://www.npmjs.com/package/svelte-html-modal

```svelte
<script>
  import { Modal } from 'svelte-html-modal';

  let showModal = false;
</script>

<button type="button" on:click={() => (showModal = true)}>Show Modal</button>

<!-- Outer <div> is used for styling purposes. Reference the <style> element below. -->
<div class="modal-wrapper">
  <Modal bind:showModal closeWithBackdropClick={true}>
    <!-- Provide at least one closing method for the pointer users. -->
    <!-- Method 1: Set backdrop click or touch to close the modal. -->
    <!-- Method 2: This button closes the modal without any JavaScript. -->
    <button>Close Modal</button>
  </Modal>
</div>

<style>
  /* Only the <dialog> inside this page's .modal-wrapper is styled. */
  /* Reference https://svelte.dev/docs/svelte-components#style */
  .modal-wrapper :global(dialog) {
    border-radius: 0.375rem;
  }
  .modal-wrapper :global(dialog::backdrop) {
    backdrop-filter: blur(8px) brightness(0.5);
  }
  /* User-agent style has been reset. If needed, container padding should be manually set. */
  /* Reference https://github.com/tailwindlabs/tailwindcss/pull/11069#issuecomment-1527384738 */
  .modal-wrapper :global(dialog > form) {
    padding: 1rem;
  }
</style>
```

For Tailwind CSS users, above style can be rewritten using the [`@apply` directive].

[`@apply` directive]: https://tailwindcss.com/docs/reusing-styles#extracting-classes-with-apply

```svelte
<style lang="postcss">
  .modal-wrapper :global(dialog) {
    @apply rounded-md backdrop:backdrop-blur backdrop:backdrop-brightness-50;
  }
  .modal-wrapper :global(dialog > form) {
    @apply p-4;
  }
</style>
```

## Configurations

```ts
export let showModalOnMount = false;
export let closeWithBackdropClick = false;
export let fullHeight = false;
export let fullWidth = false;
```

Browsers' [default style] restricts dialog's height and width to `calc((100% - 6px) - 2em);`.

[default style]: /docs/user-agent

## Advanced

In the component, a `<form method="dialog">` is placed inside a `<dialog>` element.

- `<button>` passed to the `<slot>` [closes the dialog] through submit.
- `<dialog>` close and cancel, `<form>` submit events are forwarded.

[closes the dialog]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method

```svelte
<!-- Component Structure -->
<dialog on:close on:cancel on:submit>
  <form method="dialog">
    <slot />
  </form>
</dialog>
```

This behavior can be overridden by passing a `formAttributes` prop to the component.

- It is basically the `HTMLFormAttributes` type provided in Svelte.
- SvelteKit's `enhance` can be passed alongside `method="post"`.

```ts
export let formAttributes: NotEnhanced | Enhanced = { method: 'dialog' };
```

To style the component's slot, the `<form>` element should be styled, not the `<dialog>`.

```svelte
<div class="modal-wrapper">
  <Modal bind:showModal>
    <h1>This is a Title</h1>
    <!-- 1.5rem vertical gap -->
    <button>Close Modal</button>
  </Modal>
</div>

<style lang="postcss">
  .modal-wrapper :global(dialog > form) {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    row-gap: 1.5rem;
  }
</style>
```
