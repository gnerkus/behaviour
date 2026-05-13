import {Actor} from "./Actor.ts";
import type {
  BoardAgentInterface,
  BrokerInterface,
  Effect
} from "../gametypes.ts";
import {Heap} from "heap-js";

class FighterActor extends Actor {
  constructor(
      definition: string,
      broker: BrokerInterface,
      queue: Heap<Effect>,
      agent: BoardAgentInterface,
      id: string
  ) {
    super(definition, broker, queue, agent, id);
  }

  // placeholder; this should be called by a behaviour instead
  enemyAttack = () => {
    this.brokerRef.addToEventQueue('EnemyAttack', {targetId: "1234", damage: 50})
  }

  IsTargetTeam() {
    return this.boardAgentRef.isTargetTeam(this.ID);
  }
}

export default FighterActor
