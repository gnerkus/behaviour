type ActorAction = (data?: any) => void;
const stack: ActorAction[] = [];

abstract class Actor {
}

class Broker {
  private events: Record<string, Function[]> = {};

  addSubscriber(event: string, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  publish(event: string, data?: any) {
    if (!this.events[event]) {
      return;
    }
    this.events[event].forEach((callback) => callback(data));
  }
}

const broker = new Broker();

class Knight extends Actor {
  constructor() {
    super();
    broker.addSubscriber('enemyAttack', this.onEnemyAttack)
  }

  onEnemyAttack:ActorAction = (data: any) => {
    console.log(`Enemy attacked hero ${data.targetId} for ${data.damage}`)
    console.log("run knight behaviour tree to determine what to do")
    // behaviour decides 'guard' is the right action
    stack.push(this.guard);
    return;
  }

  guard = () => {
    console.log("guarding")
  }
}

class Healer extends Actor {
  constructor() {
    super();
    broker.addSubscriber('enemyAttack', this.onEnemyAttack)
  }

  onEnemyAttack: ActorAction = (data: any) => {
    console.log(`Enemy attacked hero ${data.targetId} for ${data.damage}`)
    console.log("run healer behaviour tree to determine what to do")
    // behaviour decides 'heal' is the right action
    stack.push(this.heal)
    return;
  }

  heal = () => {
    console.log("healing")
  }
}

class Fighter {
  enemyAttack: ActorAction = () => {
    broker.publish('enemyAttack', { targetId: "1234", damage: 50})
    return;
  }
}

const knight = new Knight();
const healer = new Healer();
const fighter = new Fighter();

fighter.enemyAttack();

let next = stack.pop();
next();
next = stack.pop();
next();
