import { render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { expect } from 'vitest';
import Modal from '../src/lib/Modal.svelte';

export const testFunction = async () => {
	const props = $state({ showModal: false });
	const { getByRole } = render(Modal, props);

	expect(() => getByRole('dialog')).toThrow(); // display: none by default.

	const dialog = getByRole('dialog', { hidden: true }) as HTMLDialogElement;
	expect(dialog.open).toBe(false);

	props.showModal = true;
	await tick();
	expect(dialog.open).toBe(true);

	props.showModal = false;
	await tick();
	expect(dialog.open).toBe(false);
};
