import {Heap} from "heap-js";

type Listener<E> = <Key extends string & keyof E>(message: E[Key]) => void;
type Handler<E> = <Key extends string & keyof E>(message: E[Key]) => void;

type BattleEvents = {
  EnemyAttack: { targetId: string, damage: number },
  Guard: {targetId: string},
  Heal: {targetId: string}
}
type Effect = {
  callback: Handler<BattleEvents>
  args: BattleEvents
  priority: number
}

const customPriorityComparator = (a: Effect, b: Effect) => a.priority - b.priority;
const actionPriorityQueue = new Heap(customPriorityComparator);

/**
 * A. Actor listeners are async; they return a promise once completed
 * B.
 * 1. A loop runs in the broker after its creation
 *   1.1. It checks its event queue
 *   1.2 If there's an event, it calls all listeners using Promise.all
 *   1.3 Once the Promise.all is resolved, the loop continues (broker checks
 *   the queue)
 *   1.4 If queue is empty, loop exits
 *  2. After the loop is complete, the broker then works through the action
 *  stack
 */


class Broker {
  private events: Record<string, Function[]> = {};
  private eventQueue: {event: string; data: any;}[] = [];
  private state: "dispatching" | "idle" | "action" = "idle";

  constructor() {
    // this.eventLoop();
  }

  addSubscriber(event: string, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  addToEventQueue(event: string, data?: any) {
    this.eventQueue.push({event, data});
    this.processEventQueue();
  }

  async processEventQueue() {
    if (this.state !== "idle") {
      return;
    }

    this.state = "dispatching";
    console.log('state: dispatching');

    if (this.eventQueue.length <= 0) {
      this.state = "idle";
      console.log("No more events; processing actions");
      this.processActions();
      return;
    }

    // TODO: events should be popped via priority
    const eventPair = this.eventQueue.pop();
    console.log(`Processing event ${eventPair.event}`);

    if (!this.events[eventPair.event]) {
      this.state = "idle";
      return await this.processEventQueue();
    }

    await Promise.allSettled(
        this.events[eventPair.event].map(callback => callback(eventPair.data))
    );

    this.state = "idle";
    console.log('state: idle');
    this.processEventQueue();
  }

  processActions() {
    for (const action of actionPriorityQueue) {
      action.callback(action.args);
    }
  }
}

const broker = new Broker();

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class KnightActor {
  constructor() {
    broker.addSubscriber('enemyAttack', this.onEnemyAttack)
  }

  onEnemyAttack = async (data: any) => {
    console.log(`Knight: Enemy will attack hero ${data.targetId} for ${data.damage}`)
    console.log("running knight behaviour tree to determine what to do")
    // fake timeout to simulate thinking
    await timeout(1000);
    // behaviour decides 'guard' is the right action
    console.log(`Thinking done: Knight will guard target ${data.targetId}`)
    broker.addToEventQueue('guard', { targetId: "1234" })
    actionPriorityQueue.push({
      callback: this.guard,
      args: data,
      priority: 1
    });
    return;
  }

  guard = (message) => {
    console.log(`Knight guards ${message.targetId}`)
  }
}

class HealerActor {
  constructor() {
    broker.addSubscriber('enemyAttack', this.onEnemyAttack)
  }

  onEnemyAttack = async (data: any) => {
    console.log(`Healer: Enemy will attack hero ${data.targetId} for ${data.damage}`)
    console.log("running healer behaviour tree to determine what to do")
    // fake timeout to simulate thinking
    await timeout(1000);
    // behaviour decides 'guard' is the right action
    console.log(`Thinking done: Healer will heal target ${data.targetId}`)
    broker.addToEventQueue('heal', { targetId: "1234" })
    actionPriorityQueue.push({
      callback: this.heal,
      args: data,
      priority: 2
    })
    return;
  }

  heal = (message) => {
    console.log(`Healer heals ${message.targetId}`);
  }
}

class FighterActor {
  enemyAttack = () => {
    broker.addToEventQueue('enemyAttack', { targetId: "1234", damage: 50})
  }
}

const knight = new KnightActor();
const healer = new HealerActor();

const fighter = new FighterActor();

fighter.enemyAttack();
