//Most of the DB requests here are taken straight from Shay's ConnectedKW frontend's directus.js file.

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
				fields: '*,location.*,categories.categories_id.*,tags.tags_id.*,image.*',
				filter: {
					status: {
						_eq: 'published'
					},
					classification: {
						_eq: 'event'
					},
					_or: [
						{
							_and: [
								{
									starts_at: {
										_lte: new Date().toISOString()
									}
								},
								{
									ends_at: {
										_gte: new Date().toISOString()
									}
								}
							]
						},
						{
							_and: [
								{
									starts_at: {
										_gte: new Date().toISOString()
									}
								},
								{
									ends_at: {
										_null: true
									}
								}
							]
						},
						{
							_and: [
								{
									starts_at: {
										_gte: new Date().toISOString()
									}
								},
								{
									ends_at: {
										_gte: new Date().toISOString()
									}
								}
							]
						}
					]
				},
				sort: ['starts_at']
			})
		);

		const events = Array.isArray(response) ? response : [];
		return events.map((event) => ({
			...event,
			categories: event.categories.map((cat) => ({ ...cat.categories_id })),
			tags: event.tags.map((tag) => ({ ...tag.tags_id }))
		}));
	} catch (error) {
		console.error('Error fetching events:', error);
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
			readItems('categories', {
				fields: 'id,name,description,slug',
				filter: {
					status: {
						_eq: 'published'
					},
					events: {
						events_id: {
							_in: eventIds
						}
					}
				}
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
