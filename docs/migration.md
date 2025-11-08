# Migration

## v4

The following props have been removed:

- `enableTransitions`
- `onclosed`

Set custom transition using CSS. Examples:

- [Centered Dialog] with Fly Transition
- [Navigation Drawer] with Slide Transition

[Centered Dialog]: https://svelte.dev/playground/f2836fe6442c438bb4669909b01a6649?version=5.43.4
[Navigation Drawer]: https://svelte.dev/playground/86e9d2cfbf7c4ddf966d39347098a56f?version=5.43.4

> [!NOTE]  
> `transitionend` is not reliable in Chromium. [Learn more](https://issues.chromium.org/issues/365565135)

## v3

Requires Svelte v5 and runes mode.

| Before                   | After                  |
| ------------------------ | ---------------------- |
| `bind:showModal`         | `bind:isOpen`          |
| `closeWithBackdropClick` | `closeOnBackdropClick` |
| `preventCancel`          | `closeOnEscapeKey`     |
| `showFlyInAnimation`     | `enableTransitions`    |
| `fullHeight`             | -                      |
| `fullWidth`              | -                      |

```css
.modal-wrapper > :global(dialog) {
  /* Override user-agent dialog:modal max-sizes. */
  max-height: 100%; /* calc((100% - 6px) - 2em); */
  max-width: 100%; /* calc((100% - 6px) - 2em); */
}
```

## v2

Nested form has been removed.

```svelte
<Modal>
  <form method="dialog">
    <!-- Add existing content here. -->
  </form>
</Modal>
```

## v1.2

```svelte
<!-- Replace the `bind:showModal` with a `on:close` handler. -->
<ModalLike on:close={() => (showModal = false)}></Modal>
```

## v1.1

```svelte
<script>
  let showModal = true; // Can be set to true. Consider using the ModalLike component.
  // Reference https://github.com/hyunbinseo/svelte-html-modal/blob/main/docs/ssr.md
</script>

<!-- Remove the `showModalOnMount={true}` prop. -->
<Modal bind:showModal></Modal>
```
