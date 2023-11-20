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

This background knowledge is required to style the `<Modal>` component.

- Modal container: `<dialog>` element
- Modal backdrop: `dialog::backdrop` pseudo-element

Yes, the dialog element can be a dialog or a modal, based on [how it is opened].

[how it is opened]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal

## Usage

```
pnpm add svelte-html-modal -D
npm i svelte-html-modal -D
```

1. Install the [package] using the preferred package manager.
2. Provide at least one closing method for the pointer users.
3. Style the modal. The browser default padding has been [reset].

[package]: https://www.npmjs.com/package/svelte-html-modal
[reset]: https://github.com/tailwindlabs/tailwindcss/pull/11069#issuecomment-1527384738

```svelte
<script>
  import { Modal } from 'svelte-html-modal';

  let showModal = false;
</script>

<button type="button" on:click={() => (showModal = true)}>Show Modal</button>

<!-- Outer <div> is used for styling purposes. Reference the <style> element below. -->
<div>
  <Modal bind:showModal closeWithBackdropClick={true}>
    <!-- Method 1: Set backdrop click or touch to close the modal. -->
    <!-- Method 2: This button closes the modal without any JavaScript. -->
    <button>Close Modal</button>
  </Modal>
</div>

<style>
  /* Only the <dialog> inside this page's <div> is styled. */
  /* Reference https://svelte.dev/docs/svelte-components#style */
  div :global(dialog) {
    padding: 1rem;
    border-radius: 0.375rem;
  }
  div :global(dialog::backdrop) {
    backdrop-filter: blur(8px) brightness(0.5);
  }
</style>
```

For Tailwind CSS users, above style can be rewritten using the [`@apply` directive].

[`@apply` directive]: https://tailwindcss.com/docs/reusing-styles#extracting-classes-with-apply

```svelte
<style lang="postcss">
  div :global(dialog) {
    @apply rounded-md p-4 backdrop:backdrop-blur backdrop:backdrop-brightness-50;
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

```svelte
<!-- Component Structure -->
<dialog on:close on:cancel on:submit>
  <form method="dialog">
    <slot />
  </form>
</dialog>
```

- This allows any `<button>` passed to the `<slot>` to [close the dialog].
- `<dialog>` close and cancel, `<form>` submit events are forwarded.

[close the dialog]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method

```ts
export let formAttributes: NotEnhanced | Enhanced = { method: 'dialog' };
```

This behavior can be overridden by passing a `formAttributes` prop to the component.

- It is basically the `HTMLFormAttributes` type provided in Svelte.
- SvelteKit's `enhance` can be passed alongside `method="post"`.
