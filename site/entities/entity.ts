import { Game } from "../game.js";
import { Img } from "../lib/image.js";

export type Interaction = 'pass' | 'stop';

export class Entity {

  inSets: Set<Entity>[] = [];

  layer = 0;

  constructor(
    protected game: Game,
    public x: number,
    public y: number,
    public image: Img,
  ) {
    game.putEntity(this, x, y);
  }

  update?: (t: number) => void;

  draw(layer: number) {
    if (layer === this.layer) {
      this.image.draw(this.game.pixels, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
  }

  collideWith?: <T extends Entity>(other: T, x: number, y: number) => Interaction;

}
