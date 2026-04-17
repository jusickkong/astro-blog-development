import { useEffect } from 'react';
import { definePlugin } from 'sanity';

const WideLayout = (props: { renderDefault: (props: unknown) => React.ReactNode } & Record<string, unknown>) => {
	useEffect(() => {
		// 폰트 로드 (중복 방지)
		if (!document.getElementById('pretendard-font-link')) {
			const link = document.createElement('link');
			link.id = 'pretendard-font-link';
			link.rel = 'stylesheet';
			link.href = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css';
			document.head.appendChild(link);
		}

		const style = document.createElement('style');
		style.id = 'wide-editor-style';
		style.textContent = `
      /* 문서 편집 폼 영역 max-width 확장 */
      [class^="FormContainer-sc-"],
      [class*=" FormContainer-sc-"] {
        max-width: 100% !important;
        width: 100% !important;
      }
      .pt-editable > .pt-block {
        max-width: 100% !important;
      }

      /* 에디터 본문 폰트 */
      .pt-editable,
      .pt-editable * {
        font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, sans-serif !important;
      }
    `;
		document.head.appendChild(style);
		return () => {
			document.getElementById('wide-editor-style')?.remove();
		};
	}, []);

	return props.renderDefault(props);
};

export const wideLayoutPlugin = definePlugin({
	name: 'wide-layout',
	studio: {
		components: {
			layout: WideLayout as never,
		},
	},
});
