import { Entity, Interaction, Logic } from "./entity.js";
import { Wall } from "./wall.js";

export class Bubble extends Entity {

  sitting = false;
  unsat = 0;

  aliveFor = 0;

  constructor(
    x: number,
    y: number,
    private openImage: OffscreenCanvas,
    public flatImage: OffscreenCanvas,
  ) {
    super(x, y, openImage);
    this.dead = true;
  }

  reset(x: number, y: number) {
    this.dead = false;

    this.x = x;
    this.y = y;

    this.image = this.openImage;
    this.aliveFor = 0;
    this.unsat = 0;
    this.sitting = false;
  }

  override collideWith = (other: Entity, x: number, y: number): Interaction => {
    if (other instanceof Wall && !other.jumpThrough) {
      this.dead = true;
      return 'stop';
    }

    return 'pass';
  };

  override update = (t: number, logic: Logic) => {
    this.aliveFor++;

    if (!this.sitting) {
      const durationMs = 1000;
      const percent = ((t % durationMs) / durationMs);
      const percentOfCircle = percent * Math.PI * 2;
      const distance = .5;

      const toMoveX = -Math.sin(percentOfCircle) * distance;
      logic.tryMove(this, toMoveX, 0);

      if (this.unsat) {
        this.unsat++;
        if (this.unsat === 3) {
          this.image = this.openImage;
        }
        else if (this.unsat === 30) {
          this.dead = true;
        }
      }
    }

    logic.tryMove(this, 0, this.sitting ? 0.25 : -0.25);

    this.sitting = false;
  };

}
