import { Entity } from "./entity.js";

export class Wall extends Entity {

  public jumpThrough = false;

  override actOn = (player: Entity, x: number, y: number): boolean => {
    if (this.jumpThrough) {
      if (y > 0) {
        return (this.y !== player.y + 7);
      }
      return true;
    }
    return false;
  };

}
