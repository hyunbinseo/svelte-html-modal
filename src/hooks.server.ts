import type { Handle } from '@sveltejs/kit';

export const handle: Handle = ({ event, resolve }) => {
	if (event.url.pathname === '/favicon.ico') return new Response(null, { status: 204 });
	return resolve(event);
};
