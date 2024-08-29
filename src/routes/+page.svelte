<script>
	import { fade, fly } from 'svelte/transition';
	import EventCard from '$lib/components/EventCard.svelte';
	/** @type {import('./$types').PageData} */
	let { data } = $props();

	let selectedTags = $state([]);

	function mapTags(events) {
		const tagMap = new Map();
		events.forEach((event) => {
			event.tags.forEach((tag) => {
				if (!tagMap.has(tag.id)) {
					tagMap.set(tag.id, tag);
				}
			});
		});
		return Array.from(tagMap.values());
	}

	let allTags = $derived(mapTags(data.events));

	let filteredEvents = $derived(
		data.events.filter((event) =>
			selectedTags.length === 0 ? true : event.tags.some((tag) => selectedTags.includes(tag.id))
		)
	);

	function toggleTag(tagId) {
		console.log(tagId);
		selectedTags = selectedTags.includes(tagId)
			? selectedTags.filter((id) => id !== tagId)
			: [...selectedTags, tagId];
	}

	console.log(allTags);
</script>

<nav>
	<h1>Upcoming Events</h1>
</nav>

<div class="tag-filter">
	{#each allTags as tag (tag.id)}
		<button class:selected={selectedTags.includes(tag.id)} on:click={() => toggleTag(tag.id)}>
			{tag.name}
		</button>
	{/each}
</div>

{#if filteredEvents.length > 0}
	{#each filteredEvents as event (event.id)}
		<div>
			<EventCard {event} />
		</div>
	{/each}
{:else}
	<p>No events found for the selected tags.</p>
{/if}

<style>
	nav {
		padding-top: 3rem;
		padding-bottom: 1rem;
	}
	.tag-filter {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}
	button {
		padding: 0.5rem 1rem;
		border: 2px solid #ccc; /* Stronger border */
		border-radius: 20px;
		background-color: #f0f0f0;
		color: #333; /* Darker gray for unselected state */
		cursor: pointer;
		transition: all 0.3s ease;
		font-weight: 500; /* Slightly bolder font */
	}

	button:hover {
		background-color: #e0e0e0;
		border-color: #999;
	}

	button.selected {
		background-color: #007bff;
		color: white;
		border-color: #0056b3;
	}
</style>
