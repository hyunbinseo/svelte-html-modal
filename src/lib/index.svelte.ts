export { default as Modal } from './Modal.svelte';
export { default as ModalLike } from './ModalLike.svelte';

export const createModalFormState = (showModalOnMount = false) => {
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
		show: () => (showModal = true),
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
