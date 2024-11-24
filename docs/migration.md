# Migration

<!-- TODO Write v3 migration guide. -->

## v2

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
