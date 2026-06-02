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
			description: 'Sanity와 사이트 화면에서 표시할 프로젝트 이름입니다.',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'slug',
			title: 'URL slug',
			type: 'slug',
			description: 'URL에 사용할 고정 주소입니다. 이름을 바꿔도 slug는 유지하는 편이 안전합니다.',
			options: {
				source: 'name',
				maxLength: 200,
				slugify: (input: string) =>
					input
						.toLowerCase()
						.trim()
						.replace(/[?]+/g, '')
						.replace(/\s+/g, '-')
						.replace(/[^a-z0-9\-가-힣]/g, '')
						.replace(/-+/g, '-')
						.replace(/^-|-$/g, ''),
			},
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
		select: { title: 'name', subtitle: 'slug.current' },
	},
});
