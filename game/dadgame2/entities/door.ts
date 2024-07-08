import { Actable } from "../lib/data.js";
import { Sprite } from "../lib/pico8.js";
import { Entity } from "./entity.js";
import { Player } from "./player.js";

export class Door implements Actable {

  opened = false;
  to?: [number, number];

  constructor(public entity: Entity, private openDoor: Sprite) { }

  actOn(player: Player): boolean {
    if (this.opened) return true;
    if (player.keys === 0) return false;

    player.keys--;
    this.opened = true;
    this.entity.image = this.openDoor.image;
    return true;
  }

}
