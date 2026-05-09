import {Actor} from "./Actor.ts";
import type {BrokerInterface, Effect} from "../gametypes.ts";
import {Heap} from "heap-js";

class FighterActor extends Actor {
  constructor(definition: string, broker: BrokerInterface, queue: Heap<Effect>) {
    super(definition, broker, queue);
  }

  enemyAttack = () => {
    this.brokerRef.addToEventQueue('EnemyAttack', {targetId: "1234", damage: 50})
  }
}

export default FighterActor
