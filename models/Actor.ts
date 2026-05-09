import type {
  BattleEvents, BattleEventTypes,
  BrokerInterface,
  Effect
} from "../gametypes.ts";
import {BehaviourTree} from "mistreevous";
import {Heap} from "heap-js";

export abstract class Actor {
  protected currentEventData: BattleEvents[BattleEventTypes];
  protected tree: BehaviourTree;
  protected brokerRef: BrokerInterface;
  protected actionQueue: Heap<Effect>;

  protected constructor(definition: string, broker: BrokerInterface, queue: Heap<Effect>) {
    this.tree = new BehaviourTree(definition, this);
    this.brokerRef = broker;
    this.actionQueue = queue;
  }
}
