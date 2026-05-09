export type Listener<E> = <Key extends string & keyof E>(message: E[Key]) => void;
export type Handler<E> = <Key extends string & keyof E>(message: E[Key]) => void;

export type BattleEventTypes = "EnemyAttack" | "Guard" | "Heal";

export type BattleEvents = {
  EnemyAttack: { targetId: string, damage: number },
  Guard: { targetId: string },
  Heal: { targetId: string }
}
export type Effect = {
  callback: Handler<BattleEvents>
  args: BattleEvents[BattleEventTypes]
  priority: number
}

export interface BrokerInterface {
  addSubscriber(event: string, callback: Function): void;
  addToEventQueue(event: string, data: BattleEvents[BattleEventTypes]): void;
  processEventQueue(): void;
  processActions(): void;
}
