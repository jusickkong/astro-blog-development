import { defineField, defineType } from 'sanity';
import { bodyField } from './bodyField';

export const projectPost = defineType({
	name: 'projectPost',
	title: 'Project Post',
	type: 'document',
	fields: [
		defineField({
			name: 'project',
			title: '프로젝트',
			type: 'reference',
			to: [{ type: 'project' }],
			description: '소속 프로젝트를 선택하세요',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'projectSlug',
			title: 'projectSlug (구버전)',
			type: 'string',
			hidden: true, // 에디터에서 숨김 - 마이그레이션 후 데이터 정리용
		}),
		defineField({
			name: 'postSlug',
			title: '글 슬러그',
			type: 'slug',
			description: '글 이름만 입력 (예: 개요, 앱-사용법) — URL은 /project/[프로젝트]/[슬러그]/ 로 자동 조합',
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
			name: 'heroImage',
			title: '대표 이미지',
			type: 'image',
			options: {
				hotspot: true, // 이미지 크롭 및 포커스 포인트 지원
			},
			fields: [
				{
					name: 'alt',
					type: 'string',
					title: 'Alt 텍스트',
				},
			],
		}),
		defineField(bodyField as any),
	],
	preview: {
		select: {
			title: 'title',
			projectName: 'project.name',
			projectSlug: 'projectSlug',
			media: 'heroImage',
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		prepare(selection: any) {
			return {
				title: selection.title as string | undefined,
				subtitle: (selection.projectName || selection.projectSlug) as string | undefined,
				media: selection.media,
			};
		},
	},
});
