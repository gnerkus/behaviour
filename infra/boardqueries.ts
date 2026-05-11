import { jsonquery } from '@jsonquerylang/jsonquery'

const data = {
  "friends": [
    { "name": "Chris", "age": 23, "city": "New York" },
    { "name": "Emily", "age": 19, "city": "Atlanta" },
    { "name": "Joe", "age": 32, "city": "New York" },
    { "name": "Kevin", "age": 19, "city": "Atlanta" },
    { "name": "Michelle", "age": 27, "city": "Los Angeles" },
    { "name": "Robert", "age": 45, "city": "Manhattan" },
    { "name": "Sarah", "age": 31, "city": "New York" }
  ]
}

// Get the array containing the friends from the object, filter the friends that live in New York,
// sort them by age, and pick just the name and age out of the objects.
const output = jsonquery(data, `
  .friends 
    | filter(.city == "New York") 
    | sort(.age) 
    | pick(.name, .age)
`)

console.log(output)

/**
 * BOARD STATE
 *
 * - How to pass board state to behaviour?
 *
 * - contains stats of all the actors, alongside actor ids
 * -
 *
 * Example flow
 * 1. Fighter goes first
 * 2. Fighter inspects board
 * 3. Fighter's behaviour chooses to attack healer based on board state
 * 4. attack event is published
 * 5. Knight receives event, inspects board state and chooses to guard healer
 *
 *
 * Knight guard
 * root {
 *     sequence {
 *         condition [IsSameTeam]
 *         condition [TargetHPLessEqual, 50]
 *         action [Guard]
 *     }
 * }
 */
