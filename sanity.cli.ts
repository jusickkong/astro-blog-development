import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
	api: {
		projectId: '9nsnhcwi',
		dataset: 'production',
	},
	studioHost: 'dev-outpost', // 배포 주소: dev-outpost.sanity.studio
});
