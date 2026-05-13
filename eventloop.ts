import {Heap} from "heap-js";
import type {
  Effect
} from "./gametypes.ts";
import KnightActor from "./models/Knight.ts";
import HealerActor from "./models/Healer.ts";
import FighterActor from "./models/Fighter.ts";
import Broker from "./gameobjects/Broker.ts";
import BoardAgent from "./gameobjects/boardAgent.ts";

const customPriorityComparator = (a: Effect, b: Effect) => a.priority - b.priority;
const actionPriorityQueue = new Heap(customPriorityComparator);

const broker = new Broker(actionPriorityQueue);
const agent = new BoardAgent();

const knightRules = `
{
  "type": "root",
  "child": {
    "type": "sequence",
    "children": [
      {
        "type": "condition",
        "call": "IsTargetTeam"
      },
      {
        "type": "action",
        "call": "Guard"
      }
    ]
  }
}
`
const knight = new KnightActor(knightRules, broker, actionPriorityQueue, agent, "knt01a");
const healerRules = `
{
  "type": "root",
  "child": {
    "type": "sequence",
    "children": [
      {
        "type": "condition",
        "call": "IsTargetTeam"
      },
      {
        "type": "action",
        "call": "Heal"
      }
    ]
  }
}
`
const healer = new HealerActor(healerRules, broker, actionPriorityQueue, agent,"hel01a");

const fighter = new FighterActor(healerRules, broker, actionPriorityQueue, agent,"fgt03b");

fighter.enemyAttack();
