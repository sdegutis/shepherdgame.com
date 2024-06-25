
export class Camera {

  public mx = 0;
  public my = 0;

  constructor(
    private mw: number,
    private mh: number,
    private sw: number,
    private sh: number,
    private players: { entity: { box: { x: number, y: number } } }[],
  ) { }

  update() {
    const avgX = ((this.players[0].entity.box.x + this.players[1].entity.box.x + this.players[2].entity.box.x) / 3);
    const avgY = ((this.players[0].entity.box.y + this.players[1].entity.box.y + this.players[2].entity.box.y) / 3);

    this.mx = -(avgX - (this.sw / 2));
    this.my = -(avgY - (this.sh / 2));

    if (this.mx > 0) this.mx = 0;
    if (this.my > 0) this.my = 0;

    if (this.mx < this.sw - this.mw) this.mx = this.sw - this.mw;
    if (this.my < this.sh - this.mh) this.my = this.sh - this.mh;

    this.mx = Math.round(this.mx);
    this.my = Math.round(this.my);
  }

}
