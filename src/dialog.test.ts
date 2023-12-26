import { act, render } from '@testing-library/svelte';
import { expect, test, vi } from 'vitest';
import Modal from './lib/Modal.svelte';

// NOTE `dialog::backdrop` pseudo element cannot be selected in JavaScript.
// Therefore, the close modal with backdrop click option cannot be tested.
// Reference https://stackoverflow.com/questions/38872290

// Reference https://github.com/testing-library/svelte-testing-library/issues/217
vi.mock('esm-env', () => ({ BROWSER: true }));

test('programmatically show/close modal', async () => {
	const { getByRole, component } = render(Modal, { showModal: false });
	expect(() => getByRole('dialog')).toThrow(); // display: none by default.
	const dialog = getByRole('dialog', { hidden: true }) as HTMLDialogElement;
	expect(dialog.open).toBe(false);
	await act(() => component.$set({ showModal: true }));
	expect(dialog.open).toBe(true);
	await act(() => component.$set({ showModal: false }));
	expect(dialog.open).toBe(false);
});

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
