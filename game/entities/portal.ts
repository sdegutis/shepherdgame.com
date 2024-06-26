import { Actable, actables } from "../lib/data.js";
import { removeFrom } from "../lib/helpers.js";
import { Entity } from "./entity.js";
import { Player } from "./player.js";

const mapping: Record<string, [number, number]> = {
  '8,7': [10, 7],
  '12,13': [2, 21],
};

export class Portal implements Actable {

  constructor(public entity: Entity) { }

  actOn(player: Player): boolean {
    if (player.keys === 0) {
      return true;
    }

    player.keys--;

    const key = `${this.entity.x / 8},${this.entity.y / 8}`;
    const [x, y] = mapping[key];

    const entity = actables.find(a =>
      a.entity.x === x * 8 &&
      a.entity.y === y * 8
    )!;

    removeFrom(actables, entity);

    player.entity.x = x * 8 + player.entity.ox;
    player.entity.y = y * 8 + player.entity.oy;

    return true;
  }

}
