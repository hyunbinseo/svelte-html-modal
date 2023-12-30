# Server-Side Rendering

## Limitation

In SSR, the following component generates the `<dialog>` markup in the server.

```svelte
<script>
  let showModal = true;
</script>

<Modal bind:showModal></Modal>
```

However, it cannot be shown until hydration. `showModal()` requires JavaScript.

## Solution

To overcome this issue, an alternative component is provided out-of-the box.

It utilizes a non-modal `<dialog open>` element to be shown with HTML only.

```svelte
<!-- Container that doubles as a backdrop. -->
<div>
  <!-- Centered and opened modal with pure HTML. -->
  <dialog open>
    <slot />
  </dialog>
</div>
```

Note that this component still requires the `<dialog>` element. It is not a polyfill.

## Focus-trap

To trap the focus inside the component, the [inert] HTML attribute is used.

[inert]: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert

For this to work, the component should be located on the top-most level.

```svelte
<body data-sveltekit-preload-data="hover">
  <div>
    <!-- %sveltekit.body% -->
    <!-- The component should be placed in this level. -->
    <ModalLike bind:showModal></ModalLike>
  </div>
</body>
```

If the `trapFocus` prop is enabled, it will set `inert` on neighboring elements.

```javascript
for (const element of container.parentNode?.children || []) {
  if (element !== container) element.setAttribute('inert', '');
}
```

Note that inert is a [relatively new] API, and the above trap requires hydration.

[relatively new]: https://caniuse.com/mdn-api_htmlelement_inert

## Usage

```
pnpm add svelte-html-modal -D
npm i svelte-html-modal -D
```

```svelte
<script>
  import { ModalLike } from 'svelte-html-modal';

  let showModal = false;
</script>

<button type="button" on:click={() => (showModal = true)}>Show Modal</button>

{#if showModal}
  <!-- Style the backdrop using the background prop. -->
  <!-- A .modal-wrapper element is not necessary. -->
  <ModalLike bind:showModal>
    <!-- Example with a nested <form> element. -->
    <!-- Elements other than <form> can be used. -->
    <form method="dialog">
      <h1>Hello, Modal!</h1>
      <!-- Closes the modal without any JavaScript. -->
      <button>Close</button>
    </form>
  </ModalLike>
{/if}
```

## Configurations

```ts
export let closeWithBackdropClick = false;
export let preventCancel = false;
export let fullHeight = false;
export let fullWidth = false;

export let trapFocus = true;
export let background = 'rgba(0, 0, 0, 0.1)';
```
