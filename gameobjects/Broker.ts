import {
  BattleEvents,
  BattleEventTypes,
  BrokerInterface,
  Effect
} from "../types";
import {Heap} from "heap-js";

class Broker implements BrokerInterface {
  private events: Partial<Record<BattleEventTypes, Function[]>> = {};
  private eventQueue: {
    event: string;
    data: BattleEvents[BattleEventTypes];
  }[] = [];
  private state: "dispatching" | "idle" | "action" = "idle";
  private readonly actionQueue: Heap<Effect>;

  constructor(queue: Heap<Effect>) {
    this.actionQueue = queue;
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
    for (const action of this.actionQueue) {
      action.callback(action.args);
    }
  }
}

export default Broker
