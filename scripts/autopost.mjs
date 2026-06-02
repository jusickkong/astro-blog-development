#!/usr/bin/env node
/**
 * Sanity 자동 포스팅 스크립트
 * Claude Code가 생성한 JSON 콘텐츠를 Sanity에 바로 발행합니다.
 *
 * Usage:
 *   node --env-file=.env scripts/autopost.mjs <json-file>
 *
 * JSON 파일 형식 (thought):
 * {
 *   "type": "thought",
 *   "title": "제목",
 *   "slug": "url-slug",
 *   "description": "요약",
 *   "metaDescription": "SEO 설명",
 *   "body": [
 *     { "_type": "paragraph", "text": "본문" },
 *     { "_type": "heading", "level": 2, "text": "소제목" },
 *     { "_type": "bulletList", "items": ["항목1", "항목2"] },
 *     { "_type": "numberedList", "items": ["항목1", "항목2"] },
 *     { "_type": "blockquote", "text": "인용구" },
 *     { "_type": "code", "language": "javascript", "code": "코드" }
 *   ]
 * }
 *
 * JSON 파일 형식 (project post):
 * {
 *   "type": "project",
 *   "project": "프로젝트명 또는 slug",
 *   "title": "제목",
 *   "postSlug": "url-slug",
 *   "description": "요약",
 *   "metaDescription": "SEO 설명",
 *   "body": [ ... ]
 * }
 */

import { createClient } from '@sanity/client';
import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';

// ─── 환경 변수 확인 ───────────────────────────────────────────────────────────

const missing = ['PUBLIC_SANITY_PROJECT_ID', 'SANITY_API_TOKEN'].filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing env vars: ${missing.join(', ')}`);
  process.exit(1);
}

// ─── 클라이언트 초기화 ────────────────────────────────────────────────────────

const sanity = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// ─── 인자 파싱 ────────────────────────────────────────────────────────────────

const [, , jsonFile] = process.argv;

if (!jsonFile) {
  console.error('Usage: npm run autopost <json-file>');
  process.exit(1);
}

let content;
try {
  content = JSON.parse(readFileSync(jsonFile, 'utf-8'));
} catch (e) {
  console.error(`JSON 파일을 읽을 수 없습니다: ${jsonFile}\n${e.message}`);
  process.exit(1);
}

// ─── Portable Text 변환 ───────────────────────────────────────────────────────

function key() {
  return randomUUID().replace(/-/g, '').slice(0, 12);
}

function toPortableText(blocks) {
  return blocks.flatMap((block) => {
    if (block._type === 'paragraph') {
      return {
        _type: 'block',
        _key: key(),
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: key(), text: block.text, marks: [] }],
      };
    }
    if (block._type === 'heading') {
      return {
        _type: 'block',
        _key: key(),
        style: `h${block.level ?? 2}`,
        markDefs: [],
        children: [{ _type: 'span', _key: key(), text: block.text, marks: [] }],
      };
    }
    if (block._type === 'blockquote') {
      return {
        _type: 'block',
        _key: key(),
        style: 'blockquote',
        markDefs: [],
        children: [{ _type: 'span', _key: key(), text: block.text, marks: [] }],
      };
    }
    if (block._type === 'code') {
      return {
        _type: 'code',
        _key: key(),
        language: block.language || 'text',
        code: block.code,
      };
    }
    if (block._type === 'bulletList') {
      return block.items.map((item) => ({
        _type: 'block',
        _key: key(),
        style: 'normal',
        listItem: 'bullet',
        level: 1,
        markDefs: [],
        children: [{ _type: 'span', _key: key(), text: item, marks: [] }],
      }));
    }
    if (block._type === 'numberedList') {
      return block.items.map((item) => ({
        _type: 'block',
        _key: key(),
        style: 'normal',
        listItem: 'number',
        level: 1,
        markDefs: [],
        children: [{ _type: 'span', _key: key(), text: item, marks: [] }],
      }));
    }
    return [];
  });
}

// ─── 발행 ─────────────────────────────────────────────────────────────────────

const body = toPortableText(content.body || []);
const pubDate = new Date().toISOString();

if (content.type === 'thought') {
  const doc = {
    _type: 'thought',
    title: content.title,
    slug: { _type: 'slug', current: content.slug },
    description: content.description,
    metaDescription: content.metaDescription,
    pubDate,
    body,
  };

  console.log(`\n📝 Thought 발행 중...`);
  console.log(`   제목: ${doc.title}`);
  console.log(`   슬러그: ${doc.slug.current}`);
  console.log(`   본문 블록: ${body.length}개`);

  const result = await sanity.create(doc);
  console.log(`\n✅ 발행 완료: ${result._id}`);
  console.log(`   → https://www.dev-outpost.com/thoughts/${doc.slug.current}/`);

} else if (content.type === 'project') {
  const project = await sanity.fetch(
    `*[_type == "project" && (name == $name || slug.current == $name)][0] { _id, name, "slug": slug.current }`,
    { name: content.project },
  );

  if (!project) {
    console.error(`프로젝트를 찾을 수 없습니다: "${content.project}"`);
    process.exit(1);
  }

  const doc = {
    _type: 'projectPost',
    project: { _type: 'reference', _ref: project._id },
    title: content.title,
    postSlug: { _type: 'slug', current: content.postSlug },
    description: content.description,
    metaDescription: content.metaDescription,
    pubDate,
    body,
  };

  console.log(`\n📝 Project Post 발행 중...`);
  console.log(`   프로젝트: ${project.name}`);
  console.log(`   제목: ${doc.title}`);
  console.log(`   슬러그: ${doc.postSlug.current}`);
  console.log(`   본문 블록: ${body.length}개`);

  const result = await sanity.create(doc);
  console.log(`\n✅ 발행 완료: ${result._id}`);
  console.log(`   → https://www.dev-outpost.com/project/${project.slug}/${doc.postSlug.current}/`);

} else {
  console.error(`알 수 없는 type: "${content.type}" (thought 또는 project 만 가능)`);
  process.exit(1);
}
