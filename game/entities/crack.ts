import { Actable, actables, drawables } from "../lib/data.js";
import { removeFrom } from "../lib/helpers.js";
import { Entity } from "./entity.js";
import { Player } from "./player.js";

export class Crack implements Actable {

  constructor(public entity: Entity) { }

  actOn(player: Player): boolean {
    if (player.bombs === 0) {
      return false;
    }

    player.bombs--;
    removeFrom(actables, this);
    removeFrom(drawables, this.entity);
    player.rumble(.3, 1, 1);
    return true;
  }

}
