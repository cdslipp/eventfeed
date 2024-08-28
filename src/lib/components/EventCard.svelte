<script>
	/** @type {{ title: string, description: string, starts_at: string, ends_at: string, external_link: string }} */
	let { event } = $props();

	let startDate = $state(new Date(event.starts_at));
	let endDate = $state(new Date(event.ends_at));

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
		startDate.toDateString() === endDate.toDateString()
			? `${formatDateTime(startDate)} - ${formatTime(endDate)}`
			: `${formatDateTime(startDate)} - ${formatDateTime(endDate)}`
	);
</script>

<div class="event-card">
	<h2>{event.title}</h2>
	<p class="event-date">{displayDate}</p>
	<p>{event.description}</p>
	{#if event.external_link}
		<a href={event.external_link} target="_blank" rel="noopener noreferrer">More Info</a>
	{/if}
</div>

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
</style>
