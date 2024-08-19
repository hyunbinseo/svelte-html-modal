import { render } from '@testing-library/svelte';
import { expect, test } from 'vitest';
import Modal from '../src/lib/Modal.svelte';
import { testFunction } from './index.svelte.js';

// TODO Migrate to Vitest Browser Mode
// Reference https://vitest.dev/guide/browser/

// NOTE `dialog::backdrop` pseudo element cannot be selected in JavaScript.
// Therefore, the close modal with backdrop click option cannot be tested.
// Reference https://stackoverflow.com/questions/38872290

test('programmatically show/close modal', testFunction);

test('show modal on component mount', () => {
	const { getByRole } = render(Modal, { showModal: true });
	const dialog = getByRole('dialog') as HTMLDialogElement;
	expect(dialog.open).toBe(true);
});

// Reference https://github.com/capricorn86/happy-dom/issues/1184
test.skip('method="dialog" form submission', () => {
	const { getByRole } = render(Modal, { showModal: true });
	const dialog = getByRole('dialog') as HTMLDialogElement;
	dialog.querySelector('form')?.submit();
	expect(dialog.open).toBe(false);
});
