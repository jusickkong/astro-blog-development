/**
 * 기존 projectSlug 문자열 → project 참조로 연결하는 마이그레이션 스크립트
 *
 * 사용법:
 *   node --env-file=.env scripts/link-projects.mjs
 *
 * 순서:
 *   1. projectPost의 고유 projectSlug 값 수집
 *   2. 각 slug로 project 문서 생성 (이미 있으면 스킵)
 *   3. 각 projectPost에 project 참조 연결
 */

import { createClient } from '@sanity/client';

function toProjectSlug(value) {
	return value
		.toLowerCase()
		.trim()
		.replace(/[?]+/g, '')
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9\-가-힣]/g, '')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');
}

const client = createClient({
	projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
	token: process.env.SANITY_API_TOKEN,
	apiVersion: '2024-01-01',
	useCdn: false,
});

async function main() {
	if (!process.env.SANITY_API_TOKEN) {
		console.error('❌ SANITY_API_TOKEN 환경변수가 없습니다.');
		process.exit(1);
	}

	// 1. 기존 projectPost에서 고유 projectSlug 수집
	const posts = await client.fetch(
		`*[_type == "projectPost" && defined(projectSlug) && !defined(project)] {
      _id, projectSlug
    }`,
	);

	if (posts.length === 0) {
		console.log('✅ 마이그레이션할 항목이 없습니다. (이미 완료됐거나 projectSlug가 없음)');
		return;
	}

	const uniqueSlugs = [...new Set(posts.map((p) => p.projectSlug).filter(Boolean))];
	console.log(`\n📁 발견된 프로젝트: ${uniqueSlugs.join(', ')}\n`);

	// 2. project 문서 생성 또는 기존 것 조회
	const projectIdMap = {};

	for (const slug of uniqueSlugs) {
		// 이미 있는지 확인
		const existing = await client.fetch(
			`*[_type == "project" && name == $name][0]._id`,
			{ name: slug },
		);

		if (existing) {
			projectIdMap[slug] = existing;
			console.log(`  ⏩ 이미 존재: project "${slug}" (${existing})`);
		} else {
			const created = await client.create({
				_type: 'project',
				name: slug,
				slug: {
					_type: 'slug',
					current: toProjectSlug(slug),
				},
			});
			projectIdMap[slug] = created._id;
			console.log(`  ✅ 생성: project "${slug}" (${created._id})`);
		}
	}

	// 3. 각 projectPost에 project 참조 연결
	console.log(`\n🔗 ${posts.length}개 포스트에 project 참조 연결 중...\n`);

	const transaction = client.transaction();

	for (const post of posts) {
		const projectId = projectIdMap[post.projectSlug];
		if (!projectId) continue;

		transaction.patch(post._id, {
			set: {
				project: {
					_type: 'reference',
					_ref: projectId,
				},
			},
		});
	}

	await transaction.commit();
	console.log(`✨ 완료! ${posts.length}개 포스트가 project 참조로 연결되었습니다.`);
}

main().catch((err) => {
	console.error('❌ 오류:', err);
	process.exit(1);
});
