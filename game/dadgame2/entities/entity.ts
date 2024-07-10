export interface Logic {
  tryMove(entity: Entity, x: number, y: number): boolean;
}

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

  constructor(
    x: number,
    y: number,
    public image: OffscreenCanvas,
  ) {
    this.x = x;
    this.y = y;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.image, this.rx, this.ry);
    // ctx.strokeStyle = '#f00a';
    // ctx.lineWidth = 1;
    // ctx.beginPath();
    // ctx.rect(x + 0.5, y + 0.5, 7, 7);
    // ctx.stroke();
  }

  near(entity: Entity) {
    const dx = (this.x + 4) - (entity.x + 4);
    const dy = (this.y + 4) - (entity.y + 4);
    const d = Math.sqrt(dx ** 2 + dy ** 2);
    return (d < 20);
  }

  update?: (t: number, logic: Logic) => void;

  actOn?: (player: Entity, x: number, y: number) => boolean;

}
