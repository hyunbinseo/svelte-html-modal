# Server-Side Rendering

## Limitation

In SSR, the following component generates the `<dialog>` markup in the server.

```svelte
<script>
  let showModal = true;
</script>

<Modal bind:showModal></Modal>
```

However, it is not visible since the `showModal()` method requires JavaScript.

In the client, the hydration has to be completed for the modal to be shown.

## Solution

To overcome this issue, an alternative component is provided out-of-the box.

The non-modal `<dialog open>` element is styled like a modal with a backdrop.

```svelte
<!-- backdrop -->
<div>
  <!-- centered dialog -->
  <dialog open>
    <!-- modal content -->
    <slot />
  </dialog>
</div>
```

To trap the focus, the [inert] attribute is set on sibling elements using JavaScript.

[inert]: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert

For this to work, it is advised to place the component on the top-most level.

```svelte
<body data-sveltekit-preload-data="hover">
  <div>
    <!-- SvelteKit components are placed here. -->
    <!-- %sveltekit.body% -->

    <!-- Therefore, this is the top-most level. -->
    <div class="modal-wrapper">
      <ModalLike></ModalLike>
    </div>

    <!-- The inert attribute is automatically set on sibling elements. -->
    <!-- Unmounting the ModalLike component will unset the attributes.  -->
    <div inert></div>
  </div>
</body>
```

## Usage

```
pnpm add svelte-html-modal -D
npm i svelte-html-modal -D
```

```svelte
<script>
  import { ModalLike } from 'svelte-html-modal';

  // If the modal can be hidden on mount, use the Modal component.
  // Reference https://github.com/hyunbinseo/svelte-html-modal#readme

  let showModal = true; // Initial value should always be true.
</script>

<button type="button" on:click={() => (showModal = true)}>Show Modal</button>

{#if showModal}
  <!-- The outer wrapper <div> is required for the focus-trap to work. -->
  <!-- It is also used for styling. Reference the <style> element below. -->
  <div class="modal-wrapper">
    <ModalLike on:close={() => (showModal = false)}>
      <!-- Example with a nested <form> element. -->
      <!-- Elements other than <form> can be used. -->
      <form method="dialog">
        <!-- Closes the modal without JavaScript. -->
        <button>Close</button>
      </form>
    </ModalLike>
  </div>
{/if}

<style>
  /* Only the <dialog> inside this page's .modal-wrapper is styled. */
  /* Reference https://svelte.dev/docs/svelte-components#style */
  .modal-wrapper :global(dialog) {
    width: 20rem;
    border-radius: 0.375rem;
    /* Dialog padding has been reset to 0. Browser default style is 1em. */
    /* Reference https://github.com/tailwindlabs/tailwindcss/pull/11069 */
    /* Reference https://browserdefaultstyles.com/#dialog */
    padding: 1rem;
  }
  /* dialog::backdrop only exists when opened with a `showModal()` method. */
  .modal-wrapper :global(.backdrop) {
    backdrop-filter: blur(8px) brightness(0.5);
  }
</style>
```

## Configurations

```ts
export let closeWithBackdropClick = false;
export let preventCancel = false;
export let trapFocus = true;

export let fullHeight = false;
export let fullWidth = false;
```
