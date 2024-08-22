export { createSubmitFunction, type ExtractActionResult } from './index.js';
export { default as Modal } from './Modal.svelte';
export { default as ModalLike } from './ModalLike.svelte';

type Option = { resetFormStateOnShowModal: boolean };

export const createModalFormState = (
	showModalOnMount = false,
	option: Option = { resetFormStateOnShowModal: true }
) => {
	let showModal = $state(showModalOnMount);

	type FormState = 'standby' | 'submitting' | 'submitted';
	let formState = $state<FormState>('standby');

	return {
		// Modal
		get isShown() {
			return showModal;
		},
		// required for binding
		set isShown(show: boolean) {
			showModal = show;
		},
		show: () => {
			// The form state should not be updated in a onclose handler.
			// The dialog's content can change while it is being closed.
			if (option.resetFormStateOnShowModal) formState = 'standby';
			showModal = true;
		},
		close: () => (showModal = false),

		// Form
		get isStandby() {
			return formState === 'standby';
		},
		get isSubmitting() {
			return formState === 'submitting';
		},
		get isSubmitted() {
			return formState === 'submitted';
		},
		set is(state: FormState) {
			formState = state;
		}
	};
};
