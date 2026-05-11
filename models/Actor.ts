import type {
  BattleEvents, BattleEventTypes,
  BrokerInterface,
  Effect,
} from "../gametypes.ts";
import {BehaviourTree} from "mistreevous";
import {Heap} from "heap-js";

export abstract class Actor {
  protected currentEventData: BattleEvents[BattleEventTypes];
  protected tree: BehaviourTree;
  protected brokerRef: BrokerInterface;
  protected actionQueue: Heap<Effect>;

  protected ID: string;

  protected constructor(
      definition: string,
      broker: BrokerInterface,
      queue: Heap<Effect>,
      id: string
  ) {
    this.tree = new BehaviourTree(definition, this);
    this.brokerRef = broker;
    this.actionQueue = queue;

    this.ID = id;
  }

  /**
   * Checks if the target of an action is a member of the Actor's team
   *
   * 1. get Actor's ID
   * - this.ID
   * 2. get the target's ID
   * - board contains the targets' IDs
   * 3. run a query
   * @constructor
   * @protected
   */
  protected IsTargetTeam() {

  }
}
