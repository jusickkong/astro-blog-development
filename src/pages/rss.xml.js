import rss from '@astrojs/rss';
import { getAllProjectPosts } from '../lib/sanity';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
	const posts = await getAllProjectPosts();
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			title: post.title,
			description: post.description ?? '',
			pubDate: new Date(post.pubDate),
			link: `/project/${post.projectSlug}/${post.postSlug.current}/`,
		})),
	});
}
