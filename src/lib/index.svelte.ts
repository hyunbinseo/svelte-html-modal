export { default as Modal } from './Modal.svelte';
export { default as ModalLike } from './ModalLike.svelte';

type Option = { resetFormStateOnShowModal: boolean };

export const createModalFormState = (
	showModalOnMount = false,
	option: Option = { resetFormStateOnShowModal: true }
) => {
	let showModal = $state(showModalOnMount);
	let formState = $state<0 | 1 | 2>(0);
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
			if (option.resetFormStateOnShowModal) formState = 0;
			showModal = true;
		},
		close: () => (showModal = false),

		// Form
		get isStandby() {
			return formState === 0;
		},
		get isSubmitting() {
			return formState === 1;
		},
		get hasSubmitted() {
			return formState === 2;
		},
		set: {
			standby: () => (formState = 0),
			submitting: () => (formState = 1),
			submitted: () => (formState = 2)
		}
	};
};
