// Source - https://stackoverflow.com/a/70815467
// Posted by Cory Robinson, modified by community. See post 'Timeline' for change history
// Retrieved 2026-05-02, License - CC BY-SA 4.0

import { PubSub } from './pubsub'


type events = {
  CreatedPerson: { id: string, name: string }
  DeletedPerson: { personId: string; reason: string }
}

const pubSub = PubSub<events>()

pubSub.publish("CreatedPerson", { id: '1', name: 'cory' })

pubSub.subscribe("CreatedPerson", (message) => {
  console.log(message)
})
