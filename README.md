# Svelte HTML Modal

A simple wrapper component for the HTML [`<dialog>`] element.

[`<dialog>`]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement

## Benefits

Don't reinvent the wheel.

- [Wide Support](https://caniuse.com/dialog) - 95.84% as of Nov. 2023
- Accessibility - focus trap, `Esc` to cancel
- CSS animation when opening the modal
- DOM events - close, cancel, and submit[^submit]
- Plain HTML `<button>` closes the modal

[^submit]: The component uses a `<form method="dialog">` inside a `<dialog>` element. [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method)

## Usage

```
pnpm add svelte-html-modal -D
npm i svelte-html-modal -D
```

```svelte
<script lang="ts">
  import { Modal } from 'svelte-html-modal';

  let showModal = false;
</script>

<button type="button" on:click={() => (showModal = true)}>Show Modal</button>

<Modal bind:showModal on:close={() => (showModal = false)}>
  <!-- Content -->
  <button>Close Modal</button>
</Modal>
```
