import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  expect,
} from '@jest/globals';

import { createMockServer } from './test.server';

export const mockServer = createMockServer();

beforeAll(() => {
  mockServer.start();
});

beforeEach(() => {
  mockServer.clearHandlers();
});

afterEach(() => {
  expect(mockServer.onUnhandledRequest).not.toHaveBeenCalled();
  mockServer.onUnhandledRequest.mockClear();
  mockServer.clearHandlers();
  mockServer.setExcludedUrls([]);
});

afterAll(() => {
  mockServer.stop();
});
