export interface Event {
	id: number;
	status: string;
	sort: number | null;
	user_created: string;
	date_created: string;
	user_updated: string;
	date_updated: string;
	title: string;
	description: string;
	external_link: string;
	link_text: string;
	price: string | null;
	registration_required: boolean;
	featured: boolean | null;
	slug: string;
	image: Image | null;
	location: Location | null;
	data_source: number;
	location_source_text: string;
	classification: string;
	starts_at: string;
	ends_at: string;
	image_url: string | null;
	tags: Tag[];
	categories: Category[];
}

export interface Tag {
	id: number;
	name: string;
	slug: string;
	description: string | null;
}

export interface Category {
	id: number;
	name: string;
	slug: string;
	description: string | null;
}

export interface Image {
	id: string;
	storage: string;
	filename_disk: string;
	filename_download: string;
	title: string;
	type: string;
	folder: string | null;
	uploaded_by: string;
	uploaded_on: string;
	modified_by: string;
	modified_on: string;
	charset: string | null;
	filesize: number;
	width: number;
	height: number;
	duration: number | null;
	embed: string | null;
	description: string | null;
	location: string | null;
	tags: string | null;
	metadata: Record<string, unknown>;
}

export interface Location {
	id: number;
	status: string;
	sort: number | null;
	user_created: string;
	date_created: string;
	user_updated: string;
	date_updated: string;
	name: string;
	description: string | null;
	address: string | null;
	city: string | null;
	province: string | null;
	postal_code: string | null;
	country: string | null;
	latitude: number | null;
	longitude: number | null;
	map_point: {
		type: string;
		coordinates: [number, number];
	} | null;
}
