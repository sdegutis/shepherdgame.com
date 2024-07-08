import { Actable } from "../lib/data.js";
import { Entity } from "./entity.js";
import { Player } from "./player.js";

export class Bar implements Actable {

  constructor(public entity: Entity) {
    entity.ox = 7;
    entity.w = 1;
    entity.x += entity.ox;
  }

  actOn(player: Player) {
    return false;
  }

}
