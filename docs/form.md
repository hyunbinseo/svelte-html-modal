# Use with SvelteKit `use:enhance`

**🚧 Work in Progress**

Modal with a `<form use:enhance>` child element

- Modal should not be closable during submission
- Form reset should follow the browser behaviors
- Submitting state should last for a minimum time

```svelte
<script>
  import { enhance } from '$app/forms';
  import { tick } from 'svelte';
  import { Modal } from 'svelte-html-modal';

  export let form;

  let showModal = false;

  /** @type {'submitting' | 'submitted' | null} */
  let formState = null;
</script>

<button type="button" on:click={() => (showModal = true)}>Show Modal</button>

<div class="modal-wrapper">
  <Modal
    bind:showModal
    on:close={() => (formState = null)}
    preventCancel={formState === 'submitting'}
  >
    <form
      method="post"
      use:enhance={async () => {
        formState = 'submitting';
        // Show the submitting state for a minimum of 1000ms.
        const timer = new Promise((resolve) => setTimeout(resolve, 1000));
        return async ({ update }) => {
          await timer;
          await update();
          await tick(); // Update the exported form object.
          formState = 'submitted';
        };
      }}
    >
      <!-- Resets the form properly by recreating the input fields. -->
      <!-- Reference https://github.com/sveltejs/svelte/issues/8220 -->
      {#if formState !== 'submitted'}
        <input type="text" name="message" size="10" value="Hello, World!" required />
        <button disabled={formState === 'submitting'}>
          {formState === 'submitting' ? 'Submitting' : 'Submit'}
        </button>
      {:else if form?.now}
        <p>Submitted at {form.now.toISOString()}</p>
      {/if}
      <button
        type="button"
        disabled={formState === 'submitting'}
        on:click={() => (showModal = false)}
      >
        Close
      </button>
    </form>
  </Modal>
</div>

<style>
  .modal-wrapper > :global(dialog) {
    width: 20rem;
    border-radius: 0.375rem;
    padding: 1rem;
  }
  .modal-wrapper > :global(dialog::backdrop) {
    backdrop-filter: blur(8px) brightness(0.5);
  }
</style>
```

```js
export const actions = {
  default: async () => {
    await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random()) * 5000));
    return { now: new Date() };
  }
};
```
