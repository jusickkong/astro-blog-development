import rss from '@astrojs/rss';
import { getAllArticles, getAllProjectPosts } from '../lib/sanity';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
	const [posts, articles] = await Promise.all([getAllProjectPosts(), getAllArticles()]);
	const items = [
		...posts.map((post) => ({
			title: post.title,
			description: post.description ?? '',
			pubDate: new Date(post.pubDate),
			link: `/project/${post.projectSlug}/${post.postSlug.current}/`,
		})),
		...articles.map((article) => ({
			title: article.title,
			description: article.description ?? '',
			pubDate: new Date(article.pubDate),
			link: `/${article.channel}/${article.slug.current}/`,
		})),
	];
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: items.sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf()),
	});
}
