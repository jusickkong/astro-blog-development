import { createClient } from '@sanity/client';

const explicitSlugMap = {
	'진짜얼마?': 'real-price-calculator',
};

function toProjectSlug(value) {
	const overridden = explicitSlugMap[value];
	if (overridden) return overridden;

	return value
		.toLowerCase()
		.trim()
		.replace(/[?]+/g, '')
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9\-가-힣]/g, '')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');
}

const client = createClient({
	projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
	token: process.env.SANITY_API_TOKEN,
	apiVersion: '2024-01-01',
	useCdn: false,
});

async function main() {
	if (!process.env.SANITY_API_TOKEN) {
		console.error('SANITY_API_TOKEN 환경 변수가 없습니다.');
		process.exit(1);
	}

	const projects = await client.fetch(
		`*[_type == "project"]{
			_id,
			name,
			slug
		}`,
	);

	const patches = projects
		.filter((project) => !project.slug?.current && project.name)
		.map((project) => ({
			id: project._id,
			name: project.name,
			slug: toProjectSlug(project.name),
		}))
		.filter((project) => project.slug);

	if (patches.length === 0) {
		console.log('slug를 채울 project 문서가 없습니다.');
		return;
	}

	for (const project of patches) {
		await client.patch(project.id).set({ slug: { _type: 'slug', current: project.slug } }).commit();
		console.log(`Updated ${project.name} -> ${project.slug}`);
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
