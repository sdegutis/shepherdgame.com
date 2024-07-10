import { game1 } from "../main.js";
import { Entity } from "./entity.js";
import { Player } from "./player.js";

export class Bubble extends Entity {

  sitting = false;
  unsat = 0;

  override dead = true;

  reset(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.dead = false;
  }

  override actOn = (player: Player, x: number, y: number) => {
    if (x) {
      this.x += x;
      return true;
    }

    if (y < 0) {
      this.y -= 1;
      return true;
    }
    else if (y > 0) {
      // player.y -= 1;
      this.sitting = true;
      this.unsat = 1;
      this.image = game1.sprites[21].image;
      return false;
    }

    return true;
  };

  override update = (t: number) => {
    if (!this.sitting) {
      const durationMs = 1000;
      const percent = ((t % durationMs) / durationMs);
      const percentOfCircle = percent * Math.PI * 2;
      const distance = .5;
      this.x = this.x + -Math.sin(percentOfCircle) * distance;

      if (this.unsat) {
        this.unsat++;
        if (this.unsat === 3) {
          this.image = game1.sprites[5].image;
        }
        else if (this.unsat === 30) {
          this.dead = true;
        }
      }
    }

    this.y -= this.sitting ? -0.25 : 0.25;

    if (this.y < -8) {
      this.dead = true;
    }

    this.sitting = false;
  };

}
