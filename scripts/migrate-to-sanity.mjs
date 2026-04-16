/**
 * 기존 마크다운 파일 → Sanity 마이그레이션 스크립트
 *
 * 사용법:
 *   1. .env 파일에 SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_TOKEN 설정
 *   2. node scripts/migrate-to-sanity.mjs
 *
 * ⚠️  중복 실행해도 slug 기반으로 중복 체크하므로 안전합니다.
 */

import { createClient } from '@sanity/client';
import matter from 'gray-matter';
import { readdir, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ─── Sanity 클라이언트 (쓰기 권한 토큰 필요) ────────────────────────────────
const client = createClient({
	projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
	token: process.env.SANITY_API_TOKEN, // Editor 권한 이상 필요
	apiVersion: '2024-01-01',
	useCdn: false,
});

// ─── 마크다운 → Portable Text 변환 (기본) ────────────────────────────────────
function markdownToPortableText(markdown) {
	const lines = markdown.split('\n');
	const blocks = [];
	let key = 0;

	const nextKey = () => `block${key++}`;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];

		// 빈 줄 스킵
		if (!line.trim()) continue;

		// 헤딩
		const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
		if (headingMatch) {
			const level = headingMatch[1].length;
			const text = headingMatch[2];
			blocks.push({
				_type: 'block',
				_key: nextKey(),
				style: `h${level}`,
				children: [{ _type: 'span', _key: nextKey(), text, marks: [] }],
				markDefs: [],
			});
			continue;
		}

		// 불릿 리스트
		const bulletMatch = line.match(/^[-*+]\s+(.+)$/);
		if (bulletMatch) {
			blocks.push({
				_type: 'block',
				_key: nextKey(),
				style: 'normal',
				listItem: 'bullet',
				level: 1,
				children: [{ _type: 'span', _key: nextKey(), text: bulletMatch[1], marks: [] }],
				markDefs: [],
			});
			continue;
		}

		// 번호 리스트
		const numberMatch = line.match(/^\d+\.\s+(.+)$/);
		if (numberMatch) {
			blocks.push({
				_type: 'block',
				_key: nextKey(),
				style: 'normal',
				listItem: 'number',
				level: 1,
				children: [{ _type: 'span', _key: nextKey(), text: numberMatch[1], marks: [] }],
				markDefs: [],
			});
			continue;
		}

		// 인용구
		const blockquoteMatch = line.match(/^>\s+(.+)$/);
		if (blockquoteMatch) {
			blocks.push({
				_type: 'block',
				_key: nextKey(),
				style: 'blockquote',
				children: [{ _type: 'span', _key: nextKey(), text: blockquoteMatch[1], marks: [] }],
				markDefs: [],
			});
			continue;
		}

		// 일반 문단 (인라인 마크 처리)
		const { children, markDefs } = parseInline(line, nextKey);
		if (children.length > 0) {
			blocks.push({
				_type: 'block',
				_key: nextKey(),
				style: 'normal',
				children,
				markDefs,
			});
		}
	}

	return blocks;
}

function parseInline(text, nextKey) {
	const markDefs = [];
	const children = [];

	// 간단한 인라인 파서: **bold**, *italic*, `code`, [text](url)
	const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\))/g;
	let lastIndex = 0;
	let match;

	while ((match = regex.exec(text)) !== null) {
		// 매치 이전 텍스트
		if (match.index > lastIndex) {
			const plain = text.slice(lastIndex, match.index);
			if (plain) {
				children.push({ _type: 'span', _key: nextKey(), text: plain, marks: [] });
			}
		}

		if (match[2]) {
			// **bold**
			children.push({ _type: 'span', _key: nextKey(), text: match[2], marks: ['strong'] });
		} else if (match[3]) {
			// *italic*
			children.push({ _type: 'span', _key: nextKey(), text: match[3], marks: ['em'] });
		} else if (match[4]) {
			// `code`
			children.push({ _type: 'span', _key: nextKey(), text: match[4], marks: ['code'] });
		} else if (match[5] && match[6]) {
			// [text](url)
			const linkKey = nextKey();
			markDefs.push({ _key: linkKey, _type: 'link', href: match[6] });
			children.push({ _type: 'span', _key: nextKey(), text: match[5], marks: [linkKey] });
		}

		lastIndex = match.index + match[0].length;
	}

	// 나머지 텍스트
	if (lastIndex < text.length) {
		const remaining = text.slice(lastIndex);
		if (remaining) {
			children.push({ _type: 'span', _key: nextKey(), text: remaining, marks: [] });
		}
	}

	return { children, markDefs };
}

// ─── 프로젝트 포스트 마이그레이션 ────────────────────────────────────────────
async function migrateProjectPosts() {
	const projectDir = join(ROOT, 'src/content/project');
	let entries;
	try {
		entries = await readdir(projectDir, { withFileTypes: true });
	} catch {
		console.log('src/content/project 폴더가 없습니다. 스킵합니다.');
		return;
	}

	for (const projectFolder of entries) {
		if (!projectFolder.isDirectory()) continue;
		const projectSlug = projectFolder.name;
		const postFiles = await readdir(join(projectDir, projectSlug));

		for (const file of postFiles) {
			if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;

			const filePath = join(projectDir, projectSlug, file);
			const raw = await readFile(filePath, 'utf-8');
			const { data: frontmatter, content } = matter(raw);

			const postSlug = file.replace(/\.(md|mdx)$/, '');

			// 중복 체크
			const existing = await client.fetch(
				`*[_type == "projectPost" && projectSlug == $projectSlug && postSlug.current == $postSlug][0]._id`,
				{ projectSlug, postSlug },
			);
			if (existing) {
				console.log(`  ⏩ 이미 존재: ${projectSlug}/${postSlug}`);
				continue;
			}

			const doc = {
				_type: 'projectPost',
				projectSlug,
				postSlug: { _type: 'slug', current: postSlug },
				title: frontmatter.title || postSlug,
				description: frontmatter.description || undefined,
				metaDescription: frontmatter.metaDescription || undefined,
				pubDate: frontmatter.pubDate
					? new Date(frontmatter.pubDate).toISOString()
					: new Date().toISOString(),
				updatedDate: frontmatter.updatedDate
					? new Date(frontmatter.updatedDate).toISOString()
					: undefined,
				body: content.trim() ? markdownToPortableText(content) : [],
			};

			await client.create(doc);
			console.log(`  ✅ 생성: ${projectSlug}/${postSlug}`);
		}
	}
}

// ─── Thoughts 마이그레이션 ────────────────────────────────────────────────────
async function migrateThoughts() {
	const thoughtsDir = join(ROOT, 'src/content/thoughts');
	let files;
	try {
		files = await readdir(thoughtsDir);
	} catch {
		console.log('src/content/thoughts 폴더가 없습니다. 스킵합니다.');
		return;
	}

	for (const file of files) {
		if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;

		const filePath = join(thoughtsDir, file);
		const raw = await readFile(filePath, 'utf-8');
		const { data: frontmatter, content } = matter(raw);

		const slug = file.replace(/\.(md|mdx)$/, '');

		// 중복 체크
		const existing = await client.fetch(
			`*[_type == "thought" && slug.current == $slug][0]._id`,
			{ slug },
		);
		if (existing) {
			console.log(`  ⏩ 이미 존재: thoughts/${slug}`);
			continue;
		}

		const doc = {
			_type: 'thought',
			slug: { _type: 'slug', current: slug },
			title: frontmatter.title || slug,
			description: frontmatter.description || undefined,
			metaDescription: frontmatter.metaDescription || undefined,
			pubDate: frontmatter.pubDate
				? new Date(frontmatter.pubDate).toISOString()
				: new Date().toISOString(),
			updatedDate: frontmatter.updatedDate
				? new Date(frontmatter.updatedDate).toISOString()
				: undefined,
			body: content.trim() ? markdownToPortableText(content) : [],
		};

		await client.create(doc);
		console.log(`  ✅ 생성: thoughts/${slug}`);
	}
}

// ─── 실행 ─────────────────────────────────────────────────────────────────────
async function main() {
	if (!process.env.PUBLIC_SANITY_PROJECT_ID) {
		console.error('❌ PUBLIC_SANITY_PROJECT_ID 환경변수가 없습니다.');
		console.error('   .env 파일을 확인하세요.');
		process.exit(1);
	}
	if (!process.env.SANITY_API_TOKEN) {
		console.error('❌ SANITY_API_TOKEN 환경변수가 없습니다.');
		console.error('   Sanity Studio > Settings > API > Tokens에서 생성하세요.');
		process.exit(1);
	}

	console.log('🚀 마이그레이션 시작...\n');
	console.log('📁 Project Posts');
	await migrateProjectPosts();

	console.log('\n💭 Thoughts');
	await migrateThoughts();

	console.log('\n✨ 마이그레이션 완료!');
}

main().catch((err) => {
	console.error('❌ 오류:', err);
	process.exit(1);
});
