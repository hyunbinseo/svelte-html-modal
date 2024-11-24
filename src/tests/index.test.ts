import { render } from '@testing-library/svelte';
import { expect, test } from 'vitest';
import Modal from '../lib/Modal.svelte';
import { toggleModal } from './index.svelte.js';

// NOTE `dialog::backdrop` pseudo element cannot be selected in JavaScript.
// Therefore, the close modal with backdrop click option cannot be tested.
// Reference https://stackoverflow.com/questions/38872290

test('programmatically toggle modal', toggleModal);

test('show modal on component mount', () => {
	const { getByRole } = render(Modal, { isShown: true });
	const dialog = getByRole('dialog') as HTMLDialogElement;
	expect(dialog.open).toBe(true);
});
