import { createDirectus, rest, authentication, readItems, readItem } from '@directus/sdk';
import { DIRECTUS_URL } from '$env/static/private';

const directus = createDirectus(DIRECTUS_URL).with(rest()).with(authentication());

/**
 * @typedef {Object} Event
 * @property {number} id
 * @property {string} status
 * @property {number|null} sort
 * @property {string} user_created
 * @property {string} date_created
 * @property {string} user_updated
 * @property {string} date_updated
 * @property {string} title
 * @property {string} description
 * @property {string} external_link
 * @property {string} link_text
 * @property {string|null} price
 * @property {boolean} registration_required
 * @property {boolean|null} featured
 * @property {string} slug
 * @property {Object|null} image
 * @property {Object|null} location
 * @property {number} data_source
 * @property {string} location_source_text
 * @property {string} classification
 * @property {string} starts_at
 * @property {string} ends_at
 * @property {string|null} image_url
 * @property {number[]} tags
 */

/**
 * @typedef {Object} Tag
 * @property {number} id
 * @property {string} name
 * @property {string} slug
 * @property {string|null} description
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
				fields: ['*'],
				filter: {
					status: {
						_eq: 'published'
					}
				}
			})
		);

		// Ensure the response is an array
		const events = Array.isArray(response) ? response : [];
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

/**
 * Fetch a single tag from Directus
 * @param {number} id - The ID of the tag to fetch
 * @returns {Promise<Tag>}
 */
export async function getTag(id) {
	try {
		const tag = await directus.request(
			readItem('tags', id, {
				fields: ['*']
			})
		);

		// console.log('Fetched tag:', tag);
		return tag;
	} catch (error) {
		console.error(`Error fetching tag with id ${id}:`, error);
		if (error.response) {
			console.error('Response status:', error.response.status);
			console.error('Response data:', await error.response.text());
		}
		throw new Error(`Failed to fetch tag with id ${id} from Directus`);
	}
}

/**
 * Fetch all tags from Directus
 * @returns {Promise<Tag[]>}
 */
export async function getAllTags() {
	try {
		const tags = await directus.request(
			readItems('tags', {
				fields: ['*']
			})
		);

		// console.log('Fetched all tags:', tags);
		return tags;
	} catch (error) {
		console.error('Error fetching all tags:', error);
		if (error.response) {
			console.error('Response status:', error.response.status);
			console.error('Response data:', await error.response.text());
		}
		throw new Error('Failed to fetch all tags from Directus');
	}
}
