import {Actor} from "./Actor.ts";
import type {
  ActorInfo,
  BattleEvents, BoardAgentInterface,
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
      agent: BoardAgentInterface,
      id: string
  ) {
    super(definition, broker, queue, agent, id);
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

  IsTargetTeam() {
    return this.boardAgentRef.isTargetTeam(this.ID);
  }
}

export default KnightActor
