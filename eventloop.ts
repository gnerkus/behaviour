import {Heap} from "heap-js";
import {
  BattleEventTypes,
  Handler,
  Listener,
  BattleEvents,
  Effect, BrokerInterface
} from "./types";
import {Actor} from "./models/Actor";
import KnightActor from "./models/Knight";
import HealerActor from "./models/Healer";


const customPriorityComparator = (a: Effect, b: Effect) => a.priority - b.priority;
const actionPriorityQueue = new Heap(customPriorityComparator);

class Broker implements BrokerInterface {
  private events: Partial<Record<BattleEventTypes, Function[]>> = {};
  private eventQueue: {
    event: string;
    data: BattleEvents[BattleEventTypes];
  }[] = [];
  private state: "dispatching" | "idle" | "action" = "idle";

  constructor() {
  }

  addSubscriber(event: string, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  addToEventQueue(event: string, data: BattleEvents[BattleEventTypes]) {
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


class FighterActor {
  enemyAttack = () => {
    broker.addToEventQueue('enemyAttack', {targetId: "1234", damage: 50})
  }
}

const knightRules = `root {
        sequence {
            action [Guard]
        }
    }`;
const knight = new KnightActor(knightRules, broker, actionPriorityQueue);
const healerRules = `root {
        sequence {
            action [Heal]
        }
    }`;
const healer = new HealerActor(healerRules, broker, actionPriorityQueue);

const fighter = new FighterActor();

fighter.enemyAttack();
