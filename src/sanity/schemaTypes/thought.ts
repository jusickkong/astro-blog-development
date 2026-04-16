import { defineField, defineType } from 'sanity';

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
		defineField({
			name: 'body',
			title: '본문',
			type: 'array',
			of: [
				{
					type: 'block',
					styles: [
						{ title: '본문', value: 'normal' },
						{ title: 'H1', value: 'h1' },
						{ title: 'H2', value: 'h2' },
						{ title: 'H3', value: 'h3' },
						{ title: 'H4', value: 'h4' },
						{ title: '인용구', value: 'blockquote' },
					],
					marks: {
						decorators: [
							{ title: '굵게', value: 'strong' },
							{ title: '기울임', value: 'em' },
							{ title: '코드', value: 'code' },
							{ title: '밑줄', value: 'underline' },
							{ title: '취소선', value: 'strike-through' },
						],
						annotations: [
							{
								name: 'link',
								type: 'object',
								title: '링크',
								fields: [
									{
										name: 'href',
										type: 'url',
										title: 'URL',
										validation: (Rule) =>
											Rule.uri({ scheme: ['http', 'https', 'mailto'] }),
									},
									{
										name: 'blank',
										type: 'boolean',
										title: '새 탭에서 열기',
									},
								],
							},
						],
					},
				},
				{
					type: 'image',
					options: { hotspot: true },
					fields: [
						{
							name: 'alt',
							type: 'string',
							title: 'Alt 텍스트',
						},
						{
							name: 'caption',
							type: 'string',
							title: '이미지 설명',
						},
					],
				},
			],
		}),
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
