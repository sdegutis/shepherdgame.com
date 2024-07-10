import { Player } from "./player.js";

export class Entity {

  dead = false;
  layer = 0;

  constructor(
    public x: number,
    public y: number,
    public image: OffscreenCanvas,
  ) { }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.image, this.x, this.y);
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

  update?: (t: number) => void;
  actOn?: (player: Player, x: number, y: number) => boolean;

}
