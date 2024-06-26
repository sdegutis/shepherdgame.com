import { Actable, actables, drawables } from "../lib/data.js";
import { removeFrom } from "../lib/helpers.js";
import { Entity } from "./entity.js";
import { Player } from "./player.js";

const mapping: Record<string, [number, number][]> = {
  '3,5': [[2, 5], [2, 4]],
  '11,5': [[13, 5], [13, 4]],
  '9,13': [[6, 12], [6, 11]],
  '13,13': [[14, 13], [14, 12], [14, 11]],
  '9,21': [[8, 21], [8, 20]],
  '8,26': [[9, 26], [9, 25]],
  '12,27': [[23, 27], [23, 26]],
  '29,27': [[31, 27], [31, 26], [31, 25]],
  '8,29': [[9, 29], [9, 28]],
  '4,32': [[3, 32], [3, 31]],
};

export class Button implements Actable {

  constructor(public entity: Entity) { }

  actOn(player: Player) {
    removeFrom(actables, this);
    removeFrom(drawables, this.entity);
    // player.rumble(.3, 1, 1);

    const key = `${this.entity.x / 8},${this.entity.y / 8}`;
    for (const [x, y] of mapping[key]) {
      const bar = actables.find(a =>
        a.entity.x === x * 8 + a.entity.ox &&
        a.entity.y === y * 8
      );
      removeFrom(actables, bar);
      removeFrom(drawables, bar?.entity);
      console.log(bar);
    }

    return true;
  }

}
