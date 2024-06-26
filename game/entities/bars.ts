import { Actable, actables, drawables } from "../lib/data.js";
import { removeFrom } from "../lib/helpers.js";
import { Entity } from "./entity.js";
import { Player } from "./player.js";

export class Bar implements Actable {

  constructor(public entity: Entity) { }

  actOn(player: Player) {
    return true;
  }

}
