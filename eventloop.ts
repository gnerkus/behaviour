import {Heap} from "heap-js";
import type {
  Effect
} from "./gametypes.ts";
import KnightActor from "./models/Knight.ts";
import HealerActor from "./models/Healer.ts";
import FighterActor from "./models/Fighter.ts";
import Broker from "./gameobjects/Broker.ts";

const customPriorityComparator = (a: Effect, b: Effect) => a.priority - b.priority;
const actionPriorityQueue = new Heap(customPriorityComparator);


const broker = new Broker(actionPriorityQueue);


const knightRules = `root {
        sequence {
            action [Guard]
        }
    }`;
const knight = new KnightActor(knightRules, broker, actionPriorityQueue);
const healerRules = `root {
        sequence {
            action [Heal]
        }
    }`;
const healer = new HealerActor(healerRules, broker, actionPriorityQueue);

const fighter = new FighterActor(healerRules, broker, actionPriorityQueue);

fighter.enemyAttack();
