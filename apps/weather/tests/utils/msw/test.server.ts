import { setupServer } from 'msw/node';

import type { RequestHandler } from 'msw';

export type MockServer = ReturnType<typeof createMockServer>;

export function createMockServer() {
  const server = setupServer();
  let excludedUrls: string[] = [];
  const onUnhandledRequest = jest.fn();

  return {
    onUnhandledRequest,
    start() {
      server.listen({
        onUnhandledRequest(req, print) {
          const url = new URL(req.url);
          const href = url.href;
          const hostname = url.hostname;

          const isLocalhost =
            hostname === '127.0.0.1' || hostname === 'localhost';

          const isExcluded = excludedUrls.some((excludedUrl) =>
            href.startsWith(excludedUrl),
          );

          if (!isExcluded && !isLocalhost) {
            console.log('[MSW] Unhandled request:', req.method, req.url);
            onUnhandledRequest();
            print.error();
          }
        },
      });
    },
    setExcludedUrls(urls: string[]) {
      excludedUrls = urls;
    },
    clearHandlers() {
      server.resetHandlers();
    },
    addHandlers(handlers: RequestHandler[]) {
      server.use(...handlers);
    },
    stop() {
      server.close();
    },
  };
}
