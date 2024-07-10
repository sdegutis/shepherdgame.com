import { Entity } from "./entity.js";
import { Player } from "./player.js";

export class BubbleWand extends Entity {

  x1; y1;

  constructor(
    x: number,
    y: number,
    image: OffscreenCanvas,
  ) {
    super(x, y, image);
    this.x1 = x;
    this.y1 = y;
  }

  override actOn = (player: Player) => {
    if (player.hasWand) return true;

    player.hasWand = true;
    this.dead = true;
    // player.rumble(.3, 1, 1);
    return true;
  };

  override update = (t: number) => {
    const durationMs = 1000;
    const percent = ((t % durationMs) / durationMs);
    const percentOfCircle = percent * Math.PI * 2;
    const distance = 1.5;
    this.y = Math.round(this.y1 + +Math.cos(percentOfCircle) * distance);
    this.x = Math.round(this.x1 + -Math.sin(percentOfCircle) * distance);
  };

}
