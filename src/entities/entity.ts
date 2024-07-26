import { Img } from "../lib/image.js";
import { game } from "../main.js";

// export type Interaction = 'stop' | 'pass';
//   collideWith?: (other: Entity, x: number, y: number) => Interaction;

export class Entity {

  inSets: Set<Entity>[] = [];

  constructor(
    public x: number,
    public y: number,
    public image: Img,
  ) {
    game.putEntity(this, x, y);
  }

  update?: (t: number) => void;

}
