export const actions = {
	default: async () => {
		await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random()) * 10000));
		return { now: new Date() };
	}
};
