export type ToastTone = "danger" | "success" | "info" | "reward";
export interface ToastEvent {
  id: number;
  text: string;
  tone: ToastTone;
}

type Listener = (event: ToastEvent) => void;

const listeners = new Set<Listener>();
let nextId = 1;

export function emitToast(text: string, tone: ToastTone = "danger") {
  const event: ToastEvent = { id: nextId++, text, tone };
  listeners.forEach((fn) => fn(event));
}

export function subscribeToast(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
