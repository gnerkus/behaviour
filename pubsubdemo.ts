// Source - https://stackoverflow.com/a/70815467
// Posted by Cory Robinson, modified by community. See post 'Timeline' for change history
// Retrieved 2026-05-02, License - CC BY-SA 4.0

import { PubSub } from './pubsub.ts'

type KnightEvents = {
  EnemyAttack: { targetId: string, damage: number }
  Guard: { targetId: string }
}

type FighterEvents = {
  EnemyAttack: { targetId: string, damage: number }
}

type HealerEvents = {
  EnemyAttack: { targetId: string, damage: number }
  Heal: { targetId: string, damage: number }
}

const enemyFighter = PubSub<FighterEvents>();
const heroKnight = PubSub<KnightEvents>();
const heroHealer = PubSub<HealerEvents>();

heroHealer.subscribe("EnemyAttack", (message) => {
  console.log(`Teammate is being attacked for ${message.damage} damage`)
  console.log("Heal");
  heroHealer.publish("Heal", {
    targetId: message.targetId,
    damage: 50
  });
});

heroKnight.subscribe("EnemyAttack", (message) => {
  if ("damage" in message) {
    console.log(`Teammate is being attacked for ${message.damage} damage`)
    console.log("Guard");
    heroKnight.publish("Guard", {
      targetId: message.targetId,
    });
  }
});

enemyFighter.publish("EnemyAttack", { targetId: "1234", damage: 50});

