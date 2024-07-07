import { Actable, actables, drawables, Updatable } from "../lib/data.js";
import { removeFrom } from "../lib/helpers.js";
import { Entity } from "./entity.js";
import { Player } from "./player.js";

export class Bomb implements Updatable, Actable {

  x; y;

  constructor(public entity: Entity) {
    this.x = entity.x;
    this.y = entity.y;
  }

  actOn(player: Player) {
    if (!player.isPink) return true;

    player.bombs++;
    removeFrom(actables, this);
    removeFrom(drawables, this.entity);
    player.rumble(.3, 1, 1);
    return true;
  }

  update(t: number) {
    const durationMs = 1000;
    const percent = ((t % durationMs) / durationMs);
    const percentOfCircle = percent * Math.PI * 2;
    const distance = 1.5;
    this.entity.y = this.y + +Math.cos(percentOfCircle) * distance;
    this.entity.x = this.x + -Math.sin(percentOfCircle) * distance;
  }

}
