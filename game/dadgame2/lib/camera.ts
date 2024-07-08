import { Player } from "../entities/player.js";

export class Camera {

  public mx = 0;
  public my = 0;

  constructor(
    private mw: number,
    private mh: number,
    private sw: number,
    private sh: number,
    private player: Player,
  ) { }

  update() {
    this.mx = -(this.player.entity.x - (this.sw / 2));
    this.my = -(this.player.entity.y - (this.sh / 2));

    if (this.mx > 0) this.mx = 0;
    if (this.my > 0) this.my = 0;

    if (this.mx < this.sw - this.mw) this.mx = this.sw - this.mw;
    if (this.my < this.sh - this.mh) this.my = this.sh - this.mh;

    this.mx = Math.round(this.mx);
    this.my = Math.round(this.my);
  }

}
