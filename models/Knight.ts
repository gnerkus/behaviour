import {Actor} from "./Actor.ts";
import type {
  ActorInfo,
  BattleEvents,
  BrokerInterface,
  Effect,
  Handler,
  Listener
} from "../gametypes.ts";
import {Heap} from "heap-js";

class KnightActor extends Actor {
  constructor(
      definition: string,
      broker: BrokerInterface,
      queue: Heap<Effect>,
      charInfo: ActorInfo
  ) {
    const knightStats = {
      currentHP: 175,
      maxHP: 175,
      currentAP: 1,
      maxAP: 1,
      currentPP: 1,
      maxPP: 1,
      attack: 25,
      magic: 0
    }
    super(definition, broker, queue, knightStats, charInfo);
    this.brokerRef.addSubscriber('EnemyAttack', this.onEnemyAttack);
  }

  onEnemyAttack: Listener<BattleEvents> = async (data: BattleEvents["EnemyAttack"]) => {
    this.currentEventData = data;
    console.log(`Knight: Enemy will attack hero ${data.targetId} for ${data.damage}`)
    console.log("running knight behaviour tree to determine what to do")
    this.tree.step();
    return;
  }

  guardHandler: Handler<BattleEvents> = (message: BattleEvents["Guard"]) => {
    console.log(`Knight guards ${message.targetId}`)
  }

  Guard = () => {
    console.log(`Thinking done: Knight will guard target ${this.currentEventData.targetId}`)
    this.brokerRef.addToEventQueue('guard', {targetId: "1234"})
    this.actionQueue.push({
      callback: this.guardHandler,
      args: this.currentEventData,
      priority: 1
    });
    this.currentEventData = null;
  }
}

export default KnightActor
