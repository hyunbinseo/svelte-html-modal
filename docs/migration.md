# Migration

## v4

The following props have been removed:

```diff
- enableTransitions
- onclosed
```

Set custom transitions using CSS. [Examples]

[examples]: https://svelte.dev/playground/f2836fe6442c438bb4669909b01a6649

> [!NOTE]
> `transitionend` is unreliable in Chromium, so it should not be used to determine `onclosed`. [Learn more](https://issues.chromium.org/issues/365565135)

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
  let showModal = true; // can be set to true
</script>

<!-- Remove the `showModalOnMount={true}` prop. -->
<Modal bind:showModal></Modal>
```
