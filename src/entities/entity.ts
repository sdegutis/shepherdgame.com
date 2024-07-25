import { PixelImage } from '../lib/image.js';

export interface Logic {
  tryMove(entity: Entity, x: number, y: number): boolean;
}

export type Interaction = 'stop' | 'pass';

export class Entity {

  dead = false;
  layer = 0;

  constructor(
    public x: number,
    public y: number,
    public image: PixelImage,
  ) { }

  update?: (t: number, logic: Logic) => void;

  collideWith?: (other: Entity, x: number, y: number) => Interaction;

}
