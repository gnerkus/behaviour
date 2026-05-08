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

abstract class Actor {
}

class Broker {
  private events: Record<string, Function[]> = {};

  addSubscriber(event: string, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  publish(event: string, data?: any) {
    if (!this.events[event]) {
      return;
    }
    this.events[event].forEach((callback) => callback(data));
  }
}

const broker = new Broker();

class Knight extends Actor {
  constructor() {
    super();
    broker.addSubscriber('enemyAttack', this.onEnemyAttack)
  }

  onEnemyAttack: Listener<BattleEvents> = (data: any) => {
    console.log(`Knight: Enemy will attack hero ${data.targetId} for ${data.damage}`)
    console.log("run knight behaviour tree to determine what to do")
    // behaviour decides 'guard' is the right action
    actionPriorityQueue.push({
      callback: this.guard,
      args: data,
      priority: 1
    })
  }

  guard: Handler<BattleEvents> = (message) => {
    console.log(`Knight will guard target ${message.targetId}`)
    // can publish here
  }
}

class Healer extends Actor {
  constructor() {
    super();
    broker.addSubscriber('enemyAttack', this.onEnemyAttack)
  }

  onEnemyAttack: Listener<BattleEvents> = (data: any) => {
    console.log(`Healer: Enemy will attack hero ${data.targetId} for ${data.damage}`)
    console.log("run healer behaviour tree to determine what to do")
    // behaviour decides 'heal' is the right action
    actionPriorityQueue.push({
      callback: this.heal,
      args: data,
      priority: 2
    })
  }

  heal: Handler<BattleEvents> = (message) => {
    if ("damage" in message) {
      console.log(`Healer will heal target ${message.targetId} for more than ${message.damage}`)
    }
    // can publish here for enemies that can block the heal
  }
}

class Fighter {
  enemyAttack: Listener<BattleEvents> = () => {
    broker.publish('enemyAttack', { targetId: "1234", damage: 50})
    return;
  }
}

const knight = new Knight();
const healer = new Healer();
const fighter = new Fighter();

fighter.enemyAttack({ targetId: "1234", damage: 50});

let next = actionPriorityQueue.pop();
next.callback(next.args);
next = actionPriorityQueue.pop();
next.callback(next.args);

/**
 * handler:
 * - publish to broker
 * - stored in stack
 * - represented in behaviour tree
 *
 * listener:
 * - call behaviour tree
 * - is added to broker as a subscription
 * - store result of behaviour tree in stack
 */
