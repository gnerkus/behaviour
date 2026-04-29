import { State, BehaviourTree } from "mistreevous";

/** Define some behaviour for an entity. */
const definition = `root {
    sequence {
      condition [CanAttack, true]
      action [Attack]
    }
}`;

class Hero {
  isHoldingWeapon() {
    return true;
  }

  attack() {
    console.log('attacked for 10 damage')
  }

  CanAttack (isHeroTurn) {
    return this.isHoldingWeapon() && isHeroTurn;
  }

  Attack () {
    return this.attack();
  }
}

const hero = new Hero();

/** Create the behaviour tree. */
const behaviourTree = new BehaviourTree(definition, hero);

/** Step the tree. */
behaviourTree.step();

/**
 * - How to send board state to the tree instance?
 * - How to make the entity act based on board state?
 *
 *
 */

/**
 *
 * need an event stack:
 *
 * 1. When an enemy attacks, it puts its intent in the stack e.g 6 damage to
 * hero A
 * 2. All event observers then react to this event and place their reactions in
 * the stack in order e.g hero B uses guard, hero C uses potion
 * 3. When there are no more reactions, all events are then popped from the
 * stack e.g enemy's attack will be the last to go
 */
