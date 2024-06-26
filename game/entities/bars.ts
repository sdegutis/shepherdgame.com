import { Actable } from "../lib/data.js";
import { Entity } from "./entity.js";
import { Player } from "./player.js";

export class Bar implements Actable {

  constructor(public entity: Entity) { }

  actOn(player: Player) {
    return false;
  }

}
