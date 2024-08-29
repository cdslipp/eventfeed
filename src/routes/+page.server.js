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

		const events = await getEvents();

		const processedEvents = events
			.filter((event) => {
				if (!event.starts_at) {
					console.log(`Event ${event.id} filtered out due to missing starts_at`);
					return false;
				}
				return true;
			})
			.sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at));

		// Extract all unique tags from the events
		const allTags = Array.from(new Set(processedEvents.flatMap((event) => event.tags))).filter(
			Boolean
		);

		return { events: processedEvents, tags: allTags };
	} catch (err) {
		console.error('Error in load function:', err);
		throw error(500, 'Failed to fetch events and tags');
	}
}
