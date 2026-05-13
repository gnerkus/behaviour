import {Board} from "./board.ts";
import { jsonquery } from '@jsonquerylang/jsonquery'
import type {BoardAgentInterface} from "../gametypes.ts";

class BoardAgent implements BoardAgentInterface {
  private currentTargetIDs: string[] = [];

  setTargets(ids: string[]) {
    this.currentTargetIDs = ids;
  }

  isTargetTeam(askerId: string) {
    const firstTargetId = this.currentTargetIDs[0];
    const result = jsonquery(
        Board,
        `
        .teams
          | filter(exists(.${firstTargetId}))
          | filter(exists(.${askerId}))
        `
    )

    return !!result.length;
  }
}

export default BoardAgent;
