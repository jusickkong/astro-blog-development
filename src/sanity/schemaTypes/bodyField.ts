import { ImageBlockInput } from '../components/ImageBlockInput';
import { ImageBlockPreview } from '../components/ImageBlockPreview';

export const bodyField = {
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
				{ title: 'H5', value: 'h5' },
				{ title: '인용구', value: 'blockquote' },
			],
			lists: [
				{ title: '불릿 목록', value: 'bullet' },
				{ title: '번호 목록', value: 'number' },
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
								validation: (Rule: any) =>
									Rule.uri({ scheme: ['http', 'https', 'mailto'] }),
							},
							{
								name: 'blank',
								type: 'boolean',
								title: '새 탭에서 열기',
								initialValue: true,
							},
						],
					},
					{
						name: 'textColor',
						type: 'object',
						title: '텍스트 색상',
						fields: [
							{
								name: 'color',
								type: 'string',
								title: '색상',
								options: {
									list: [
										{ title: '빨강', value: '#e53e3e' },
										{ title: '주황', value: '#dd6b20' },
										{ title: '초록', value: '#38a169' },
										{ title: '파랑', value: '#3182ce' },
										{ title: '보라', value: '#805ad5' },
										{ title: '회색', value: '#718096' },
									],
								},
							},
						],
					},
					{
						name: 'highlight',
						type: 'object',
						title: '하이라이트',
						fields: [
							{
								name: 'color',
								type: 'string',
								title: '배경 색상',
								options: {
									list: [
										{ title: '노랑', value: '#fefcbf' },
										{ title: '초록', value: '#c6f6d5' },
										{ title: '파랑', value: '#bee3f8' },
										{ title: '분홍', value: '#fed7e2' },
									],
								},
							},
						],
					},
				],
			},
		},
		{
			type: 'image',
			options: { hotspot: true },
			components: {
				input: ImageBlockInput,
				preview: ImageBlockPreview,
			},
			fields: [
				{
					name: 'alt',
					type: 'string',
					title: 'Alt 텍스트',
				},
				{
					name: 'caption',
					type: 'string',
					title: '이미지 설명 (캡션)',
				},
				{
					name: 'align',
					type: 'string',
					title: '정렬',
					options: {
						list: [
							{ title: '왼쪽', value: 'left' },
							{ title: '가운데', value: 'center' },
							{ title: '오른쪽', value: 'right' },
						],
						layout: 'radio',
					},
					initialValue: 'center',
				},
				{
					name: 'width',
					type: 'string',
					title: '빠른 프리셋',
					description: '기존 방식. 필요하면 아래 커스텀 폭(px)으로 더 세밀하게 조절하세요.',
					options: {
						list: [
							{ title: '소 (400px)', value: 'sm' },
							{ title: '중 (600px)', value: 'md' },
							{ title: '대 (800px)', value: 'lg' },
							{ title: '전체 너비', value: 'full' },
						],
						layout: 'radio',
					},
					initialValue: 'lg',
				},
				{
					name: 'widthPx',
					type: 'number',
					title: '커스텀 폭 (px)',
					description: '예: 320, 480, 560, 720. 비워두면 위 프리셋 값을 사용합니다.',
					validation: (Rule: any) => Rule.min(120).max(1400).integer(),
				},
			],
		},
		{
			name: 'imageRow',
			type: 'object',
			title: '이미지 행',
			fields: [
				{
					name: 'images',
					type: 'array',
					title: '이미지들',
					validation: (Rule: any) => Rule.required().min(2).max(3),
					of: [
						{
							type: 'image',
							options: { hotspot: true },
							fields: [
								{ name: 'alt', type: 'string', title: 'Alt 텍스트' },
								{ name: 'caption', type: 'string', title: '캡션' },
							],
						},
					],
				},
				{
					name: 'gap',
					type: 'string',
					title: '간격',
					options: {
						list: [
							{ title: '좁게', value: 'sm' },
							{ title: '보통', value: 'md' },
							{ title: '넓게', value: 'lg' },
						],
						layout: 'radio',
					},
					initialValue: 'md',
				},
			],
			preview: {
				select: {
					images: 'images',
					gap: 'gap',
				},
				prepare({ images, gap }: { images?: unknown[]; gap?: string }) {
					const count = images?.length ?? 0;
					return {
						title: `이미지 행 (${count})`,
						subtitle: `간격: ${gap ?? 'md'}`,
						media: images?.[0],
					};
				},
			},
		},
		{
			type: 'code',
			options: {
				language: 'javascript',
				languageAlternatives: [
					{ title: 'JavaScript', value: 'javascript' },
					{ title: 'TypeScript', value: 'typescript' },
					{ title: 'HTML', value: 'html' },
					{ title: 'CSS', value: 'css' },
					{ title: 'Python', value: 'python' },
					{ title: 'Shell', value: 'sh' },
					{ title: 'JSON', value: 'json' },
					{ title: 'Markdown', value: 'markdown' },
					{ title: '기타', value: 'text' },
				],
				withFilename: true,
			},
		},
	],
};
