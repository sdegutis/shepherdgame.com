import { Entity } from "./entity.js";
import { Player } from "./player.js";

export class Wall extends Entity {

  public jumpThrough = false;

  override actOn = (player: Player, x: number, y: number): boolean => {
    if (this.jumpThrough) {
      if (y > 0) {
        return (this.y !== player.y + 7);
      }
      return true;
    }
    return false;
  };

}
