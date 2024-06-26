import { drawables, Updatable, updatables } from "../lib/data.js";
import { removeFrom } from "../lib/helpers.js";
import { Entity } from "./entity.js";

export class RealBomb implements Updatable {

  x; y;
  duration = 3000;

  constructor(public entity: Entity, private start: number) {
    this.x = entity.x;
    this.y = entity.y;
  }

  update(t: number) {
    if (t >= this.start + this.duration) {
      this.explode();
      return;
    }

    const durationMs = 300;
    const percent = ((t % durationMs) / durationMs);
    const percentOfCircle = percent * Math.PI * 2;
    const distance = 1.5;
    this.entity.y = this.y + +Math.cos(percentOfCircle) * distance;
  }

  explode() {
    removeFrom(drawables, this.entity);
    removeFrom(updatables, this);
  }

}
