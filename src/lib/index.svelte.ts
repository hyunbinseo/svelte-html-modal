import { render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { expect } from 'vitest';
import Modal from './Modal.svelte';

export const toggleModal = async () => {
	const props = $state({ showModal: false }); // rune
	const { getByRole } = render(Modal, props);

	const dialog = getByRole('dialog', { hidden: true }) as HTMLDialogElement;

	expect(dialog instanceof HTMLDialogElement).toBe(true);
	expect(getComputedStyle(dialog).display).toBe('none');
	expect(dialog.open).toBe(false);

	props.showModal = true;
	await tick();
	expect(dialog.open).toBe(true);

	props.showModal = false;
	await tick();
	expect(dialog.open).toBe(false);
};
