<script>
	import EventCard from '$lib/components/EventCard.svelte';

	/** @type {import('./$types').PageData} */
	let { data } = $props();
</script>

<h1>Upcoming Events</h1>

{#if data.events && data.events.length > 0}
	{#each data.events as event (event.title)}
		<EventCard {event} />
	{/each}
{:else}
	<p>No events found.</p>
{/if}
