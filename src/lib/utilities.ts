export const getTransitionDuration = (...args: Parameters<typeof window.getComputedStyle>) => {
	const computedStyle = window.getComputedStyle(...args);

	const transitionProperty = computedStyle.transitionProperty;
	if (!transitionProperty || transitionProperty === 'none') return 0;

	const properties = transitionProperty.split(',');
	const durations = computedStyle.transitionDuration.split(',');
	let maxDuration = 0;

	for (let i = 0; i < properties.length; i++) {
		const property = properties[i].trim();
		if (
			!(
				property === 'all' || //
				property === 'display' ||
				property === 'overlay'
			)
		)
			continue;

		const durationString = durations[i % durations.length].trim();
		const duration =
			(parseFloat(durationString) || 0) * //
			(durationString.toLowerCase().endsWith('ms') ? 1 : 1000);

		maxDuration = property === 'all' ? duration : Math.max(maxDuration, duration);
	}

	return maxDuration;
};
