import { Actable } from "../lib/data.js";
import { Entity } from "./entity.js";
import { Player } from "./player.js";

export class Door implements Actable {

  opened = false;
  to?: [number, number];

  constructor(public entity: Entity) { }

  actOn(player: Player): boolean {
    if (this.opened) return true;
    if (player.keys === 0) return false;

    player.keys--;
    this.opened = true;
    return true;
  }

}
