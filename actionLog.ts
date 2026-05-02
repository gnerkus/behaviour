type ActorAction = () => void;
const stack: ActorAction[] = [];

abstract class Actor {
  abstract attack(): void;
}

class Knight extends Actor {
  attack: ActorAction = () => {
    console.log("knight attack");
  }
}

class Mage extends Actor {
  attack: ActorAction = () => {
    console.log("mage attack");
  }
}

const knight = new Knight();
const mage = new Mage();
stack.push(knight.attack);
stack.push(mage.attack);
const test = stack.pop();
test();
const test2 = stack.pop();
test2();

/**
 *
 * If enemy HP >= 60% and self HP <= 50%, use guard
 *
 * sequence {
 *   condition [TargetHPMore60]
 *   condition [SelfHPLess50]
 *   action [Guard]
 * }
 *
 */


