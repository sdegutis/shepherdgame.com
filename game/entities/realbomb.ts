import { actables, drawables, Updatable, updatables } from "../lib/data.js";
import { removeFrom } from "../lib/helpers.js";
import { Crack } from "./crack.js";
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

    const x1 = this.entity.x;
    const y1 = this.entity.y;

    const cracks = actables.filter(a => {
      if (!(a instanceof Crack)) return false;

      const x2 = a.entity.x;
      const y2 = a.entity.y;

      const distance = Math.sqrt(((x1 - x2) ** 2) + ((y1 - y2) ** 2));
      return distance < 12;
    });

    for (const crack of cracks) {
      removeFrom(drawables, crack.entity);
      removeFrom(actables, crack);
    }
  }

}
