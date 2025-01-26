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

  override draw(layer: number): void {
    super.draw(layer);

    if (this.layer === 0) {
      // console.log('hi')

      for (let yy = 0; yy < 2; yy++) {
        for (let xx = 0; xx < 2; xx++) {
          const x = Math.round(this.x - this.game.camera.x) + xx;
          const y = Math.round(this.y - this.game.camera.y) + yy;

          const i = y * 320 * 4 + x * 4;

          this.game.pixels[i + 0] = 100;
          this.game.pixels[i + 1] = 100;
          this.game.pixels[i + 2] = 100;
          this.game.pixels[i + 3] = 255;
        }
      }

    }
  }

}
