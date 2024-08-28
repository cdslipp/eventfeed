import { createDirectus, rest, authentication, readItems } from '@directus/sdk';
import { DIRECTUS_URL } from '$env/static/private';

const directus = createDirectus(DIRECTUS_URL).with(rest()).with(authentication());

/**
 * @typedef {Object} Event
 * @property {string} title
 * @property {string} description
 * @property {string} starts_at
 * @property {string} ends_at
 * @property {string} external_link
 */

/**
 * Authenticate with Directus
 * @param {string} email
 * @param {string} password
 */
export async function login(email, password) {
	try {
		await directus.login(email, password);
	} catch (error) {
		console.error('Login error:', error);
		throw new Error('Failed to authenticate with Directus');
	}
}

/**
 * Fetch events from Directus
 * @returns {Promise<Event[]>}
 */
export async function getEvents() {
	try {
		const response = await directus.request(
			readItems('events', {
				fields: ['id', 'title', 'description', 'starts_at', 'ends_at', 'external_link']
			})
		);

		// Ensure the response is an array
		const rawEvents = Array.isArray(response) ? response : [];

		// console.log(rawEvents);

		// Map the raw events to the expected Event structure
		const events = rawEvents.map((event) => ({
			id: event.id || '',
			title: event.title || '',
			description: event.description || '',
			starts_at: event.starts_at || '',
			ends_at: event.ends_at || '',
			external_link: event.external_link || ''
		}));

		// console.log('Fetched events:', events);
		return events;
	} catch (error) {
		console.error('Error fetching events:', error);
		if (error.response) {
			console.error('Response status:', error.response.status);
			console.error('Response data:', await error.response.text());
		}
		throw new Error('Failed to fetch events from Directus');
	}
}
