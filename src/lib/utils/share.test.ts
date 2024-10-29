import { describe, it, expect, vi, beforeEach } from 'vitest';
import { share } from './share';

describe('share', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		global.navigator = {
			...navigator,
			share: vi.fn(),
			// @ts-expect-error type missmatch
			clipboard: {
				writeText: vi.fn().mockResolvedValue(undefined)
			}
		};
	});

	it('should call navigator.share if it is available', async () => {
		const shareObject = { title: 'Test Title', text: 'Test text', url: 'https://example.com' };

		vi.spyOn(navigator, 'share').mockImplementation(() => Promise.resolve());

		await share(shareObject);

		expect(navigator.share).toHaveBeenCalledWith(shareObject);
	});

	it('should fall back to clipboard.writeText if navigator.share is not available', async () => {
		const shareObject = { title: 'Test Title', text: 'Test text' };

		const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);

		vi.stubGlobal('navigator', { ...navigator, share: undefined });

		await share(shareObject);

		expect(writeTextSpy).toHaveBeenCalledWith(shareObject.text);
		writeTextSpy.mockRestore();
	});
});
