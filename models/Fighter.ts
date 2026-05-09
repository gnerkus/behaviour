import {Actor} from "./Actor";
import {BrokerInterface, Effect} from "../types";
import {Heap} from "heap-js";

class FighterActor extends Actor {
  constructor(definition: string, broker: BrokerInterface, queue: Heap<Effect>) {
    super(definition, broker, queue);
  }

  enemyAttack = () => {
    this.brokerRef.addToEventQueue('enemyAttack', {targetId: "1234", damage: 50})
  }
}

export default FighterActor
