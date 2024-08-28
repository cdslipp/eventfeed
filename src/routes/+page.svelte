<script>
	import EventCard from '$lib/components/EventCard.svelte';
	/** @type {import('./$types').PageData} */
	let { data } = $props();
</script>

<nav>
	<h1>Upcoming Events</h1>
</nav>

{#if data.events && data.events.length > 0}
	{#each data.events as event (event.id)}
		<EventCard {event} />
	{/each}
{:else}
	<p>No events found.</p>
{/if}

<style>
	nav {
		padding-top: 3rem;
		padding-bottom: 1rem;
	}
</style>
