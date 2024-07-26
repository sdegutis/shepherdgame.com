import { Img } from "../lib/image.js";
import { game } from "../main.js";

// export type Interaction = 'stop' | 'pass';
//   collideWith?: (other: Entity, x: number, y: number) => Interaction;

export class Entity {

  constructor(
    public x: number,
    public y: number,
    public image: Img,
  ) {
    game.entities.push(this);
  }

  update?: (t: number) => void;

}
