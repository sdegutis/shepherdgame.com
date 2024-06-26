import { Updatable } from "../lib/data.js";
import { Entity } from "./entity.js";

export class RealBomb implements Updatable {

  x; y;

  constructor(public entity: Entity) {
    this.x = entity.x;
    this.y = entity.y;
  }

  update(t: number) {
    const durationMs = 300;
    const percent = ((t % durationMs) / durationMs);
    const percentOfCircle = percent * Math.PI * 2;
    const distance = 1.5;
    this.entity.y = this.y + +Math.cos(percentOfCircle) * distance;
  }

}
