# Migration

## 1.1.0

To show the modal on component mount:

```svelte
<script>
  let showModal = true;
</script>

<!-- Remove the `showModalOnMount={true}` prop. -->
<Modal bind:showModal></Modal>
```
