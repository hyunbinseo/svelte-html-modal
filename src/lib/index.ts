import type { SubmitFunction } from '@sveltejs/kit';
import { tick } from 'svelte';
import type { createModalFormState } from './index.svelte.js';

type ChangeReturnType<Function, Returns> = Function extends (...params: infer Params) => unknown
	? (...params: Params) => Returns
	: never;

type SubmitFnNoReturn<Fn extends SubmitFunction> = ChangeReturnType<Fn, void>;
type SubmitFnReturnCb<Fn extends SubmitFunction> = Exclude<Awaited<ReturnType<Fn>>, void>;

type SubmitFnReturnCbWithSubmitter<Fn extends SubmitFunction> = (
	opts: Parameters<SubmitFnReturnCb<Fn>>[0] & { submitter: HTMLElement | null }
) => void;

type Options<Fn extends SubmitFunction> = Partial<{
	delay: number;
	modalFormState: ReturnType<typeof createModalFormState>;
	submittedCallback: SubmitFnNoReturn<Fn>;
	respondedCallback: SubmitFnReturnCbWithSubmitter<Fn>;
	completedCallback: SubmitFnReturnCbWithSubmitter<Fn>;
}>;

export const createSubmitFunction = <Fn extends SubmitFunction>(options: Options<Fn> = {}) =>
	(async (input: Parameters<Fn>[0]) => {
		const o: Options<Fn> = { delay: 1000, ...options };
		const timer = o.delay && new Promise((resolve) => setTimeout(resolve, o.delay));
		await o.submittedCallback?.(input); // TODO Form submission can be canceled.
		o.modalFormState?.set.submitting();
		return async (opts: Parameters<SubmitFnReturnCb<Fn>>[0]) => {
			if (timer) await timer;
			const o2 = { ...opts, submitter: input.submitter };
			await (o.respondedCallback ? o.respondedCallback(o2) : opts.update());
			o.modalFormState?.set.submitted();
			if (o.completedCallback) {
				await tick(); // Wait for the form prop to be updated.
				await o.completedCallback(o2);
			}
		};
	}) satisfies SubmitFunction;
