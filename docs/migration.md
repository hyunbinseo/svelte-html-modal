# Migration

## v5

- No longer manages `document.body.style.overflow` via JavaScript.
- No longer includes [default styles](https://github.com/hyunbinseo/svelte-html-modal/blob/v4.0.1/src/lib/Modal.svelte#L71-L91).

```css
/* (Required) Add to global CSS file */
body:has(dialog:modal) {
  overflow: hidden;
  touch-action: none;
}
```

## v4

The following props have been removed:

```diff
- enableTransitions
- onclosed
```

Set custom transitions using CSS instead. [Examples]

[examples]: https://svelte.dev/playground/f2836fe6442c438bb4669909b01a6649

> [!NOTE]
> `transitionend` is unreliable in Chromium, so it should not be used to determine `onclosed`. [Learn more](https://issues.chromium.org/issues/365565135)

## v3

- Requires Svelte v5 and runes mode.
- Component props have been renamed or removed:

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
  /* Override user-agent styles for full height or width */
  max-height: 100%; /* calc((100% - 6px) - 2em); */
  max-width: 100%; /* calc((100% - 6px) - 2em); */
}
```

## v2

The nested form has been removed.

```svelte
<Modal>
  <form method="dialog">
    <!-- Add existing content here. -->
  </form>
</Modal>
```

## v1.2

```svelte
<!-- Replace `bind:showModal` with an `on:close` handler. -->
<ModalLike on:close={() => (showModal = false)}></Modal>
```

## v1.1

```svelte
<script>
  let showModal = true; // can be set to true
</script>

<!-- Remove the `showModalOnMount={true}` prop. -->
<Modal bind:showModal></Modal>
```
