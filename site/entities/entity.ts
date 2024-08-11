import { Game, Tile } from "../game.js";
import { Img } from "../lib/image.js";

export const enum Interaction {
  Pass,
  Stop,
}

type Dir = 'x' | 'y';
export type Collider = (other: Entity, dir: Dir, by: number) => Interaction;

export class Entity {

  inTiles = new Set<Tile>();
  layer = 0;

  constructor(
    protected game: Game,
    public x: number,
    public y: number,
    public image: Img,
  ) {
    game.putEntity(this);
  }

  update?: (t: number) => void;

  draw(layer: number) {
    if (layer === this.layer) {
      this.image.draw(this.game.pixels, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
  }

  collideWith?: Collider;

  tryMove(dir: Dir, by: number) {
    const seen = new Set();
    while (by !== 0) {
      const inch = Math.min(1, Math.max(-1, by));

      by -= inch;
      this[dir] += inch;
      this.game.putEntity(this);

      for (const tile of this.inTiles) {
        for (const ent of tile.entities) {
          if (ent === this) continue;
          if (seen.has(ent)) continue;
          seen.add(ent);

          if (this.#overlaps(ent) && this.collideWith!(ent, dir, inch) === Interaction.Stop) {
            this[dir] -= inch;
            this.game.putEntity(this);
            this.game.moveCamera();
            return false;
          }
        }
      }
    }

    this.game.moveCamera();
    return true;
  }

  #overlaps(other: Entity) {
    return (
      this.x + this.image.w >= other.x &&
      this.y + this.image.h >= other.y &&
      this.x <= other.x + other.image.w &&
      this.y <= other.y + other.image.h
    );
  }

}
