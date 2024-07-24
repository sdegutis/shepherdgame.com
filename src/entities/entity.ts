import { PixelImage } from '../lib/image.js';

export interface Logic {
  tryMove(entity: Entity, x: number, y: number): boolean;
}

export type Interaction = 'stop' | 'pass';

export class Entity {

  dead = false;
  layer = 0;

  public rx = 0;
  public ry = 0;

  private _x = 0;
  public get x(): number { return this._x; }
  public set x(v: number) { this._x = v; this.rx = Math.round(v); }

  private _y = 0;
  public get y(): number { return this._y; }
  public set y(v: number) { this._y = v; this.ry = Math.round(v); }

  image: PixelImage;

  constructor(
    x: number,
    y: number,
    image: PixelImage,
  ) {
    this.x = x;
    this.y = y;
    this.image = image;
  }

  update?: (t: number, logic: Logic) => void;

  collideWith?: (other: Entity, x: number, y: number) => Interaction;

}
