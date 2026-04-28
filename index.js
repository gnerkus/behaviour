import { State, BehaviourTree } from "mistreevous";

/** Define some behaviour for an entity. */
const definition = `root {
    sequence {
        action [Walk]
        action [Fall]
        action [Laugh]
    }
}`;

/** Create the blackboard, the object to hold tasks and state for a tree instance. */
const board = {
  Walk: () => {
    console.log("walking!");
    return State.SUCCEEDED;
  },
  Fall: () => {
    console.log("falling!");
    return State.SUCCEEDED;
  },
  Laugh: () => {
    console.log("laughing!");
    return State.SUCCEEDED;
  },
};

/** Create the behaviour tree. */
const behaviourTree = new BehaviourTree(definition, board);

/** Step the tree. */
behaviourTree.step();

// 'walking!'
// 'falling!
// 'laughing!'
