import { Game } from "../game.js";
import { Img } from "../lib/image.js";
import { Entity } from "./entity.js";

export class Solid extends Entity {

  constructor(
    game: Game,
    x: number,
    y: number,
    spritesheet: number[],
    spriteIndex: number,
  ) {
    super(game, x, y, Img.from(spritesheet, spriteIndex));
  }

}
