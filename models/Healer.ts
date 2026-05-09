import type {
  BattleEvents,
  BrokerInterface,
  Effect,
  Handler,
  Listener
} from "../gametypes.ts";
import {Actor} from "./Actor.ts";
import {Heap} from "heap-js";

class HealerActor extends Actor {
  constructor(definition: string, broker: BrokerInterface, queue: Heap<Effect>) {
    super(definition, broker, queue);
    this.brokerRef.addSubscriber('EnemyAttack', this.onEnemyAttack);
  }

  onEnemyAttack: Listener<BattleEvents> = async (data: BattleEvents["EnemyAttack"]) => {
    this.currentEventData = data;
    console.log(`Healer: Enemy will attack hero ${data.targetId} for ${data.damage}`)
    console.log("running healer behaviour tree to determine what to do")
    this.tree.step();
    return;
  }

  healHandler: Handler<BattleEvents> = (message: BattleEvents["Heal"]) => {
    console.log(`Healer heals ${message.targetId}`);
  }

  Heal = () => {
    console.log(`Thinking done: Healer will heal target ${this.currentEventData.targetId}`)
    this.brokerRef.addToEventQueue('heal', {targetId: "1234"})
    this.actionQueue.push({
      callback: this.healHandler,
      args: this.currentEventData,
      priority: 2
    });
    this.currentEventData = null;
  }
}

export default HealerActor
