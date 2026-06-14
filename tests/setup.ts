import '@testing-library/jest-dom';

// jsdom does not implement ResizeObserver. Several components (e.g.
// MediaCarousel) create a `new ResizeObserver(...)` at mount time, which throws
// a ReferenceError under vitest/jsdom. Provide a minimal no-op stub so those
// components render without side-effects — the tests assert on rendered DOM,
// not on ResizeObserver behaviour.
class ResizeObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
