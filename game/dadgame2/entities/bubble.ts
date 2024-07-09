import { Actable, actables, drawables, Updatable, updatables } from "../lib/data.js";
import { removeFrom } from "../lib/helpers.js";
import { Entity } from "./entity.js";
import { Player } from "./player.js";

export class Bubble implements Updatable, Actable {

  sitting = false;

  constructor(public entity: Entity) { }

  actOn(player: Player, x: number, y: number) {
    // console.log(x, y)

    if (x) {
      this.entity.x += x;
      return true;
    }

    if (y < 0) {
      this.entity.y -= 1;
      return true;
    }
    else if (y > 0) {
      // player.entity.y -= 1;
      this.sitting = true;
      return false;
    }

    return true;
  }

  update(t: number) {
    this.entity.y -= this.sitting ? -0.25 : 0.25;

    if (this.entity.y < 8) {
      this.destroy();
    }

    this.sitting = false;
  }

  destroy() {
    removeFrom(actables, this);
    removeFrom(updatables, this);
    removeFrom(drawables, this.entity);
  }

}
