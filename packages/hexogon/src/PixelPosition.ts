export class PixelPosition {
  get arr(): [number, number] {
    return [this.x, this.y];
  }

  public constructor(public x: number, public y: number) {};

  public clone() {
    return new PixelPosition(this.x, this.y);
  }

  public add(pos: PixelPosition | undefined | false | null) {
    if (pos) {
      this.x += pos.x;
      this.y += pos.y;
    }

    return this;
  }

  public subtract(pos: PixelPosition | undefined | false | null) {
    if (pos) {
      this.x -= pos.x;
      this.y -= pos.y;
    }

    return this;
  }

  public multiply(n: number) {
    this.x *= n;
    this.y *= n;
    return this;
  }

  public round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }
}
