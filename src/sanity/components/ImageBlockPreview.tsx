import { isValidElement } from 'react';
import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { BlockImagePreviewProps } from 'sanity';

const previewClient = createClient({
	projectId: '9nsnhcwi',
	dataset: 'production',
	useCdn: true,
	apiVersion: '2024-01-01',
});

const imageBuilder = createImageUrlBuilder(previewClient);

const widthStyles: Record<string, string> = {
	sm: '400px',
	md: '600px',
	lg: '800px',
	full: '100%',
};

const alignmentLabels: Record<string, string> = {
	left: 'Left',
	center: 'Center',
	right: 'Right',
};

const widthLabels: Record<string, string> = {
	sm: 'SM',
	md: 'MD',
	lg: 'LG',
	full: 'FULL',
};

function getPreviewImageLayout(widthPx: number | null, align: string) {
	const isFull = widthPx === null;
	const base = {
		width: isFull ? '100%' : `${widthPx}px`,
		maxWidth: '100%',
	};

	switch (align) {
		case 'left':
			return {
				...base,
				marginLeft: '0',
				marginRight: 'auto',
				textAlign: 'left' as const,
			};
		case 'right':
			return {
				...base,
				marginLeft: 'auto',
				marginRight: '0',
				textAlign: 'right' as const,
			};
		default:
			return {
				...base,
				marginLeft: 'auto',
				marginRight: 'auto',
				textAlign: 'center' as const,
			};
	}
}

type ImageBlockValue = {
	alt?: string;
	align?: string;
	caption?: string;
	width?: string;
	widthPx?: number;
	asset?: {
		_ref?: string;
	};
	_ref?: string;
};

function extractAssetRef(source: unknown): string | null {
	if (!source || typeof source !== 'object') return null;

	const record = source as Record<string, unknown>;

	if (typeof record._ref === 'string' && record._ref.startsWith('image-')) {
		return record._ref;
	}

	if (record.asset && typeof record.asset === 'object') {
		const assetRecord = record.asset as Record<string, unknown>;
		if (typeof assetRecord._ref === 'string') return assetRecord._ref;
	}

	if (record.media && typeof record.media === 'object') {
		return extractAssetRef(record.media);
	}

	return null;
}

export function ImageBlockPreview(props: BlockImagePreviewProps) {
	const value = (props.value ?? {}) as ImageBlockValue;
	const widthKey = value.width ?? 'lg';
	const alignKey = value.align ?? 'center';
	const resolvedWidthPx =
		typeof value.widthPx === 'number'
			? value.widthPx
			: widthKey === 'full'
				? null
				: Number.parseInt(widthStyles[widthKey] ?? widthStyles.lg, 10);
	const layoutStyle = getPreviewImageLayout(resolvedWidthPx, alignKey);
	const assetRef =
		value.asset?._ref ??
		value._ref ??
		extractAssetRef(props.media) ??
		extractAssetRef(props.value);
	const imageUrl = assetRef
		? imageBuilder
				.image({
					_type: 'image',
					asset: {
						_type: 'reference',
						_ref: assetRef,
					},
				})
				.width(1600)
				.fit('max')
				.auto('format')
				.url()
		: null;
	const label = value.caption || value.alt || 'Image';
	const mediaUrl =
		props.media && typeof props.media === 'object' && 'url' in props.media
			? String((props.media as { url?: string }).url ?? '')
			: '';
	const fallbackUrl = mediaUrl || imageUrl;
	const debugInfo = JSON.stringify(
		{
			valueKeys: Object.keys((props.value as Record<string, unknown>) ?? {}),
			mediaKeys:
				props.media && typeof props.media === 'object'
					? Object.keys(props.media as Record<string, unknown>)
					: [],
			assetRef,
		},
		null,
		0,
	);

	return (
		<div
			style={{
				width: '100%',
				border: '1px solid var(--card-border-color, #e5e7eb)',
				borderRadius: '10px',
				background: 'var(--card-bg-color, #fff)',
				overflow: 'hidden',
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: '8px',
					padding: '8px 10px',
					borderBottom: '1px solid var(--card-border-color, #e5e7eb)',
					background: 'var(--card-muted-bg-color, #f8fafc)',
					fontSize: '12px',
				}}
			>
				<strong style={{ fontWeight: 600 }}>{label}</strong>
				<span
					style={{
						padding: '2px 6px',
						borderRadius: '999px',
						background: '#e8eefc',
						color: '#3558a2',
						fontWeight: 600,
					}}
				>
					{value.widthPx ? `${value.widthPx}px` : (widthLabels[widthKey] ?? 'LG')}
				</span>
				<span
					style={{
						padding: '2px 6px',
						borderRadius: '999px',
						background: '#edf7ed',
						color: '#2f6b3b',
						fontWeight: 600,
					}}
				>
					{alignmentLabels[alignKey] ?? 'Center'}
				</span>
			</div>

			<div style={{ padding: '14px', background: '#fff' }}>
				<div style={{ width: '100%' }}>
					<div style={layoutStyle}>
						{fallbackUrl ? (
							<img
								src={fallbackUrl}
								alt={value.alt ?? ''}
								style={{
									display: 'block',
									width: '100%',
									height: 'auto',
									borderRadius: '10px',
									boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
									border: '1px solid rgba(148, 163, 184, 0.22)',
									objectFit: 'contain',
								}}
							/>
						) : isValidElement(props.media) ? (
							<div
								style={{
									display: 'block',
									width: '100%',
								}}
							>
								{props.media}
							</div>
						) : (
							<div
								style={{
									display: 'grid',
									placeItems: 'center',
									minHeight: '140px',
									borderRadius: '10px',
									border: '1px dashed #cbd5e1',
									background: '#f8fafc',
									color: '#64748b',
									fontSize: '13px',
									fontWeight: 600,
									textAlign: 'center',
									padding: '1rem',
								}}
							>
								<div>No image selected</div>
								<div
									style={{
										marginTop: '0.5rem',
										fontSize: '11px',
										fontWeight: 400,
										whiteSpace: 'pre-wrap',
										wordBreak: 'break-word',
									}}
								>
									{debugInfo}
								</div>
							</div>
						)}
					</div>
				</div>

				{value.caption && (
					<div
						style={{
							marginTop: '8px',
							color: '#64748b',
							fontSize: '12px',
							textAlign: alignKey === 'center' ? 'center' : alignKey,
						}}
					>
						{value.caption}
					</div>
				)}
			</div>
		</div>
	);
}
