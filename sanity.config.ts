import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schemaTypes';

export default defineConfig({
	name: 'dev-outpost',
	title: 'Dev Outpost',

	projectId: '9nsnhcwi',
	dataset: 'production',

	plugins: [
		structureTool({
			structure: (S) =>
				S.list()
					.id('root')
					.title('콘텐츠')
					.items([
						S.listItem()
							.id('projectPost')
							.title('Projects')
							.child(
								S.documentList()
									.title('Project Posts')
									.filter('_type == "projectPost"')
									.defaultOrdering([{ field: 'pubDate', direction: 'desc' }])
							),
						S.listItem()
							.id('thought')
							.title('Thoughts')
							.child(
								S.documentList()
									.title('Thoughts')
									.filter('_type == "thought"')
									.defaultOrdering([{ field: 'pubDate', direction: 'desc' }])
							),
					]),
		}),
	],

	schema: {
		types: schemaTypes,
	},
});
