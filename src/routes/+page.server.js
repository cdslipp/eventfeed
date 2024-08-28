import { login, getEvents } from '$lib/directus';
import { error } from '@sveltejs/kit';
import { DIRECTUS_EMAIL, DIRECTUS_PASSWORD } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	const email = DIRECTUS_EMAIL;
	const password = DIRECTUS_PASSWORD;

	if (!email || !password) {
		console.error('Directus credentials not found in environment variables');
		throw error(500, 'Server configuration error');
	}

	try {
		await login(email, password);
		const events = await getEvents();
		return { events };
	} catch (err) {
		console.error('Error in load function:', err);
		throw error(500, 'Failed to fetch events');
	}
}
