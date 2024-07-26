import { Img } from "../lib/image.js";

// export type Interaction = 'stop' | 'pass';
//   update?: (t: number) => void;
//   collideWith?: (other: Entity, x: number, y: number) => Interaction;

export class Entity {

  constructor(
    public image: Img,
    public x: number,
    public y: number,
  ) { }

}
