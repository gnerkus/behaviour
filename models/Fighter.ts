import {Actor} from "./Actor.ts";
import type {ActorInfo, BrokerInterface, Effect} from "../gametypes.ts";
import {Heap} from "heap-js";

class FighterActor extends Actor {
  constructor(
      definition: string,
      broker: BrokerInterface,
      queue: Heap<Effect>,
      charInfo: ActorInfo
  ) {
    const fighterStats = {
      currentHP: 125,
      maxHP: 125,
      currentAP: 1,
      maxAP: 1,
      currentPP: 1,
      maxPP: 1,
      attack: 75,
      magic: 10
    }
    super(definition, broker, queue, fighterStats, charInfo);
  }

  enemyAttack = () => {
    this.brokerRef.addToEventQueue('EnemyAttack', {targetId: "1234", damage: 50})
  }
}

export default FighterActor
