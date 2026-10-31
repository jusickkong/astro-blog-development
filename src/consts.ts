// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Spax Outpost';
export const SITE_DESCRIPTION = '세상 이야기, 쓸 만한 프로그램, 직접 만든 앱';

// article 문서의 채널. value가 곧 URL 경로(/issues/, /tools/)이며 agent/agent.py의 CHANNELS와 맞춰야 한다.
export const CHANNELS = [
	{ value: 'issues', title: '시사·문화', description: '시사, 사회, 문화 이슈를 정리합니다.' },
	{ value: 'tools', title: '프로그램', description: '써볼 만한 프로그램을 소개합니다.' },
];
