import type {
  ActorInfo,
  BattleEvents, BattleEventTypes,
  BrokerInterface,
  Effect, Stats
} from "../gametypes.ts";
import {BehaviourTree} from "mistreevous";
import {Heap} from "heap-js";

export abstract class Actor {
  protected currentEventData: BattleEvents[BattleEventTypes];
  protected tree: BehaviourTree;
  protected brokerRef: BrokerInterface;
  protected actionQueue: Heap<Effect>;

  protected stats: Stats;
  protected info: ActorInfo;

  protected constructor(
      definition: string,
      broker: BrokerInterface,
      queue: Heap<Effect>,
      initStats: Stats,
      charInfo: ActorInfo
  ) {
    this.tree = new BehaviourTree(definition, this);
    this.brokerRef = broker;
    this.actionQueue = queue;

    this.stats = initStats;
    this.info = charInfo;
  }
}
