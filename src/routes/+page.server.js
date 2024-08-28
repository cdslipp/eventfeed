import { login, getEvents, getAllTags } from '$lib/directus';
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

		// Fetch events and tags in parallel
		const [rawEvents, allTags] = await Promise.all([getEvents(), getAllTags()]);

		// console.log('Raw events:', rawEvents);
		// console.log('All tags:', allTags);

		// Create a map of tag ids to tag objects for quick lookup
		const tagMap = new Map(allTags.map((tag) => [tag.id, tag]));
		// console.log('Tag map:', Object.fromEntries(tagMap));

		// Helper function to process a single event
		function processEvent(event) {
			// console.log(`Processing event: ${event.id}`);

			if (event.tags.length === 0) {
				return event;
			} else {
				console.log(`Event tags before processing: ${JSON.stringify(event.tags)}`);
			}

			const processedTags = event.tags
				? event.tags
						.map((tagId) => {
							const tag = tagMap.get(tagId);
							if (tag) {
								console.log(`Matched tag ${tagId} to ${tag.name}`);
							} else {
								console.log(`No match found for tag ${tagId}`);
							}
							return tag;
						})
						.filter(Boolean)
				: [];

			console.log(`Processed tags for event ${event.id}:`, processedTags);

			return {
				...event,
				tags: processedTags
			};
		}

		// Process events to include full tag objects
		const processedEvents = rawEvents
			.filter((event) => {
				if (!event.starts_at) {
					console.log(`Event ${event.id} filtered out due to missing starts_at`);
				}
				return event.starts_at;
			})
			.map(processEvent)
			.sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at));

		// console.log('Processed events:', processedEvents);

		return { events: processedEvents, tags: allTags };
	} catch (err) {
		console.error('Error in load function:', err);
		throw error(500, 'Failed to fetch events and tags');
	}
}
