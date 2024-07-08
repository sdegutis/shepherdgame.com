export class Entity {

  layer = 0;
  ox = 0; oy = 0;
  w = 8; h = 8;

  constructor(
    public x: number,
    public y: number,
    public image: OffscreenCanvas,
  ) { }

  draw(ctx: CanvasRenderingContext2D) {
    const x = Math.round(this.x);
    const y = Math.round(this.y);
    ctx.drawImage(this.image, x - this.ox, y - this.oy);

    // ctx.strokeStyle = '#f00a';
    // ctx.lineWidth = 1;
    // ctx.beginPath();
    // ctx.rect(x + 0.5, y + 0.5, this.w - 1, this.h - 1);
    // ctx.stroke();
  }

  near(entity: Entity) {
    const dx = this.x + this.ox - entity.x + entity.ox;
    const dy = this.y + this.oy - entity.y + entity.oy;

    const d = Math.sqrt(dx ** 2 + dy ** 2);
    return (d < 20);
  }

}
