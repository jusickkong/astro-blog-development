import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { codeInput } from '@sanity/code-input';
import { schemaTypes } from './src/sanity/schemaTypes';
import { wideLayoutPlugin } from './src/sanity/plugins/wideLayout';

export default defineConfig({
	name: 'dev-outpost',
	title: 'Dev Outpost',

	projectId: '9nsnhcwi',
	dataset: 'production',

	plugins: [
		wideLayoutPlugin(),
		codeInput(),
		structureTool({
			structure: async (S, context) => {
				const { getClient } = context;
				const client = getClient({ apiVersion: '2024-01-01' });

				// 모든 project 문서 가져오기
				const projects = await client.fetch(
					`*[_type == "project"] | order(name asc) { _id, name }`,
				);

				return S.list()
					.id('root')
					.title('콘텐츠')
					.items([
						// Projects → 프로젝트별 글 목록
						S.listItem()
							.id('projects')
							.title('Projects')
							.child(
								S.list()
									.id('project-list')
									.title('Projects')
									.items([
										// 각 프로젝트를 클릭하면 해당 프로젝트의 글 목록
										...projects.map((project: { _id: string; name: string }) =>
											S.listItem()
												.id(project._id)
												.title(project.name)
												.child(
													S.documentList()
														.id(`posts-${project._id}`)
														.title(project.name)
														.filter(
															'_type == "projectPost" && (project._ref == $projectId || projectSlug == $projectName)'
														)
														.params({
															projectId: project._id,
															projectName: project.name,
														})
														.defaultOrdering([{ field: 'pubDate', direction: 'desc' }])
												)
										),
										S.divider(),
										// 전체 글 보기
										S.listItem()
											.id('all-posts')
											.title('전체 글')
											.child(
												S.documentList()
													.id('all-project-posts')
													.title('전체 Project Posts')
													.filter('_type == "projectPost"')
													.defaultOrdering([{ field: 'pubDate', direction: 'desc' }])
											),
									])
							),

						// Thoughts
						S.listItem()
							.id('thought')
							.title('Thoughts')
							.child(
								S.documentList()
									.id('all-thoughts')
									.title('Thoughts')
									.filter('_type == "thought"')
									.defaultOrdering([{ field: 'pubDate', direction: 'desc' }])
							),
					]);
			},
		}),
	],

	schema: {
		types: schemaTypes,
	},
});
