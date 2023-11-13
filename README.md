# Svelte HTML Modal

A simple wrapper component for the HTML [`<dialog>`] element - [demo]

[`<dialog>`]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement
[demo]: https://svelte.dev/repl/7ffaea50f0c0466ea2b4be8e0aee20dd?version=4.2.3

## Benefits

Don't reinvent the wheel.

- [Wide Support](https://caniuse.com/dialog) - 95.84% as of Nov. 2023
- Accessibility - focus trap, `Esc` to cancel
- CSS animation when opening the modal
- Plain HTML `<button>` closes the modal
- Disables `<body>` scrolling when opened[^overflow]
- DOM events - close, cancel, and submit

[^overflow]: Sets `overflow: hidden` in the `<body>` element. Similar to how [Bootstrap modal](https://getbootstrap.com/docs/5.3/components/modal/#how-it-works) works.

## Usage

```
pnpm add svelte-html-modal -D
npm i svelte-html-modal -D
```

```svelte
<script>
  import { Modal } from 'svelte-html-modal';

  let showModal = false;
</script>

<button type="button" on:click={() => (showModal = true)}>Show Modal</button>

<Modal bind:showModal on:close={() => (showModal = false)}>
  <!-- content -->
</Modal>
```

## Configurations

```ts
export let showModalOnMount = false;
export let closeWithBackdropClick = false;
export let transparentBackdrop = false;
export let fullHeight = false;
export let fullWidth = false;
```

Browser default style restricts dialog's height and width to `calc((100% - 6px) - 2em);`.

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

- This allows any `<button>` passed to the `<slot>` to [close the dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method).
- This can be overridden by passing a custom `formAttributes` prop.
- `<dialog>` close and cancel, `<form>` submit events are forwarded.

```ts
export let formAttributes: HTMLFormAttributes = { method: 'dialog' };
```

- `use:enhanced` is not applied since it is a SvelteKit specific module.
