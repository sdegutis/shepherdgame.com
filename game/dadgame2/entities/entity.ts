export class Entity {

  layer = 0;

  constructor(
    public x: number,
    public y: number,
    public image: OffscreenCanvas,
  ) { }

  draw(ctx: CanvasRenderingContext2D) {
    const x = this.x;
    const y = this.y;
    ctx.drawImage(this.image, x, y);

    // ctx.strokeStyle = '#f00a';
    // ctx.lineWidth = 1;
    // ctx.beginPath();
    // ctx.rect(x + 0.5, y + 0.5, this.w - 1, this.h - 1);
    // ctx.stroke();
  }

  near(entity: Entity) {
    const dx = (this.x + 4) - (entity.x + 4);
    const dy = (this.y + 4) - (entity.y + 4);

    const d = Math.sqrt(dx ** 2 + dy ** 2);
    return (d < 12);
  }

}
