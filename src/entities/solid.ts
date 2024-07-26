import { Img } from "../lib/image.js";
import { Entity } from "./entity.js";

export class Solid extends Entity {

  constructor(
    x: number,
    y: number,
    spritesheet: number[],
    spriteIndex: number,
  ) {
    super(x, y, Img.from(spritesheet, spriteIndex));
  }

}
