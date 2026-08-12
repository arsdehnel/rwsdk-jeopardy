// import { ErrorResponse } from 'rwsdk/worker';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import sessionMiddleware from '../session';

// Mock the dependencies
vi.mock('@/durable-objects', () => ({
	sessions: {
		loadFromRequest: vi.fn(),
		clear: vi.fn(),
	},
}));

vi.mock('rwsdk/worker', () => {
	const mockRequestInfo = {
		ctx: {} as any,
		request: new Request('https://example.com/test'),
		response: {
			headers: new Headers(),
		},
	};

	return {
		get requestInfo() {
			return mockRequestInfo;
		},
		ErrorResponse: class ErrorResponse extends Error {
			constructor(
				public code: number,
				message: string,
			) {
				super(message);
				this.name = 'ErrorResponse';
			}
		},
	};
});

// Import after mocking
import { sessions } from '@/durable-objects';

describe('sessionMiddleware', () => {
	let mockRequestInfo: any;

	beforeEach(() => {
		vi.clearAllMocks();
		mockRequestInfo = {
			ctx: {
				session: {},
			},
			request: new Request('https://example.com/test'),
			response: {
				headers: new Headers(),
			},
		};
	});

	it('loads session and sets it on context', async () => {
		const mockSession = {
			sessionId: crypto.randomUUID(),
			userId: 'test-user-123',
			lastAccessedAt: Date.now(),
		};
		vi.mocked(sessions.loadFromRequest).mockResolvedValue(mockSession);

		await sessionMiddleware(mockRequestInfo);

		expect(sessions.loadFromRequest).toHaveBeenCalledWith(mockRequestInfo.request, mockRequestInfo.response.headers);
		expect(mockRequestInfo.ctx.session).toBe(mockSession);
	});
});
