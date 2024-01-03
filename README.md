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
- DOM events - cancel, close, and submit
- [SSR ready](/docs/ssr.md) - show dialog with HTML only

[^overflow]: Sets `overflow: hidden` in the `<body>` element. Similar to how [Bootstrap modal] works.

[Bootstrap modal]: https://getbootstrap.com/docs/5.3/components/modal/#how-it-works

## HTML

This background knowledge is required to understand the `<Modal>` component.

```
Structure            | Role      | Style
-------------------- | --------- | ----------------------------------
├── dialog::backdrop | backdrop  | background-color, backdrop-filter
└── <dialog>         | root      | width, border-radius, padding
    └── <form>       | container | display, flex-direction, etc.
        └── <slot>   | content   |
```

The `<dialog>` element can be a dialog or a modal based on [how it is opened].

[how it is opened]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal

Reference the [nested `<form>`](#nested-form) section to understand the reason and benefits.

## Usage

```
pnpm add svelte-html-modal -D
npm i svelte-html-modal -D
```

```svelte
<script>
  import { Modal } from 'svelte-html-modal';

  // If this value is true, the modal is opened immediately after the JavaScript is loaded.
  // For the modal to be opened in the server-rendered markup, use the <ModalLike> component.
  // Reference https://github.com/hyunbinseo/svelte-html-modal/blob/main/docs/ssr.md
  let showModal = false;
</script>

<button type="button" on:click={() => (showModal = true)}>Show Modal</button>

<!-- Outer wrapper <div> is used for styling. -->
<!-- Reference the <style> element below. -->
<div class="modal-wrapper">
  <!-- Provide at least one closing method for the pointer users. -->
  <!-- Method 1: Set the close-with-backdrop-click prop. -->
  <!-- Method 2: Pass a <button> element to the slot. -->
  <Modal
    bind:showModal
    closeWithBackdropClick={true}
    on:close={(e) => {
      if (e.currentTarget instanceof HTMLDialogElement) {
        // The value of the button that was pressed to close the dialog.
        // Reference https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/returnValue
        e.currentTarget.returnValue; // bye
      }
    }}
  >
    <!-- Flex items. Reference the `:global(dialog > form)` style below. -->
    <h1>Hello, Modal!</h1>
    <!-- This button closes the modal without any JavaScript on:click handlers. -->
    <!-- To identify the button that closed the modal, use the value attribute. -->
    <button value="bye">Close</button>
  </Modal>
</div>

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
  .modal-wrapper :global(dialog::backdrop) {
    backdrop-filter: blur(8px) brightness(0.5);
  }
  .modal-wrapper :global(dialog > form) {
    /* <slot> styles */
    display: flex;
    flex-direction: column;
  }
</style>
```

For Tailwind CSS users, above style can be rewritten using the [`@apply` directive].

[`@apply` directive]: https://tailwindcss.com/docs/reusing-styles#extracting-classes-with-apply

```svelte
<style lang="postcss">
  .modal-wrapper :global(dialog) {
    @apply w-80 rounded-md p-4 backdrop:backdrop-blur backdrop:backdrop-brightness-50;
  }
  .modal-wrapper :global(dialog > form) {
    @apply flex flex-col;
  }
</style>
```

## Configurations

```ts
export let showFlyInAnimation = true;
export let closeWithBackdropClick = false;
export let preventCancel = false;
export let fullHeight = false;
export let fullWidth = false;
```

Browser [default style] restricts dialog's height and width to `calc((100% - 6px) - 2em);`.

[default style]: /docs/user-agent

## Custom Animations

Default fly-in animation can be disabled and overridden using CSS animations.

Fly-out animation is not available since it is a `display: black → none` switch.

```svelte
<div class="modal-wrapper">
  <Modal bind:showModal showFlyInAnimation={false}>
    <!-- Modal Content -->
  </Modal>
</div>

<style>
  @keyframes fly {
    from {
      transform: translateY(32px);
    }
    to {
      transform: translateY(0%);
    }
  }
  .modal-wrapper :global(dialog[open]) {
    animation: fly 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @media (prefers-reduced-motion) {
    .modal-wrapper :global(dialog[open]) {
      animation: none;
    }
  }
</style>
```

## Nested Form

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

```svelte
<script>
  import { enhance } from '$app/forms';
</script>

<Modal formAttributes={{ method: 'post', enhance }}></Modal>
```

- It is an extended version of the `HTMLFormAttributes` [type] in Svelte.
- For progressive enhancement, provide the SvelteKit's [`enhance`] module.
- [Customize] the `use:enhance` behavior by providing a `submitFunction`.

[type]: https://github.com/sveltejs/svelte/blob/main/packages/svelte/elements.d.ts
[`enhance`]: https://kit.svelte.dev/docs/modules#$app-forms-enhance
[customize]: https://kit.svelte.dev/docs/form-actions#progressive-enhancement-customising-use-enhance

```ts
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

export let formAttributes: Enhanced | NotEnhanced = { method: 'dialog' };
```
