// Source - https://stackoverflow.com/a/70815467
// Posted by Cory Robinson, modified by community. See post 'Timeline' for change history
// Retrieved 2026-05-02, License - CC BY-SA 4.0

/**
 * Defines the function type of the publish function.
 *
 * Extracts the keys from `E` as valid event types, and the matching
 * property as the payload.
 */
type PubTypeFn<E> = <Key extends string & keyof E>(
    event: Key,
    message: E[Key]
) => void

/**
 * Defines the function type for the subscribe function.
 *
 * Extracts the keys from `E` as valid event types, and the matching
 * property as the payload to the callback function.
 */
type SubTypeFn<E> = <Key extends string & keyof E>(
    event: Key,
    fn: MessageFn<E>
) => void

/**
 * Defines the function type for the subscription callback. Ensures
 * the message payload is a valid property of the event being used.
 */
type MessageFn<E> = <Key extends string & keyof E>(message: E[Key]) => void

/**
 * Tie everything together.
 */
type PubSubType<E> = {
  publish: PubTypeFn<E>,

  subscribe: SubTypeFn<E>
  unsubscribe: SubTypeFn<E>
}

/**
 * Creates a new PubSub instance, the `E` type parameter should be a
 * type enumerating all the available events and their payloads.
 *
 * @example
 * type Events = {
 *  warn: { message: string },
 *  error: { message: string }
 * }
 *
 * const pubSub = PubSub<Events>()
 * pubSub.publish('warn', { message: "Something bad happened!" })
 */
function PubSub<E>(): PubSubType<E> {

  const handlers: { [key: string]: (MessageFn<E>)[] } = {}

  return {
    publish: (event, msg) => {
      handlers[event].forEach(h => h(msg))
    },

    subscribe: (event, callback) => {
      const list = handlers[event] ?? []
      list.push(callback)
      handlers[event] = list
    },

    unsubscribe: (event, callback) => {
      let list = handlers[event] ?? []
      list = list.filter(h => h !== callback)
      handlers[event] = list
    }
  }
}

export {
  PubSub
}
