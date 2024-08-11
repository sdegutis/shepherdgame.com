import { Game, Tile } from "../game.js";
import { Img } from "../lib/image.js";

export type Interaction = 'pass' | 'stop';

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

  // overlaps(other:Entity) {}

  update?: (t: number) => void;

  draw(layer: number) {
    if (layer === this.layer) {
      this.image.draw(this.game.pixels, this.x - this.game.camera.x, this.y - this.game.camera.y);
    }
  }

  collideWith?: <T extends Entity>(other: T, x: number, y: number) => Interaction;

  tryMove(x: number, y: number) {
    this.x += x;
    this.y += y;

    let canMove = true;
    // for (let i = 0; i < entities.length; i++) {
    //   const collidedInto = entities[i];
    //   if (
    //     movingEntity.x + 7 >= collidedInto.x &&
    //     movingEntity.y + 7 >= collidedInto.y &&
    //     movingEntity.x <= collidedInto.x + 7 &&
    //     movingEntity.y <= collidedInto.y + 7
    //   ) {
    //     if (collidedInto === movingEntity) continue;
    //     if (collidedInto.dead) continue;
    //     if (!movingEntity.collideWith) continue;

    //     const result = movingEntity.collideWith(collidedInto, x, y);
    //     if (result === 'stop') {
    //       canMove = false;
    //       break;
    //     }
    //   }
    // }

    if (canMove) {
      this.game.putEntity(this);
      this.game.moveCamera();
    }
    else {
      this.x -= x;
      this.y -= y;
    }


    return canMove;
  }

}
