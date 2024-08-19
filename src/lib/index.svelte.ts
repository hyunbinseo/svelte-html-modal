export { default as Modal } from './Modal.svelte';
export { default as ModalLike } from './ModalLike.svelte';

export const createFormState = () => {
	let state = $state<'submitting' | 'submitted' | null>(null);
	return {
		get value() {
			return state;
		},
		get isSubmitting() {
			return state === 'submitting';
		},
		get hasSubmitted() {
			return state === 'submitted';
		},
		setSubmitting: () => (state = 'submitting'),
		setSubmitted: () => (state = 'submitted'),
		reset: () => (state = null)
	};
};
