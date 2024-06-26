import { Actable, actables } from "../lib/data.js";
import { removeFrom } from "../lib/helpers.js";
import { Entity } from "./entity.js";
import { Player } from "./player.js";

const mapping: Record<string, [number, number]> = {
  '8,7': [10, 7],
  '12,13': [2, 21],
};

export class Portal implements Actable {

  opened = false;
  to?: [number, number];

  constructor(public entity: Entity) { }

  actOn(player: Player): boolean {
    if (!this.opened) {
      if (player.keys === 0) {
        return true;
      }

      player.keys--;
      this.opened = true;
    }
    else {
      if (this.to) {
        const [x, y] = this.to;
        player.entity.x = x * 8 + player.entity.ox;
        player.entity.y = y * 8 + player.entity.oy;
      }
    }

    return true;
  }

}

export function connectPortals() {
  const portals = actables.filter(a => a instanceof Portal);

  for (const portal of portals) {
    const key = `${portal.entity.x / 8},${portal.entity.y / 8}`;
    if (!mapping[key]) {
      removeFrom(actables, portal);
      continue;
    }
    portal.to = mapping[key];
  }
}
