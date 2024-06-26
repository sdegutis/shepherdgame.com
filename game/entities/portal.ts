import { Actable, actables, drawables } from "../lib/data.js";
import { removeFrom } from "../lib/helpers.js";
import { Entity } from "./entity.js";
import { Player } from "./player.js";

export class Portal implements Actable {

  constructor(public entity: Entity) { }

  actOn(player: Player): boolean {
    if (player.keys === 0) {
      return false;
    }

    player.keys--;
    removeFrom(actables, this);
    removeFrom(drawables, this.entity);
    player.rumble(.3, 1, 1);
    return true;
  }

}
