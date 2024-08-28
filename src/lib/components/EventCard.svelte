<script>
	import { marked } from 'marked';

	/** @type {{ id: string, title: string, description: string, starts_at: string, ends_at: string, external_link: string }} */
	let { event } = $props();

	let startDate = $state(new Date(event.starts_at));
	let endDate = $state(event.ends_at ? new Date(event.ends_at) : null);

	function formatDateTime(date) {
		return new Intl.DateTimeFormat('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
		}).format(date);
	}

	function formatTime(date) {
		return new Intl.DateTimeFormat('en-US', {
			hour: 'numeric',
			minute: 'numeric'
		}).format(date);
	}

	let displayDate = $derived(
		endDate === null
			? formatDateTime(startDate)
			: startDate.toDateString() === endDate.toDateString()
				? `${formatDateTime(startDate)} - ${formatTime(endDate)}`
				: `${formatDateTime(startDate)} - ${formatDateTime(endDate)}`
	);

	function truncateText(text, limit) {
		if (text.length <= limit) return text;
		return text.slice(0, limit).trim() + '...';
	}

	let parsedDescription = $derived(marked.parse(event.description));
	let truncatedDescription = $derived(truncateText(event.description, 400));
	let showFullDescription = $state(false);

	function toggleDescription() {
		showFullDescription = !showFullDescription;
	}
</script>

<article class="event-card">
	<h2>{event.title}</h2>
	<p class="event-date">{displayDate}</p>
	{#if showFullDescription}
		{@html parsedDescription}
	{:else}
		{@html marked.parse(truncatedDescription)}
		{#if event.description.length > 400}
			<button on:click={toggleDescription} class="read-more">Read more</button>
		{/if}
	{/if}
	{#if showFullDescription}
		<button on:click={toggleDescription} class="read-less">Show less</button>
	{/if}
	{#if event.external_link}
		<a class="button" href={event.external_link} target="_blank">More Info</a>
	{/if}
</article>

<style>
	.event-card {
		border: 1px solid #ccc;
		padding: 1rem;
		margin-bottom: 1rem;
		border-radius: 4px;
	}
	.event-date {
		font-weight: bold;
		color: #555;
	}
	.read-more,
	.read-less {
		background: none;
		border: none;
		color: #0066cc;
		cursor: pointer;
		padding: 0;
		font: inherit;
		text-decoration: underline;
	}
	:global(.event-card p) {
		margin-top: 0.5em;
		margin-bottom: 0.5em;
	}
	:global(.event-card ul, .event-card ol) {
		padding-left: 1.5em;
	}
</style>
