import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { InputProps } from 'sanity';

type ImageBlockValue = {
	alt?: string;
	align?: 'left' | 'center' | 'right';
	caption?: string;
	width?: 'sm' | 'md' | 'lg' | 'full';
	widthPx?: number;
	asset?: {
		_ref?: string;
	};
};

const previewClient = createClient({
	projectId: '9nsnhcwi',
	dataset: 'production',
	useCdn: true,
	apiVersion: '2024-01-01',
});

const imageBuilder = createImageUrlBuilder(previewClient);

const presetWidths: Record<string, number | null> = {
	sm: 400,
	md: 600,
	lg: 800,
	full: null,
};

function getResolvedWidth(value: ImageBlockValue) {
	if (typeof value.widthPx === 'number') return value.widthPx;
	return presetWidths[value.width ?? 'lg'] ?? 800;
}

function getPreviewStyle(widthPx: number | null, align: ImageBlockValue['align']) {
	const width = widthPx === null ? '100%' : `min(100%, ${widthPx}px)`;

	switch (align) {
		case 'left':
			return {
				width,
				maxWidth: '100%',
				marginLeft: '0',
				marginRight: 'auto',
				textAlign: 'left' as const,
			};
		case 'right':
			return {
				width,
				maxWidth: '100%',
				marginLeft: 'auto',
				marginRight: '0',
				textAlign: 'right' as const,
			};
		default:
			return {
				width,
				maxWidth: '100%',
				marginLeft: 'auto',
				marginRight: 'auto',
				textAlign: 'center' as const,
			};
	}
}

export function ImageBlockInput(props: InputProps) {
	const value = (props.value ?? {}) as ImageBlockValue;
	const assetRef = value.asset?._ref;
	const resolvedWidth = getResolvedWidth(value);
	const align = value.align ?? 'center';
	const previewStyle = getPreviewStyle(resolvedWidth, align);
	const imageUrl = assetRef
		? imageBuilder
				.image({
					_type: 'image',
					asset: {
						_type: 'reference',
						_ref: assetRef,
					},
				})
				.width(typeof resolvedWidth === 'number' ? Math.max(resolvedWidth * 2, 600) : 1600)
				.fit('max')
				.auto('format')
				.url()
		: null;

	return (
		<div style={{ display: 'grid', gap: '1rem' }}>
			{props.renderDefault(props)}

			<div
				style={{
					border: '1px solid var(--card-border-color, #e5e7eb)',
					borderRadius: '12px',
					background: '#fff',
					overflow: 'hidden',
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '0.5rem',
						padding: '0.75rem 0.9rem',
						borderBottom: '1px solid var(--card-border-color, #e5e7eb)',
						background: '#f8fafc',
						fontSize: '12px',
						fontWeight: 600,
					}}
				>
					<span>Live preview</span>
					<span style={{ color: '#64748b' }}>
						{resolvedWidth === null ? 'full width' : `${resolvedWidth}px`} / {align}
					</span>
				</div>

				<div style={{ padding: '1rem' }}>
					<div style={previewStyle}>
						{imageUrl ? (
							<img
								src={imageUrl}
								alt={value.alt ?? ''}
								style={{
									display: 'block',
									width: '100%',
									height: 'auto',
									borderRadius: '10px',
									boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
									border: '1px solid rgba(148, 163, 184, 0.22)',
								}}
							/>
						) : (
							<div
								style={{
									display: 'grid',
									placeItems: 'center',
									minHeight: '120px',
									border: '1px dashed #cbd5e1',
									borderRadius: '10px',
									color: '#64748b',
									background: '#f8fafc',
									fontSize: '13px',
									fontWeight: 600,
								}}
							>
								이미지를 선택하면 여기서 폭/정렬 미리보기가 보입니다.
							</div>
						)}

						{value.caption && (
							<div
								style={{
									marginTop: '0.5rem',
									fontSize: '12px',
									color: '#64748b',
									textAlign: align,
								}}
							>
								{value.caption}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
