# Migration

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
