import { PixelImage } from '../lib/image.js';
import { Entity, Logic } from "./entity.js";
import { Player } from './player.js';

export class Elevator extends Entity {

  stoodOn: Player | undefined;

  y1;

  constructor(
    x: number,
    y: number,
    image: PixelImage,
  ) {
    super(x, y, image);
    this.y1 = y;
  }

  override update = (t: number, logic: Logic) => {

    if (this.stoodOn) {
      if (this.y >= this.y1 - 8) {
        logic.tryMove(this, 0, -1);
        logic.tryMove(this.stoodOn, 0, -1);
      }
    }
    else {
      if (this.y < this.y1) {
        logic.tryMove(this, 0, 1);
      }
    }

    // const durationMs = 1000;
    // const percent = ((t % durationMs) / durationMs);
    // const percentOfCircle = percent * Math.PI * 2;
    // const distance = 1.5;
    // this.y = this.y1 + +Math.cos(percentOfCircle) * distance;
    // this.x = this.x1 + -Math.sin(percentOfCircle) * distance;
  };

  // override collideWith? = (other: Entity, x: number, y: number): Interaction => {
  //   if (other instanceof Player) {
  //     other.y += 1;
  //     return 'pass';
  //   }

  //   return 'stop';
  // }

}
