import { Actable, actables, drawables } from "../lib/data.js";
import { removeFrom } from "../lib/helpers.js";
import { Entity } from "./entity.js";
import { Player } from "./player.js";

export class Button implements Actable {

  constructor(public entity: Entity) { }

  actOn(player: Player) {
    removeFrom(actables, this);
    removeFrom(drawables, this.entity);
    player.rumble(.3, 1, 1);

    const firstBar = this.findFirstBar();
    if (!firstBar) return true;

    removeFrom(actables, firstBar);
    removeFrom(drawables, firstBar.entity);

    return true;
  }

  findFirstBar() {
    const candidates = actables.filter(e => e.entity.y === this.entity.y);
    candidates.sort((a, b) => {
      const da = Math.abs(a.entity.x - this.entity.x);
      const db = Math.abs(b.entity.x - this.entity.x);
      if (da < db) return -1;
      if (da > db) return +1;
      return 0;
    });
    return candidates[0];
  }

}
