import { Actable, actables, drawables, Updatable } from "../lib/data.js";
import { removeFrom } from "../lib/helpers.js";
import { Entity } from "./entity.js";
import { Player } from "./player.js";

export class Key implements Updatable, Actable {

  x; y;

  constructor(public entity: Entity) {
    this.x = entity.x;
    this.y = entity.y;
  }

  actOn(player: Player) {
    player.keys++;
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

function easeOutBounce(x: number): number {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (x < 1 / d1) {
    return n1 * x * x;
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
}
