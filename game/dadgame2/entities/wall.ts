import { Actable } from "../lib/data.js";
import { Entity } from "./entity.js";
import { Player } from "./player.js";

export class Wall implements Actable {

  constructor(public entity: Entity, private jumpThrough = false) { }

  actOn(player: Player, x: number, y: number): boolean {
    if (this.jumpThrough) {
      if (y > 0) {
        return (this.entity.y !== player.entity.y + 7);
      }
      return true;
    }
    return false;
  }

}
