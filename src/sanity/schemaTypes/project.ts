import { defineField, defineType } from 'sanity';

export const project = defineType({
	name: 'project',
	title: 'Project',
	type: 'document',
	fields: [
		defineField({
			name: 'name',
			title: '프로젝트 이름',
			type: 'string',
			description: 'URL 경로에 사용됩니다 (예: 캐시백트래커 → /project/캐시백트래커/)',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'description',
			title: '프로젝트 설명',
			type: 'text',
			rows: 2,
		}),
	],
	preview: {
		select: { title: 'name' },
	},
});
