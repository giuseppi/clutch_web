type Observer = {
  callback: IntersectionObserverCallback;
  targets: Set<Element>;
  instance: IntersectionObserver;
};

const observers = new Set<Observer>();

class StubIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: readonly number[] = [];
  private record: Observer;

  constructor(callback: IntersectionObserverCallback) {
    this.record = { callback, targets: new Set(), instance: this };
    observers.add(this.record);
  }

  observe(target: Element) {
    this.record.targets.add(target);
  }

  unobserve(target: Element) {
    this.record.targets.delete(target);
  }

  disconnect() {
    this.record.targets.clear();
    observers.delete(this.record);
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

export function installIntersectionObserver() {
  window.IntersectionObserver = StubIntersectionObserver;
}

/** Fires every observer watching `target` with the given visible ratio. */
export function setIntersection(target: Element, ratio: number) {
  for (const o of [...observers]) {
    if (!o.targets.has(target)) continue;
    const entry = {
      target,
      isIntersecting: ratio > 0,
      intersectionRatio: ratio,
      time: 0,
      boundingClientRect: target.getBoundingClientRect(),
      intersectionRect: target.getBoundingClientRect(),
      rootBounds: null,
    } as IntersectionObserverEntry;
    o.callback([entry], o.instance);
  }
}

/** Drops watched targets but keeps observers, since framer caches and reuses them across tests. */
export function resetIntersections() {
  for (const o of observers) o.targets.clear();
}
