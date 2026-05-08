import { EventEmitter } from 'node:events';
class Knight extends EventEmitter {}
class Fighter extends EventEmitter {}

const fighter = new EventTarget();
const knight = new EventTarget();

knight.addEventListener('event', (event) => {
  console.log("partner attacked; should guard")
});

fighter.dispatchEvent(new Event('event'))

/**
 * Publish:
 * - send a message to the broker
 *
 * Subscribe
 * - when an event occurs, broker collects all subscribers and notifies them
 *
 *
 * Actors can:
 * - publish
 *   - get the broker instance and call publish
 * - add themselves to the list of subscriber to a specific event
 *   - call broker.addSubscriber(event, method)
 *
 * Broker
 * - subscribes to all events
 * - publishes to all observers
 */
