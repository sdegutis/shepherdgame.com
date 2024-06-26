import { Actable, actables, drawables } from "../lib/data.js";
import { removeFrom } from "../lib/helpers.js";
import { MapTile } from "../lib/pico8.js";
import { Entity } from "./entity.js";
import { Player } from "./player.js";

export class Button implements Actable {

  constructor(
    public entity: Entity,
    private x: number,
    private y: number,
    private map: MapTile[][],
  ) { }

  actOn(player: Player) {
    removeFrom(actables, this);
    removeFrom(drawables, this.entity);
    // player.rumble(.3, 1, 1);

    const firstBar = findFirstBar(this.x, this.y, this.map);
    if (!firstBar) return true;

    const relatedBars = findAdjascentBars(...firstBar, this.map);
    for (const [x, y] of [firstBar, ...relatedBars]) {
      const tile = this.map[y][x];


      // removeFrom(drawables, bar);
    }

    return true;
  }

}

const BAR = 10;

function findFirstBar(x: number, y: number, map: MapTile[][]) {
  for (let i = 1; i < 20; i++) {
    if (x - i >= 0) {
      if (map[y][x + i].index === BAR) return [x + i, y] as const;
      if (map[y][x - i].index === BAR) return [x - i, y] as const;
    }
  }
  return null;
}

function findAdjascentBars(x: number, y: number, map: MapTile[][]) {
  const bars: [number, number][] = [];
  for (let i = 1; i < 5; i++) {
    if (map[y - i][x].index === BAR) bars.push([x, y - i]); else break;
  }
  for (let i = 1; i < 5; i++) {
    if (map[y + i][x].index === BAR) bars.push([x, y + i]); else break;
  }
  return bars;
}
