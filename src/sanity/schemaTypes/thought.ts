import { defineField, defineType } from 'sanity';
import { bodyField } from './bodyField';

export const thought = defineType({
	name: 'thought',
	title: 'Thought',
	type: 'document',
	fields: [
		defineField({
			name: 'slug',
			title: '슬러그',
			type: 'slug',
			description: 'URL 경로 (예: 첫번째-생각 → /thoughts/첫번째-생각/)',
			options: { source: 'title', maxLength: 200 },
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'title',
			title: '제목',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'description',
			title: '설명',
			type: 'text',
			rows: 2,
		}),
		defineField({
			name: 'metaDescription',
			title: 'Meta Description (SEO)',
			type: 'text',
			rows: 2,
		}),
		defineField({
			name: 'pubDate',
			title: '작성일',
			type: 'datetime',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'updatedDate',
			title: '수정일',
			type: 'datetime',
		}),
		defineField(bodyField as any),
	],
	preview: {
		select: {
			title: 'title',
			pubDate: 'pubDate',
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		prepare(selection: any) {
			const pubDate = selection.pubDate as string | undefined;
			return {
				title: selection.title as string | undefined,
				subtitle: pubDate ? new Date(pubDate).toLocaleDateString('ko-KR') : '',
			};
		},
	},
});
