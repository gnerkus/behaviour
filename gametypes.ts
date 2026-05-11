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

export type Stats = {
  currentHP: number
  maxHP: number
  currentAP: number
  maxAP: number
  currentPP: number
  maxPP: number
  attack: number
  magic: number
}

export type ActorInfo = {
  id: string
  className: "Knight" | "Healer" | "Fighter"
}

export type BoardAgentInterface = {
  setTargets(ids: string[]): void;
  isTargetTeam(askerId: string): boolean;
}
