# Migration

## 1.2.0

```svelte
{#if showModal}
  <!-- Replace the `bind:showModal` with a `on:close` handler. -->
  <ModalLike on:close={() => (showModal = false)}></Modal>
{/if}
```

## 1.1.0

```svelte
<script>
  let showModal = true; // Can be set to true. Consider using the <ModalLike> component.
  // Reference https://github.com/hyunbinseo/svelte-html-modal/blob/main/docs/ssr.md
</script>

<!-- Remove the `showModalOnMount={true}` prop. -->
<Modal bind:showModal></Modal>
```
