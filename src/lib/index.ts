import type { ActionResult, SubmitFunction } from '@sveltejs/kit';
import { tick } from 'svelte';
import type { createFormState } from './index.svelte.js';

// NOTE The generated SubmitFunction type
// DOES NOT extend the SubmitFunction type.

export type ExtractActionResult<
	Fn // `Fn extends SubmitFunction` does not work.
> = ActionResult<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Fn extends SubmitFunction<infer Success, any> ? Success : never,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Fn extends SubmitFunction<any, infer Failure> ? Failure : never
>;

type ChangeReturnType<Function, Returns> = Function extends (...params: infer Params) => unknown
	? (...params: Params) => Returns
	: never;

type Input = Parameters<SubmitFunction>[0];
type Opts = Parameters<Exclude<Awaited<ReturnType<SubmitFunction>>, void>>[0];

type ReturnCallback<A extends ActionResult> = (opts: Omit<Opts, 'result'> & { result: A }) => void;

type Options<A extends ActionResult> = Partial<{
	delay: number;
	disableSubmitter: boolean;
	formState: ReturnType<typeof createFormState>;
	submittedCallback: ChangeReturnType<SubmitFunction, void>;
	respondedCallback: ReturnCallback<A>;
	completedCallback: ReturnCallback<A>;
}>;

const submitterCanBeDisabled = (submitter: HTMLElement | null) =>
	// Reference https://developer.mozilla.org/en-US/docs/Web/API/SubmitEvent/submitter
	// Reference https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled
	submitter instanceof HTMLButtonElement || submitter instanceof HTMLInputElement;

const disableSubmitter = (submitter: HTMLElement | null, disable = true) => {
	if (submitterCanBeDisabled(submitter)) submitter.disabled = disable;
};

export const createSubmitFunction = <A extends ActionResult>(options: Options<A> = {}) =>
	(async (input: Input) => {
		const o: Options<A> = { delay: 1000, disableSubmitter: true, ...options };
		if (o.disableSubmitter) disableSubmitter(input.submitter);
		const timer = o.delay && new Promise((resolve) => setTimeout(resolve, o.delay));
		await o.submittedCallback?.(input); // TODO Form submission can be canceled.
		o.formState && (o.formState.is = 'submitting');
		return async (opts: Opts) => {
			if (timer) await timer;
			const o2 = { ...opts, result: opts.result as A } satisfies Parameters<ReturnCallback<A>>[0];
			await (o.respondedCallback ? o.respondedCallback(o2) : opts.update());
			if (o.disableSubmitter) disableSubmitter(input.submitter, false);
			o.formState && (o.formState.is = 'submitted');
			if (o.completedCallback) {
				await tick(); // Wait for the form prop to be updated.
				await o.completedCallback(o2);
			}
		};
	}) satisfies SubmitFunction;
