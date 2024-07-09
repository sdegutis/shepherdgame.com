import { Actable, actables, drawables, Updatable, updatables } from "../lib/data.js";
import { removeFrom } from "../lib/helpers.js";
import { Entity } from "./entity.js";
import { Player } from "./player.js";

export class Bubble implements Updatable, Actable {

  constructor(public entity: Entity) {
  }

  actOn(player: Player) {
    // if (player.hasWand) return true;
    // this.destroy();
    // player.hasWand = true;
    // // player.rumble(.3, 1, 1);
    return true;
  }

  update(t: number) {
    this.entity.y -= 1;

    // const durationMs = 1000;
    // const percent = ((t % durationMs) / durationMs);
    // const percentOfCircle = percent * Math.PI * 2;
    // const distance = 1.5;
    // this.entity.y = this.y + +Math.cos(percentOfCircle) * distance;
    // this.entity.x = this.x + -Math.sin(percentOfCircle) * distance;
  }

  destroy() {
    removeFrom(actables, this);
    removeFrom(updatables, this);
    removeFrom(drawables, this.entity);
  }

}
