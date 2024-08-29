<script>
	import { marked } from 'marked';

	/** @type {{
		id: string,
		title: string,
		description: string,
		starts_at: string,
		ends_at: string,
		external_link: string,
		image_url: string,
		tags: Array<{ id: number, name: string }>
	}} */
	let { event } = $props();

	let startDate = $state(new Date(event.starts_at));
	let endDate = $state(event.ends_at ? new Date(event.ends_at) : null);
	let modalOpen = $state(false);

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
		text = marked.parse(text);
		if (text.length <= limit) return text;
		return text.slice(0, limit).trim() + '...';
	}

	let parsedDescription = $derived(marked.parse(event.description));
	let truncatedDescription = $derived(truncateText(event.description, 200));

	function openModal() {
		modalOpen = true;
	}

	function closeModal() {
		modalOpen = false;
	}

	console.log(event);
</script>

{#snippet eventModal()}
	<article class="modal-card">
		<header>
			<button aria-label="Close" rel="prev" on:click={closeModal}></button>
			<h2>{event.title}</h2>
			<p class="event-date">{displayDate}</p>
		</header>
		{@html parsedDescription}
		{#if event.external_link}
			<footer>
				<a class="button" href={event.external_link} target="_blank">Learn More</a>
			</footer>
		{/if}
	</article>
{/snippet}

<article class="event-card" on:click={openModal}>
	<div class="event-content">
		{#if event.image_url}
			<img src={event.image_url} alt={event.title} class="event-image" />
		{/if}
		<div class="event-details">
			<h2>{event.title}</h2>
			<p class="event-date">{displayDate}</p>
			{#if truncatedDescription}
				<div class="description">
					<!-- {@html truncatedDescription} -->
				</div>
			{/if}
			{#if event.external_link}
				<div class="button-container">
					<a class="button" href={event.external_link} target="_blank" on:click|stopPropagation>
						Learn More
					</a>
				</div>
			{/if}
		</div>
	</div>
</article>

<dialog class="modal" open={modalOpen}>
	{@render eventModal()}
</dialog>

<style>
	.event-card {
		border: 1px solid #ccc;
		padding: 1rem;
		margin-bottom: 1rem;
		border-radius: 12px;
		cursor: pointer;
		transition: transform 0.3s ease;
	}

	.event-card:hover {
		transform: translate(-2px, -2px);
	}

	.event-content {
		display: flex;
		gap: 1rem;
	}

	.event-image {
		max-width: 200px;
		height: auto;
		object-fit: cover;
	}

	.event-details {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.event-date {
		font-weight: bold;
		color: #555;
	}

	.modal-card {
		max-width: 800px;
		min-width: 60dvw;
	}

	.button-container {
		display: flex;
		justify-content: flex-end;
		margin-top: 1rem;
	}

	.button {
		padding: 0.5rem 1rem;
		background-color: #0066cc;
		color: white;
		text-decoration: none;
		border-radius: 4px;
		transition: background-color 0.3s ease;
	}

	.button:hover {
		background-color: #0052a3;
	}
</style>
