import { login, getEvents } from '$lib/directus';
import { error } from '@sveltejs/kit';
import { DIRECTUS_EMAIL, DIRECTUS_PASSWORD } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	if (!DIRECTUS_EMAIL || !DIRECTUS_PASSWORD) {
		console.error('Directus credentials not found in environment variables');
		throw error(500, 'Server configuration error');
	}

	try {
		await login(DIRECTUS_EMAIL, DIRECTUS_PASSWORD);
		let events = await getEvents();

		// Filter out events without a start time
		events = events.filter((event) => event.starts_at);

		// Sort events by start time in ascending order
		events.sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at));

		return { events };
	} catch (err) {
		console.error('Error in load function:', err);
		throw error(500, 'Failed to fetch events');
	}
}
