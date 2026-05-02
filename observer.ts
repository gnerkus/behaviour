class Signal extends EventTarget {
  #value;
  constructor(value) {
    super();
    this.#value = value;
  }
  get value() {
    return this.#value;
  }
  set value(newValue) {
    const nextValue =
        typeof newValue === 'function' ? newValue(this.#value) : newValue;
    if (nextValue === this.#value) return;
    this.#value = nextValue;
    this.dispatchEvent(new CustomEvent('notify', { detail: nextValue }));
  }
}
const signal = new Signal(42);
signal.addEventListener('notify', (event: CustomEvent) => {
  console.log(`Signal changed to ${event.detail}`);
});
signal.value = 42;
// No change, no event
signal.value = 43;
// LOGS: Signal changed to 43
signal.value = value => value + 1;
// LOGS: Signal changed to 44
