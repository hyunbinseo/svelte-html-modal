# Svelte HTML Modal

Create modals using the [`<dialog>`] element.

See [examples] with custom transitions:

[`<dialog>`]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement
[examples]: https://svelte.dev/playground/f2836fe6442c438bb4669909b01a6649

- Centered, Bottom Sheet on Mobile (fly-up)
- Navigation Drawer (slide-right[^slide-right])

[^slide-right]: Consider setting `scrollbar-gutter: stable;` on the HTML element to avoid layout shift during transition.

## Features

Requires Svelte v5 and runes mode.

- **State Management**: Open and close modals with a single `$state(boolean)`
- **Backdrop Control**: Close the modal by clicking anywhere outside of it
- **Accessibility**: Native `<dialog>` element with focus trap and <kbd>Esc</kbd> support
- **Event Handling**: `oncancel` and `onclose` event handlers are supported
- **SSR Support**: The modal can be opened(shown) before Svelte hydration
- **[Browser Support]**: Works in 96.66% of browsers as of November, 2024

[Browser Support]: https://caniuse.com/dialog

## Quick Start

To upgrade from previous versions, see the [migration guide](/docs/migration.md).

```shell
pnpm add svelte-html-modal -D
npm i svelte-html-modal -D
```

```css
/* Add to your global CSS file (e.g. src/routes/layout.css) */
/* For Tailwind v4 users, place it inside `@layer base` */
/* See https://tailwindcss.com/docs/adding-custom-styles */
body:has(dialog:modal) {
  overflow: hidden;
  touch-action: none;
}
```

```svelte
<!-- See src/routes/docs/+page.svelte -->

<script>
  import { Modal } from 'svelte-html-modal';

  // Client-side JavaScript is required to display the modal.
  // See https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal
  let isOpen = $state(false);

  const open = () => (isOpen = true);
  const close = () => (isOpen = false);
</script>

<button type="button" onclick={open}>Open Modal</button>

<!-- The wrapper <div> is used for styling. -->
<!-- See the <style> element below. -->
<div class="modal-wrapper">
  <Modal bind:isOpen closeOnBackdropClick={true} closeOnEscapeKey={true}>
    <strong>Close the Modal</strong>
    <ul>
      <li>Click on the backdrop</li>
      <li>Press the <kbd>Esc</kbd> key</li>
      <li>
        <button type="button" onclick={close}>JavaScript Button</button>
      </li>
      <li>
        <!-- See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method -->
        <form method="dialog">
          <button>Submit Button</button>
        </form>
      </li>
    </ul>
  </Modal>
</div>

<!-- Vanilla CSS -->
<style lang="postcss">
  /* Style <dialog> within the .modal-wrapper element. */
  /* See https://svelte.dev/docs/svelte/scoped-styles */
  .modal-wrapper :global {
    > dialog {
      width: 20rem;
      padding: 1rem;
      border-radius: 0.375rem;
      &:modal {
        overscroll-behavior: contain;
      }
      &::backdrop {
        backdrop-filter: blur(8px) brightness(0.5);
      }
    }
  }
</style>
```

Tailwind CSS v4 class names can be used as well:

```svelte
<Modal
  class="m-auto w-80 rounded-md p-4 backdrop:backdrop-blur backdrop:backdrop-brightness-50 open:overscroll-contain"
></Modal>
```

> [!NOTE]  
> For fullscreen modal, override max-size values:

```css
dialog {
  /* Override user-agent dialog:modal max-sizes. */
  max-height: 100%; /* calc((100% - 6px) - 2em); */
  max-width: 100%; /* calc((100% - 6px) - 2em); */
}
```

## Default Options

```json
{
  "closeOnBackdropClick": false,
  "closeOnEscapeKey": true
}
```

## Component Props

<!-- See dist/Modal.svelte.d.ts -->

```ts
type Props = {
  dialog?: HTMLDialogElement | undefined; // bindable
  isOpen: boolean; // bindable
  closeOnBackdropClick?: boolean | undefined;
  closeOnEscapeKey?: boolean | undefined;
  class?: HTMLDialogAttributes['class'] | undefined;
  children?: Snippet | undefined;
} & Partial<Pick<HTMLDialogAttributes, 'id' | 'oncancel' | 'onclose'>>;
```

> [!IMPORTANT]  
> The `closeOnEscapeKey` prop has a known issue in Chrome 126~133. The modal can be closed by pressing the `Esc` key twice. This will be resolved in a future update when the `closedby` attribute is implemented. [Learn more](https://github.com/hyunbinseo/svelte-html-modal/issues/6)
