import {Heap} from "heap-js";
import {
  Effect
} from "./types";
import KnightActor from "./models/Knight";
import HealerActor from "./models/Healer";
import FighterActor from "./models/Fighter";
import Broker from "./gameobjects/Broker";

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
