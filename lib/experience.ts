let ready = false;
const listeners = new Set<() => void>();

export function markReady() {
  if (ready) return;
  ready = true;
  listeners.forEach((listener) => listener());
  listeners.clear();
}

export function onReady(callback: () => void) {
  if (ready) {
    callback();
  } else {
    listeners.add(callback);
  }
}
