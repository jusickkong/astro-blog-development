import { codeInput } from '@sanity/code-input';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { wideLayoutPlugin } from './src/sanity/plugins/wideLayout';
import { schemaTypes } from './src/sanity/schemaTypes';

function formatDraftSuffix(draftCount: number) {
	return draftCount > 0 ? ` (${draftCount} draft${draftCount === 1 ? '' : 's'})` : '';
}

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

				const projects = await client.fetch(
					`*[_type == "project"] | order(name asc) {
						_id,
						name,
						"draftCount": count(*[
							_type == "projectPost" &&
							_id in path("drafts.**") &&
							(project._ref == ^._id || projectSlug == ^.name)
						])
					}`,
				);

				const allProjectDraftCount = await client.fetch(
					`count(*[_type == "projectPost" && _id in path("drafts.**")])`,
				);

				const thoughtDraftCount = await client.fetch(
					`count(*[_type == "thought" && _id in path("drafts.**")])`,
				);

				return S.list()
					.id('root')
					.title('콘텐츠')
					.items([
						S.listItem()
							.id('projects')
							.title(`Projects${formatDraftSuffix(allProjectDraftCount)}`)
							.child(
								S.list()
									.id('project-list')
									.title(`Projects${formatDraftSuffix(allProjectDraftCount)}`)
									.items([
										...projects.map(
											(project: { _id: string; name: string; draftCount: number }) =>
												S.listItem()
													.id(project._id)
													.title(`${project.name}${formatDraftSuffix(project.draftCount)}`)
													.child(
														S.documentList()
															.id(`posts-${project._id}`)
															.title(
																`${project.name}${formatDraftSuffix(project.draftCount)}`,
															)
															.filter(
																'_type == "projectPost" && (project._ref == $projectId || projectSlug == $projectName)',
															)
															.params({
																projectId: project._id,
																projectName: project.name,
															})
															.defaultOrdering([
																{ field: 'pubDate', direction: 'desc' },
															]),
													),
										),
										S.divider(),
										S.listItem()
											.id('draft-project-posts')
											.title(`Drafts${formatDraftSuffix(allProjectDraftCount)}`)
											.child(
												S.documentList()
													.id('all-draft-project-posts')
													.title(`Project Drafts${formatDraftSuffix(allProjectDraftCount)}`)
													.filter('_type == "projectPost" && _id in path("drafts.**")')
													.defaultOrdering([
														{ field: '_updatedAt', direction: 'desc' },
													]),
											),
										S.listItem()
											.id('all-posts')
											.title('전체 글')
											.child(
												S.documentList()
													.id('all-project-posts')
													.title('전체 Project Posts')
													.filter('_type == "projectPost"')
													.defaultOrdering([
														{ field: 'pubDate', direction: 'desc' },
													]),
											),
									]),
							),
						S.listItem()
							.id('thought')
							.title(`Thoughts${formatDraftSuffix(thoughtDraftCount)}`)
							.child(
								S.documentList()
									.id('all-thoughts')
									.title(`Thoughts${formatDraftSuffix(thoughtDraftCount)}`)
									.filter('_type == "thought"')
									.defaultOrdering([{ field: 'pubDate', direction: 'desc' }]),
							),
					]);
			},
		}),
	],

	schema: {
		types: schemaTypes,
	},
});
